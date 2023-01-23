import {
  DiscordGuildRole,
  DiscordUser,
  DiscordUserGuild,
} from "../types/discord";
import { Fetch } from "./Fetch";

export class DiscordClient {
  fetch: Fetch;
  authorization: string;

  constructor(fetch: Fetch, authorization: string) {
    this.fetch = fetch;
    this.authorization = authorization;
  }

  async getLoggedInUser(): Promise<DiscordUser> {
    const userRequest = await this.fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: this.authorization,
      },
    });
    return await userRequest.json();
  }

  async getLoggedInUserGuilds(): Promise<DiscordUserGuild[]> {
    const userGuildRequest = await this.fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          authorization: this.authorization,
        },
      }
    );
    if (!userGuildRequest.ok) {
      throw new Error(
        `Error getting logged in user guilds: ${userGuildRequest.statusText}`
      );
    }
    return await userGuildRequest.json();
  }

  async getGuildRoles(serverId: string): Promise<DiscordGuildRole[]> {
    const guildRolesRequest = await this.fetch(
      `https://discord.com/api/guilds/${serverId}/roles`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    );
    if (!guildRolesRequest.ok) {
      throw new Error(
        `Error getting guild roles: ${guildRolesRequest.statusText}`
      );
    }
    return await guildRolesRequest.json();
  }
}

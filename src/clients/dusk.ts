import { Fetch } from "./Fetch";
import { DuskCrew } from "../types/dusk";
import { DiscordUserGuild } from "../types/discord";
import { Patch } from "./Patch";

export class DuskClient {
  fetch: Fetch;
  authorization: string;

  constructor(fetch: Fetch, authorization: string) {
    this.fetch = fetch;
    this.authorization = authorization;
  }

  async createCrew(crew: Patch<DuskCrew>): Promise<DuskCrew> {
    const createCrewRequest = await this.fetch(`/api/crews`, {
      method: "POST",
      headers: {
        authorization: this.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crew),
    });
    if (!createCrewRequest.ok) {
      throw new Error(`Unable to create crew ${createCrewRequest.statusText}`);
    }
    return await createCrewRequest.json();
  }

  async deleteCrew(crewId: string): Promise<void> {
    const createCrewRequest = await this.fetch(`/api/crews/${crewId}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    });
    if (!createCrewRequest.ok) {
      throw new Error(`Unable to delete crew ${createCrewRequest.statusText}`);
    }
    return;
  }

  async updateCrew({ crewId, ...crew }: Patch<DuskCrew>): Promise<DuskCrew> {
    const createCrewRequest = await this.fetch(`/api/crews/${crewId}`, {
      method: "PATCH",
      headers: {
        authorization: this.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crew),
    });
    if (!createCrewRequest.ok) {
      throw new Error(`Unable to create crew ${createCrewRequest.statusText}`);
    }
    return await createCrewRequest.json();
  }

  async getLoggedInUserCrews(): Promise<{
    crews: DuskCrew[];
    guilds: DiscordUserGuild[];
  }> {
    const crewsRequest = await this.fetch(`/api/crews`, {
      headers: {
        authorization: this.authorization,
      },
    });
    if (!crewsRequest.ok) {
      throw new Error(`Unable to get crews ${crewsRequest.statusText}`);
    }
    return await crewsRequest.json();
  }
}

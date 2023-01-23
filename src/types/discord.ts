export interface DiscordUser {
  id: string;
  username: string;
}

export interface DiscordUserGuild {
  id: string;
  name: string;
  icon: string;
  roles?: DiscordGuildRole[];
}

export interface DiscordGuildRole {
  id: string;
  name: string;
}

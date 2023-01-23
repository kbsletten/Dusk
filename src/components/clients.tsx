import React, { createContext, useContext } from "react";
import { DiscordClient } from "../clients/discord";
import { DuskClient } from "../clients/dusk";

function getOauthState() {
  let oauthState = localStorage.getItem("oauth-state");
  if (!oauthState) {
    oauthState = "";
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
      oauthState += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    localStorage.setItem("oauth-state", oauthState);
  }
  return oauthState;
}

export interface ClientContext {
  logInUrl: string;
  duskClient?: DuskClient;
  discordClient?: DiscordClient;
}

const ClientContext = createContext<ClientContext>({ logInUrl: "" });

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const oauthState = getOauthState();
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [accessToken, tokenType, state] = [
    fragment.get("access_token"),
    fragment.get("token_type"),
    decodeURIComponent(fragment.get("state") ?? ""),
  ];
  const scopes = ["identify", "guilds"];
  const logInUrl = `https://discord.com/api/oauth2/authorize?client_id=1065409921585266798&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=token&scope=${scopes.join(
    "%20"
  )}&state=${encodeURIComponent(oauthState)}`;
  var isValid = true;
  if (state && oauthState !== state) {
    console.error(`Invalid oauth state ${state}.`);
    isValid = false;
  }
  if (!accessToken) {
    isValid = false;
  }
  const authorization = `${tokenType} ${accessToken}`;
  const discordClient = !isValid
    ? undefined
    : new DiscordClient(fetch.bind(window), authorization);
  const duskClient = !isValid
    ? undefined
    : new DuskClient(fetch.bind(window), authorization);
  return (
    <ClientContext.Provider value={{ logInUrl, discordClient, duskClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  return useContext(ClientContext);
}

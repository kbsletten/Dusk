import express from "express";
import fetch from "node-fetch";
import { DiscordClient } from "./clients/discord";
import config from "./config.json";
import { DuskDatabase } from "./db/dusk";
import NodeCache from "node-cache";
import merge from "lodash/merge";
import { v4 as uuid } from "uuid";
import { DuskCrew } from "./types/dusk";
import { Patch } from "./clients/Patch";

const app = express();
const db = new DuskDatabase();
const cache = new NodeCache();

async function getOrLoad<T>(key: string, func: () => Promise<T>): Promise<T> {
  let value = cache.get(key) as T;
  if (value === undefined) {
    value = await func();
    cache.set(key, value);
  }
  return value;
}

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/crews", async (req, resp) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    resp.status(401).send("Missing authorization header.");
    return;
  }
  const discordClient = new DiscordClient(fetch, authorization);
  const guilds = await getOrLoad(`user-guilds-${authorization}`, () =>
    discordClient.getLoggedInUserGuilds()
  );
  const crews = await db.getCrewsForServers(guilds.map((guild) => guild.id));

  resp.json({ crews, guilds });
});

app.post("/api/crews", async (req, resp) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    resp.status(401).send("Missing authorization header.");
    return;
  }
  const serverId = req.body.serverId;
  if (!serverId) {
    resp.status(400).send("Missing required parameter: serverId");
    return;
  }
  const discordClient = new DiscordClient(fetch, authorization);
  const guilds = await getOrLoad(`user-guilds-${authorization}`, () =>
    discordClient.getLoggedInUserGuilds()
  );
  const guild = guilds.find((it) => it.id === serverId);
  if (!guild) {
    resp.status(404).send("Server not found");
  }
  const game = await db.createCrew({ ...req.body, crewId: uuid() });
  resp.json(game);
});

app.delete("/api/crews/:crewId", async (req, resp) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    resp.status(401).send("Missing authorization header.");
    return;
  }
  const crewId = req.params.crewId;
  if (!crewId) {
    resp.status(400).send("Missing required parameter: crewId");
    return;
  }
  const discordClient = new DiscordClient(fetch, authorization);
  const guilds = await getOrLoad(`user-guilds-${authorization}`, () =>
    discordClient.getLoggedInUserGuilds()
  );
  const crew = await db.getCrew(crewId);
  const guild = guilds.find((it) => it.id === crew.serverId);
  if (!guild) {
    resp.status(404).send("Server not found");
  }
  await db.deleteCrew(crewId);
  resp.status(200).send("");
});

app.patch("/api/crews/:crewId", async (req, resp) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    resp.status(401).send("Missing authorization header.");
    return;
  }
  const crewId = req.params.crewId;
  if (!crewId) {
    resp.status(400).send("Missing required parameter: crewId");
    return;
  }
  const discordClient = new DiscordClient(fetch, authorization);
  const guilds = await getOrLoad(`user-guilds-${authorization}`, () =>
    discordClient.getLoggedInUserGuilds()
  );
  const crew = await db.getCrew(crewId);
  const guild = guilds.find((it) => it.id === crew.serverId);
  if (!guild) {
    resp.status(404).send("Server not found");
  }
  const updated = merge(crew, req.body as Patch<DuskCrew>);
  resp.json(
    await db.updateCrew({
      ...updated,
      cohorts: updated.cohorts.filter((it) => it && !it.__DELETE),
    })
  );
});

app.listen(config.port, () => {
  console.log(`Example app listening on http://localhost:${config.port}`);
});

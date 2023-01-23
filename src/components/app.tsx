import React, { useEffect, useRef, useState } from "react";
import merge from "lodash/merge";
import { Patch } from "../clients/Patch";
import { DiscordUser, DiscordUserGuild } from "../types/discord";
import { DuskCrew } from "../types/dusk";
import { useClients } from "./clients";
import { defaultCrew } from "../blades";
import { CrewEditor } from "./crew-editor";

export function App() {
  const [user, setUser] = useState<DiscordUser | undefined>(undefined);
  const [userGuilds, setUserGuilds] = useState<DiscordUserGuild[] | undefined>(
    undefined
  );
  const [crews, setCrews] = useState<DuskCrew[] | undefined>(undefined);
  const { discordClient, duskClient, logInUrl } = useClients();

  useEffect(() => {
    async function loadDiscordUser() {
      if (!discordClient) {
        return;
      }
      try {
        setUser(await discordClient.getLoggedInUser());
        const { crews, guilds } = await duskClient.getLoggedInUserCrews();
        setUserGuilds(guilds);
        setCrews(crews);
      } catch (e) {
        console.error(e);
      }
    }
    loadDiscordUser();
  }, [discordClient]);

  async function createNewCrew(serverId: string) {
    const crew = await duskClient.createCrew(
      defaultCrew(
        serverId,
        userGuilds.find((guild) => guild.id === serverId).name
      )
    );
    setCrews((crews) => [...crews, crew]);
  }

  async function deleteCrew(crewId: string) {
    await duskClient.deleteCrew(crewId);
    setCrews((crews) => crews.filter((crew) => crew.crewId !== crewId));
  }

  const updateRef = useRef<{
    crewId: string;
    timeout: NodeJS.Timeout;
    newProps: Patch<DuskCrew>;
  }>({ crewId: undefined, timeout: undefined, newProps: {} });

  async function updateCrew(crewId: string, newProps: Patch<DuskCrew>) {
    console.log(`${crewId} ${JSON.stringify(newProps)}`);
    if (updateRef.current.crewId === crewId) {
      clearTimeout(updateRef.current.timeout);
      updateRef.current.newProps = newProps = merge(
        { ...updateRef.current.newProps },
        newProps
      );
    } else {
      updateRef.current.newProps = newProps;
      updateRef.current.crewId = crewId;
    }
    setCrews((crews) =>
      crews.map((it) => (it.crewId === crewId ? merge(it, newProps) : it))
    );
    console.log(`${JSON.stringify(updateRef.current)}`);
    updateRef.current.timeout = setTimeout(async () => {
      console.log(`${crewId} ${JSON.stringify(newProps)}`);
      let crew = crews.find((crew) => crew.crewId === crewId);
      crew = await duskClient.updateCrew({ crewId, ...newProps });
      setCrews((crews) =>
        crews.map((it) => (it.crewId === crew.crewId ? crew : it))
      );
      if (updateRef.current.newProps === newProps) {
        updateRef.current.newProps = {};
      }
    }, 2000);
  }

  if (!user) {
    return <a href={logInUrl}>Log in!</a>;
  }

  userGuilds?.sort((a, b) => {
    const aCrews = crews.filter((crew) => crew.serverId === a.id);
    const bCrews = crews.filter((crew) => crew.serverId === b.id);
    if (aCrews.length !== bCrews.length) {
      return bCrews.length - aCrews.length;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <h1>Welcome to Dusk, {user.username}!</h1>
      {!userGuilds ? (
        <div>Loading...</div>
      ) : (
        <div>
          {userGuilds.map((userGuild) => (
            <CrewEditor
              key={userGuild.id}
              guild={userGuild}
              crews={crews?.filter((crew) => crew.serverId === userGuild.id)}
              createNewCrew={createNewCrew}
              updateCrew={updateCrew}
              deleteCrew={deleteCrew}
            />
          ))}
        </div>
      )}
    </div>
  );
}

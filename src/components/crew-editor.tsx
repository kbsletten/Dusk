import React from "react";
import styled from "styled-components";
import { Patch } from "../clients/Patch";
import { DiscordUserGuild } from "../types/discord";
import { DuskCrew } from "../types/dusk";
import { defaultClock, defaultCohort } from "../blades";
import { Selectable } from "./selectable";
import { Input, Select, Textarea, Option } from "./input";
import { CohortEditor } from "./cohort-editor";
import { ClockEditor } from "./clock-editor";

export const CrewContainer = styled.div`
  & > div + div {
    margin-top: 8px;
  }
`;

function atIndex<T>(value: T, index: number) {
  const array = new Array();
  array[index] = value;
  return array;
}

export function CrewEditor({
  guild,
  crews,
  createNewCrew,
  updateCrew,
  deleteCrew,
}: {
  guild: DiscordUserGuild;
  crews: DuskCrew[];
  createNewCrew: (serverId: string) => Promise<void>;
  updateCrew: (crewId: string, newProps: Patch<DuskCrew>) => Promise<void>;
  deleteCrew: (crewId: string) => Promise<void>;
}) {
  return (
    <div>
      <h2>
        {!guild.icon ? null : (
          <>
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=16`}
            />{" "}
          </>
        )}
        {guild.name}{" "}
        {crews.length ? null : (
          <button onClick={() => createNewCrew(guild.id)}>New Crew</button>
        )}
      </h2>
      {(crews ?? []).map((crew) => (
        <CrewContainer key={crew.crewId}>
          <div>
            Name:{" "}
            <Input
              type="text"
              onChange={(name) => updateCrew(crew.crewId, { name })}
              value={crew.name}
            />
          </div>
          <div>
            Reputation:{" "}
            <Select
              onChange={(reputation) =>
                updateCrew(crew.crewId, {
                  reputation,
                })
              }
              value={crew.reputation}
              options={
                [
                  { value: "Ambitious", label: "Ambitious" },
                  { value: "Brutal", label: "Brutal" },
                  { value: "Daring", label: "Daring" },
                  { value: "Honorable", label: "Honorable" },
                  { value: "Professional", label: "Professional" },
                  { value: "Savvy", label: "Savvy" },
                  { value: "Subtle", label: "Subtle" },
                  { value: "Strange", label: "Strange" },
                ] as { value: DuskCrew["reputation"]; label: string }[]
              }
            />
          </div>
          <div>
            Lair:{" "}
            <Input
              type="text"
              onChange={(lair) => updateCrew(crew.crewId, { lair })}
              value={crew.lair}
            />
          </div>
          <div>
            Rep/Turf:{" "}
            <Selectable
              selected={crew.rep}
              antiselected={crew.turf}
              total={12}
              onChange={(rep, turf) => updateCrew(crew.crewId, { rep, turf })}
            />
          </div>
          <div>
            Hold:{" "}
            <Select
              value={crew.hold}
              onChange={(hold) => updateCrew(crew.crewId, { hold })}
              options={
                [
                  { value: "Strong", label: "Strong" },
                  { value: "Weak", label: "Weak" },
                ] as Option<DuskCrew["hold"]>[]
              }
            />
          </div>
          <div>
            Tier:{" "}
            <Selectable
              selected={crew.tier}
              total={4}
              onChange={(tier) => updateCrew(crew.crewId, { tier })}
            />
          </div>
          <div>
            Heat:{" "}
            <Selectable
              selected={crew.heat}
              total={9}
              onChange={(heat) => updateCrew(crew.crewId, { heat })}
            />
          </div>
          <div>
            Wanted:{" "}
            <Selectable
              selected={crew.wanted}
              total={4}
              onChange={(wanted) => updateCrew(crew.crewId, { wanted })}
            />
          </div>
          <div>
            Coin:{" "}
            <Selectable
              selected={crew.coin}
              total={4 + crew.vaults}
              onChange={(coin) => updateCrew(crew.crewId, { coin })}
            />
          </div>
          <div>Special abilities:</div>
          <div>
            <Textarea
              onChange={(specialAbilities) =>
                updateCrew(crew.crewId, { specialAbilities })
              }
              value={crew.specialAbilities}
            />
          </div>
          <div>
            XP:{" "}
            <Selectable
              selected={crew.xp}
              total={8}
              onChange={(xp) => updateCrew(crew.crewId, { xp })}
            />
          </div>
          <div>Contacts:</div>
          <div>
            <Textarea
              onChange={(contacts) => updateCrew(crew.crewId, { contacts })}
              value={crew.contacts}
            />
          </div>
          <div>Upgrades:</div>
          <div>
            <Textarea
              onChange={(upgrades) => updateCrew(crew.crewId, { upgrades })}
              value={crew.upgrades}
            />
          </div>
          <div>Hunting grounds:</div>
          <div>
            <Textarea
              onChange={(huntingGrounds) =>
                updateCrew(crew.crewId, { huntingGrounds })
              }
              value={crew.huntingGrounds}
            />
          </div>
          <div>
            Cohorts:{" "}
            <button
              onClick={() =>
                updateCrew(crew.crewId, {
                  cohorts: [...crew.cohorts, defaultCohort(crew.name)],
                })
              }
            >
              New Cohort
            </button>
          </div>
          {crew.cohorts.map((cohort, index) =>
            cohort.__DELETE ? null : (
              <CohortEditor
                key={index}
                cohort={cohort}
                updateCohort={(cohort) =>
                  updateCrew(crew.crewId, { cohorts: atIndex(cohort, index) })
                }
              />
            )
          )}
          <div>
            Clocks:{" "}
            <button
              onClick={() =>
                updateCrew(crew.crewId, {
                  clocks: [...crew.clocks, defaultClock()],
                })
              }
            >
              New Clock
            </button>
          </div>
          {crew.clocks.map((clock, index) =>
            clock.__DELETE ? null : (
              <ClockEditor
                key={index}
                clock={clock}
                updateClock={(clock) =>
                  updateCrew(crew.crewId, { clocks: atIndex(clock, index) })
                }
              />
            )
          )}
          <div>
            <button onClick={() => deleteCrew(crew.crewId)}>Delete Crew</button>
          </div>
        </CrewContainer>
      ))}
    </div>
  );
}

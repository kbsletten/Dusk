import React from "react";
import styled from "styled-components";
import { Deletable, DuskClock } from "../types/dusk";
import { Patch } from "../clients/Patch";
import { Input } from "./input";
import { Selectable } from "./selectable";

const DELETE = { __DELETE: true };

export const ClockContainer = styled.div`
  width: 267px;
  margin-left: 8px;
  padding: 4px;
  --width: 12px;
  border: solid 1px white;
  border-radius: 5px;
  & > div + div {
    margin-top: 8px;
  }
`;

export function ClockEditor({
  clock,
  updateClock,
}: {
  clock: DuskClock;
  updateClock: (clock: Patch<DuskClock & Deletable>) => void;
}) {
  return (
    <ClockContainer>
      <div>
        Name:{" "}
        <Input
          type="text"
          value={clock.name}
          onChange={(name) => updateClock({ name })}
        />
      </div>
      <div>
        Segments:{" "}
        <Input
          type="number"
          min={"0"}
          value={clock.segments ?? 0}
          onChange={(segments) => updateClock({ segments: parseInt(segments) })}
        />
      </div>
      <div>
        Progress:{" "}
        <Selectable
          selected={clock.progress}
          total={clock.segments}
          onChange={(progress) => updateClock({ progress })}
        />
      </div>
      <div>
        <button onClick={() => updateClock(DELETE)}>Delete Clock</button>
      </div>
    </ClockContainer>
  );
}

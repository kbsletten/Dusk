import React from "react";
import styled from "styled-components";
import { Patch } from "../clients/Patch";
import { Deletable, DuskCohort } from "../types/dusk";
import { Input, Select, Option } from "./input";

const DELETE = { __DELETE: true };

export const CohortContainer = styled.div`
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

export function CohortEditor({
  cohort,
  updateCohort,
}: {
  cohort: DuskCohort;
  updateCohort: (cohort: Patch<DuskCohort & Deletable>) => void;
}) {
  return (
    <CohortContainer>
      <div>
        Name:{" "}
        <Input
          type="text"
          value={cohort.name}
          onChange={(name) => updateCohort({ name })}
        />
      </div>
      <div>
        Type:{" "}
        <Select
          value={cohort.kind}
          options={
            [
              { value: "Gang", label: "Gang" },
              { value: "Expert", label: "Expert" },
            ] as Option<DuskCohort["kind"]>[]
          }
          onChange={(kind) => updateCohort({ kind })}
        />
      </div>
      <div>
        Harm:{" "}
        <Select
          value={cohort.harm}
          options={
            [
              { value: "None", label: "None" },
              { value: "Weakened", label: "Weakened" },
              { value: "Impaired", label: "Impaired" },
              { value: "Broken", label: "Broken" },
            ] as Option<DuskCohort["harm"]>[]
          }
          onChange={(harm) => updateCohort({ harm })}
        />
      </div>
      <div>
        Type:{" "}
        <Input
          type="text"
          value={cohort.type}
          onChange={(type) => updateCohort({ type })}
        />
      </div>
      <div>
        Edges:{" "}
        <Input
          type="text"
          value={cohort.edges}
          onChange={(edges) => updateCohort({ edges })}
        />
      </div>
      <div>
        Flaws:{" "}
        <Input
          type="text"
          value={cohort.flaws}
          onChange={(flaws) => updateCohort({ flaws })}
        />
      </div>
      <div>
        <button onClick={() => updateCohort(DELETE)}>Delete Cohort</button>
      </div>
    </CohortContainer>
  );
}

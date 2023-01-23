export interface DuskGame {
  crews: DuskCrew[];
  serverId: string;
}

export interface DuskPhase {
  name: string;
  segments: number;
}

export interface DuskClock {
  name: string;
  progress: number;
  segments: number;
}

export interface Deletable {
  __DELETE?: boolean;
}

export interface DuskCrew {
  clocks: (DuskClock & Deletable)[];
  cohorts: (DuskCohort & Deletable)[];
  coin: number;
  contacts: string;
  crewId: string;
  heat: number;
  hold: "Weak" | "Strong";
  huntingGrounds: string;
  lair: string;
  name: string;
  rep: number;
  reputation:
    | ""
    | "Ambitious"
    | "Brutal"
    | "Daring"
    | "Honorable"
    | "Professional"
    | "Savvy"
    | "Subtle"
    | "Strange";
  serverId: string;
  specialAbilities: string;
  tier: number;
  turf: number;
  upgrades: string;
  vaults: number;
  wanted: number;
  xp: number;
}

export type DuskCohort = {
  name: string;
  harm: "None" | "Weakened" | "Impaired" | "Broken";
  kind: "Gang" | "Expert";
  type: string;
  edges: string;
  flaws: string;
};

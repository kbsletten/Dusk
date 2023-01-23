import { DuskClock, DuskCohort, DuskCrew } from "./types/dusk";

export function defaultCrew(
  serverId: string,
  name: string
): Omit<DuskCrew, "crewId"> {
  return {
    clocks: [],
    cohorts: [],
    coin: 2,
    contacts: "",
    heat: 0,
    hold: "Strong",
    huntingGrounds: "",
    lair: "",
    name,
    rep: 0,
    reputation: "",
    serverId,
    specialAbilities: "",
    tier: 0,
    turf: 0,
    upgrades: "",
    vaults: 0,
    wanted: 0,
    xp: 0,
  };
}

export function defaultCohort(name: string): DuskCohort {
  return {
    name: `${name}'s cohort`,
    harm: "None",
    kind: "Expert",
    edges: "",
    flaws: "",
    type: "",
  };
}

export function defaultClock(): DuskClock {
  return {
    name: "New Clock",
    progress: 0,
    segments: 4,
  };
}

export interface RollResult {
  rolls: number[];
  result: number;
  outcome:
    | "CRITICAL success"
    | "full success"
    | "partial success"
    | "bad outcome";
  display: string;
}

export function roll(dice: number): RollResult {
  const rolls: number[] = [];
  let result = dice === 0 ? 6 : 1;
  let critical = 0;
  for (let i = 0; i < (dice || 2); i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    rolls.push(roll);
    result = (dice === 0 ? Math.min : Math.max)(roll, result ?? roll);
    if (dice > 0 && roll === 6) {
      critical++;
    }
  }
  const resultIndex = rolls.indexOf(result);
  const outcome =
    critical > 1
      ? "CRITICAL success"
      : result === 6
      ? "full success"
      : result > 3
      ? "partial success"
      : "bad outcome";
  return {
    rolls,
    result,
    outcome,
    display: `${dice}d (${rolls
      .map((roll, index) => (index === resultIndex ? `${roll}` : `~~${roll}~~`))
      .join(", ")}) = \`${result}\`; ${outcome}`,
  };
}

export function roman(numeral: number) {
  switch (numeral) {
    case 0:
      return "0";
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
  }
  return numeral.toString();
}

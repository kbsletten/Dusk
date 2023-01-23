import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ApplicationCommandOptionType,
  APIEmbedField,
} from "discord.js";
import { roll } from "./blades";
import config from "./config.json";
import { DuskDatabase } from "./db/dusk";
import { roman } from "./blades";

const { clientId, token } = config;

const commands = [
  {
    name: "roll",
    description: "Make a custom roll!",
    options: [
      {
        type: ApplicationCommandOptionType.Integer,
        name: "dice",
        description: "The number of dice to roll",
        min_value: 0,
      },
    ],
  },
  {
    name: "crew",
    description: "View the crew sheet!",
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

const db = new DuskDatabase();

function tembed(title: string) {
  return { title };
}

function field(name: string, value: string, inline?: boolean): APIEmbedField {
  return { name, value: value || "(blank)", inline };
}

function attr(name: string, value: string) {
  if (!value) {
    return "";
  }
  return `**${name}**: ${value}
`;
}

function sfield(
  name: string,
  selected: number,
  total: number,
  inline?: boolean,
  antiselected?: number
): APIEmbedField {
  const filled = "◈".repeat(selected);
  const empty = "◇".repeat(total - selected - (antiselected ?? 0));
  const blocked = "◆".repeat(antiselected ?? 0);
  return field(name, `${filled}${empty}${blocked}`, inline);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  switch (interaction.commandName) {
    case "roll": {
      const dice = interaction.options.getInteger("dice") ?? 0;
      const { display } = roll(dice);
      interaction.reply(`Custom roll: ${display}`);
      break;
    }
    case "crew": {
      const guildId = interaction.guildId;
      if (!guildId) {
        console.error(`Unable to get crews for interaction: missing guildId`);
        return;
      }
      const [crew] = await db.getCrewsForServers([guildId]);
      interaction.reply({
        embeds: [
          {
            title: `Crew Sheet: ${crew.name} (Tier ${roman(crew.tier)})`,
            fields: [
              field("Reputation", crew.reputation, true),
              field("Lair", crew.lair, true),
              field("Hold", crew.hold, true),
              sfield("Rep/Turf", crew.rep, 12, true, crew.turf),
              sfield("Heat", crew.heat, 9, true),
              sfield("Wanted", crew.wanted, 4, true),
              sfield("Coin", crew.coin, 4 + crew.vaults, true),
              sfield("XP", crew.xp, 8, true),
              field("Contacts", crew.contacts),
              field("Upgrades", crew.upgrades),
              field("Hunting Grounds", crew.huntingGrounds),
              ...crew.cohorts.map((cohort) =>
                field(
                  `Cohort: ${cohort.name} (Quality: ${
                    cohort.kind == "Expert" ? crew.tier + 1 : crew.tier
                  }, Scale: ${cohort.kind === "Expert" ? 0 : crew.tier})`,
                  `${attr("Harm", cohort.harm)}${attr(
                    "Type",
                    cohort.type
                  )}${attr("Edges", cohort.edges)}${attr(
                    "Flaws",
                    cohort.flaws
                  )}`
                )
              ),
              ...crew.clocks.map((clock) =>
                sfield(
                  `Clock: ${clock.name}`,
                  clock.progress,
                  clock.segments,
                  true
                )
              ),
            ],
          },
        ],
      });
    }
  }
});

client.login(token);

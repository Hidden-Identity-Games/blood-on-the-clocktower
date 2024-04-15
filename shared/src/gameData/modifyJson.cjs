/* eslint-disable */
const rolesJson = require("./rolesCombined.json");
const fs = require("fs");
const path = require("path");

const newJson = rolesJson.filter(role => role.name).filter(role => role.team !== "fabled" ).map(
  ({
    otherNight,
    otherNightReminder,
    firstNight,
    firstNightReminder,
    remindersGlobal,
    team,
    reminders,
    image,
    flavor,
    setup,
    ...rest
  }) => ({
    ...rest,
    edition: "fall of rome",
    imageSrc: image,
    setup: setup ?? false,
    team:  team[0].toUpperCase() + team.slice(1),
    reminders: [...(reminders || []), ...(remindersGlobal|| [])].map(r => ({ 
      name: r,
      type: "info",
    })),
    firstNight: firstNight
      ? {
          reminder: firstNightReminder,
          order: firstNight,
        }
      : null,
    otherNight: otherNight
      ? {
          reminder: otherNightReminder,
          order: otherNight,
        }
      : null,
  }),
);

fs.writeFileSync(
  path.join(__dirname, "nextJson.json"),
  JSON.stringify(newJson, null, 4),
);

fs.writeFileSync(
  path.join(__dirname, "script.json"),
  JSON.stringify(newJson.filter(role => role!=="traveler").map(({id}) => ({id})))
)

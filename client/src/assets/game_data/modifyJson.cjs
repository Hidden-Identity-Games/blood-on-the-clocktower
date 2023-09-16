const rolesJson = require("./rolesCombined.json");
const fs = require("fs");
const path = require("path");

const newJson = rolesJson.map(
  ({
    otherNight,
    otherNightReminder,
    firstNight,
    firstNightReminder,
    ...rest
  }) => ({
    ...rest,
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

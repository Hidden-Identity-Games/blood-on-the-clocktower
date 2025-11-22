import { describe, expect, it } from "vitest";

import { validateCustomScript } from "../src/GMRoute/GMSetup/ScriptSelect";

// TODO: Do this on the comonent instead of the validator!
describe("validateCustomScript", () => {
  it("raises invalid characters", () => {
    expect(() => validateCustomScript(`["abc123"]`)).toThrowError(/abc123/);
  });

  describe("example script from botc website", () => {
    const script = `[{"id": "_meta", "name": "Like 27 Frogs", "author": "eben", "background": "https://raw.githubusercontent.com/enthusiastick/like27frogs/main/img/background.jpg", "isOfficial": false}, {"id": "knight"}, {"id": "librarian"}, {"id": "pixie"}, {"id": "balloonist"}, {"id": "chambermaid"}, {"id": "villageidiot"}, {"id": "undertaker"}, {"id": "seamstress"}, {"id": "professor"}, {"id": "artist"}, {"id": "soldier"}, {"id": "minstrel"}, {"id": "ravenkeeper"}, {"id": "ogre"}, {"id": "sweetheart"}, {"id": "saint"}, {"id": "barber"}, {"id": "assassin"}, {"id": "xaan"}, {"id": "marionette"}, {"id": "summoner"}, {"id": "boffin"}, {"id": "nodashii"}, {"id": "shabaloth"}, {"id": "ojo"}]`;

    describe("raw", () => {
      it("matches snapshot", () => {
        expect(validateCustomScript(script)).toMatchInlineSnapshot(`
          [
            {
              "id": "knight",
            },
            {
              "id": "librarian",
            },
            {
              "id": "pixie",
            },
            {
              "id": "balloonist",
            },
            {
              "id": "chambermaid",
            },
            {
              "id": "villageidiot",
            },
            {
              "id": "undertaker",
            },
            {
              "id": "seamstress",
            },
            {
              "id": "professor",
            },
            {
              "id": "artist",
            },
            {
              "id": "soldier",
            },
            {
              "id": "minstrel",
            },
            {
              "id": "ravenkeeper",
            },
            {
              "id": "ogre",
            },
            {
              "id": "sweetheart",
            },
            {
              "id": "saint",
            },
            {
              "id": "barber",
            },
            {
              "id": "assassin",
            },
            {
              "id": "xaan",
            },
            {
              "id": "marionette",
            },
            {
              "id": "summoner",
            },
            {
              "id": "boffin",
            },
            {
              "id": "nodashii",
            },
            {
              "id": "shabaloth",
            },
            {
              "id": "ojo",
            },
          ]
        `);
      });
    });
    describe("formatted", () => {
      it("matches snapshot", () => {
        expect(
          validateCustomScript(JSON.stringify(JSON.parse(script), null, 4)),
        ).toMatchInlineSnapshot(`
          [
            {
              "id": "knight",
            },
            {
              "id": "librarian",
            },
            {
              "id": "pixie",
            },
            {
              "id": "balloonist",
            },
            {
              "id": "chambermaid",
            },
            {
              "id": "villageidiot",
            },
            {
              "id": "undertaker",
            },
            {
              "id": "seamstress",
            },
            {
              "id": "professor",
            },
            {
              "id": "artist",
            },
            {
              "id": "soldier",
            },
            {
              "id": "minstrel",
            },
            {
              "id": "ravenkeeper",
            },
            {
              "id": "ogre",
            },
            {
              "id": "sweetheart",
            },
            {
              "id": "saint",
            },
            {
              "id": "barber",
            },
            {
              "id": "assassin",
            },
            {
              "id": "xaan",
            },
            {
              "id": "marionette",
            },
            {
              "id": "summoner",
            },
            {
              "id": "boffin",
            },
            {
              "id": "nodashii",
            },
            {
              "id": "shabaloth",
            },
            {
              "id": "ojo",
            },
          ]
        `);
      });
    });
  });

  describe("example script from azuresites", () => {
    const script = `[{"id": "_meta", "logo": "https://i.imgur.com/OAs1fvK.png", "name": "Extension Cord", "author": "Viva La Sam"}, {"id": "investigator"}, {"id": "pixie"}, {"id": "empath"}, {"id": "dreamer"}, {"id": "mathematician"}, {"id": "oracle"}, {"id": "monk"}, {"id": "artist"}, {"id": "fisherman"}, {"id": "huntsman"}, {"id": "soldier"}, {"id": "ravenkeeper"}, {"id": "cannibal"}, {"id": "puzzlemaster"}, {"id": "recluse"}, {"id": "mutant"}, {"id": "damsel"}, {"id": "barber"}, {"id": "poisoner"}, {"id": "spy"}, {"id": "scarletwoman"}, {"id": "boomdandy"}, {"id": "marionette"}, {"id": "nodashii"}, {"id": "bishop"}, {"id": "bonecollector"}, {"id": "bureaucrat"}, {"id": "butcher"}, {"id": "matron"}, {"id": "sentinel"}]`;

    describe("raw", () => {
      it("matches snapshot", () => {
        expect(validateCustomScript(script)).toMatchInlineSnapshot(`
          [
            {
              "id": "investigator",
            },
            {
              "id": "pixie",
            },
            {
              "id": "empath",
            },
            {
              "id": "dreamer",
            },
            {
              "id": "mathematician",
            },
            {
              "id": "oracle",
            },
            {
              "id": "monk",
            },
            {
              "id": "artist",
            },
            {
              "id": "fisherman",
            },
            {
              "id": "huntsman",
            },
            {
              "id": "soldier",
            },
            {
              "id": "ravenkeeper",
            },
            {
              "id": "cannibal",
            },
            {
              "id": "puzzlemaster",
            },
            {
              "id": "recluse",
            },
            {
              "id": "mutant",
            },
            {
              "id": "damsel",
            },
            {
              "id": "barber",
            },
            {
              "id": "poisoner",
            },
            {
              "id": "spy",
            },
            {
              "id": "scarletwoman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "nodashii",
            },
          ]
        `);
      });
    });
    describe("formatted", () => {
      it("matches snapshot", () => {
        expect(
          validateCustomScript(JSON.stringify(JSON.parse(script), null, 4)),
        ).toMatchInlineSnapshot(`
          [
            {
              "id": "investigator",
            },
            {
              "id": "pixie",
            },
            {
              "id": "empath",
            },
            {
              "id": "dreamer",
            },
            {
              "id": "mathematician",
            },
            {
              "id": "oracle",
            },
            {
              "id": "monk",
            },
            {
              "id": "artist",
            },
            {
              "id": "fisherman",
            },
            {
              "id": "huntsman",
            },
            {
              "id": "soldier",
            },
            {
              "id": "ravenkeeper",
            },
            {
              "id": "cannibal",
            },
            {
              "id": "puzzlemaster",
            },
            {
              "id": "recluse",
            },
            {
              "id": "mutant",
            },
            {
              "id": "damsel",
            },
            {
              "id": "barber",
            },
            {
              "id": "poisoner",
            },
            {
              "id": "spy",
            },
            {
              "id": "scarletwoman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "nodashii",
            },
          ]
        `);
      });
    });
  });

  describe("Simple script format", () => {
    it("returns id list format without meta", () => {
      expect(
        validateCustomScript(
          `[{ "id": "_meta" }, "washerwoman", "investigator"]`,
        ),
      ).toMatchObject([{ id: "washerwoman" }, { id: "investigator" }]);
    });
  });

  describe("id format", () => {
    it("returns id list format without meta", () => {
      expect(
        validateCustomScript(
          `[{ "id": "_meta" }, { "id": "washerwoman"}, {"id": "investigator"}]`,
        ),
      ).toMatchObject([{ id: "washerwoman" }, { id: "investigator" }]);
    });
  });

  describe("fabled and travelers", () => {
    it("filters out fabled and travelers", () => {
      expect(
        validateCustomScript(
          `[{ "id": "_meta" }, "washerwoman", "investigator", "doomsayer", "gunslinger"]`,
        ),
      ).toMatchObject([{ id: "washerwoman" }, { id: "investigator" }]);
    });
  });
});

import { describe, expect, it } from "vitest";

import { validateCustomScript } from "../src/GMRoute/GMSetup/ScriptSelect";

// TODO: Do this on the comonent instead of the validator!
describe("validateCustomScript", () => {
  it("raises invalid characters", () => {
    expect(() => validateCustomScript(`["abc123"]`)).toThrowError(/abc123/);
  });

  describe("example script from botc website", () => {
    const script = `[{"id":"_meta","author":"Viva La Sam","name":"Extension Cord"},"investigator","pixie","empath","dreamer","mathematician","oracle","monk","artist","fisherman","huntsman","soldier","ravenkeeper","cannibal","puzzlemaster","recluse","mutant","damsel","barber","poisoner","spy","scarlet_woman","boomdandy","marionette","no_dashii","bishop","bone_collector","bureaucrat","butcher","matron","sentinel"]`;

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
              "id": "scarlet_woman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "no_dashii",
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
              "id": "scarlet_woman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "no_dashii",
            },
          ]
        `);
      });
    });
  });

  describe("example script from azuresites", () => {
    const script = `[{"id": "_meta", "logo": "https://i.imgur.com/OAs1fvK.png", "name": "Extension Cord", "author": "Viva La Sam"}, {"id": "investigator"}, {"id": "pixie"}, {"id": "empath"}, {"id": "dreamer"}, {"id": "mathematician"}, {"id": "oracle"}, {"id": "monk"}, {"id": "artist"}, {"id": "fisherman"}, {"id": "huntsman"}, {"id": "soldier"}, {"id": "ravenkeeper"}, {"id": "cannibal"}, {"id": "puzzlemaster"}, {"id": "recluse"}, {"id": "mutant"}, {"id": "damsel"}, {"id": "barber"}, {"id": "poisoner"}, {"id": "spy"}, {"id": "scarlet_woman"}, {"id": "boomdandy"}, {"id": "marionette"}, {"id": "no_dashii"}, {"id": "bishop"}, {"id": "bone_collector"}, {"id": "bureaucrat"}, {"id": "butcher"}, {"id": "matron"}, {"id": "sentinel"}]`;

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
              "id": "scarlet_woman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "no_dashii",
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
              "id": "scarlet_woman",
            },
            {
              "id": "boomdandy",
            },
            {
              "id": "marionette",
            },
            {
              "id": "no_dashii",
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

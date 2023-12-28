import { allCharactersList } from "@hidden-identity/shared";
import { describe, expect, test } from "vitest";

describe("characterData", () => {
  describe("reminders", () => {
    test("no two characters have the same reminder name", () => {
      const seenSet = new Set<string>();
      const duplicates = allCharactersList()
        .flatMap(({ reminders }) => reminders)
        .filter((reminder) => {
          if (seenSet.has(reminder.name)) {
            return true;
          } else {
            seenSet.add(reminder.name);
            return false;
          }
        });
      expect(duplicates).toHaveLength(0);
    });
    describe.each(allCharactersList())("character: $name", (character) => {
      test("has only defined reminders", () => {
        const reminderNames = character.reminders.map(({ name }) => name);
        const allReminderReferences = [
          ...(character.firstNight?.setReminders || []),
          ...(character.otherNight?.setReminders || []),
        ];

        expect(
          allReminderReferences.filter((name) => !reminderNames.includes(name)),
        ).toHaveLength(0);
      });
    });
  });
});

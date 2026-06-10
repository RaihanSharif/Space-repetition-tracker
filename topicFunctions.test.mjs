import { describe, expect, it, vi, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";

import {
    createRevisionDates,
    createAgendaItems,
    sortAgendaItems,
    storeAgendaItems,
    removeExpiredItems,
} from "./topicFunctions.mjs";

import { addData, getData } from "./storage.mjs";
vi.mock("./storage.mjs");

describe("generateRevisionDates", () => {
    it("returns PlainDate objects", () => {
        const dates = createRevisionDates("2026-07-19");
        expect(dates[0]).toBeInstanceOf(Temporal.PlainDate);
    });

    it("returns future revision dates from a given date", () => {
        const dates = createRevisionDates("2026-07-19");
        expect(dates.map((d) => d.toString())).toEqual([
            "2026-07-26",
            "2026-08-19",
            "2026-10-19",
            "2027-01-19",
            "2027-07-19",
        ]);
    });
});

describe("createAgendaItems", () => {
    it("creates a list of agenda items for a given topic and dates", () => {
        const result = [
            { topic: "Learn JavScript", date: "2026-07-26" },
            { topic: "Learn JavScript", date: "2026-08-19" },
            { topic: "Learn JavScript", date: "2026-10-19" },
            { topic: "Learn JavScript", date: "2027-01-19" },
            { topic: "Learn JavScript", date: "2027-07-19" },
        ];
        expect(createAgendaItems("Learn JavScript", "2026-07-19")).toEqual(
            result,
        );
    });
});

describe("sortAgendaItems", () => {
    it("returns agenda sorted in choronological order", () => {
        const input = [
            { topic: "Learn JavScript", date: "2027-07-19" },
            { topic: "Learn JavScript", date: "2027-01-19" },
            { topic: "Learn JavScript", date: "2026-10-19" },
            { topic: "Learn JavScript", date: "2026-08-19" },
            { topic: "Learn JavScript", date: "2026-07-26" },
        ];
        const result = [
            { topic: "Learn JavScript", date: "2026-07-26" },
            { topic: "Learn JavScript", date: "2026-08-19" },
            { topic: "Learn JavScript", date: "2026-10-19" },
            { topic: "Learn JavScript", date: "2027-01-19" },
            { topic: "Learn JavScript", date: "2027-07-19" },
        ];
        expect(sortAgendaItems(input)).toEqual(result);
    });
});

describe("storeAgendaItems", () => {
    afterEach(() => vi.resetAllMocks());

    it("Throws error if topic already exists", () => {
        vi.mocked(getData).mockReturnValue([
            { topic: "Learn JavScript", date: "2026-07-26" },
        ]);

        expect(() =>
            storeAgendaItems("1", [
                { topic: "Learn JavScript", date: "2026-07-26" },
            ]),
        ).toThrow();
    });

    it("call addData if not existing topic", () => {
        vi.mocked(getData).mockReturnValue([
            { topic: "Learn JavScript", date: "2026-07-26" },
        ]);

        storeAgendaItems("1", [{ topic: "Mocking", date: "2026-05-01" }]);
        expect(addData).toHaveBeenCalled();
    });
});

describe("removeExpiredItems", () => {
    it("filter out revision dates that are in the past", () => {
        const initial = Temporal.Now.plainDateISO().subtract({ weeks: 2 });

        const week = initial.add({ weeks: 1 }).toString();
        const month = initial.add({ months: 1 }).toString();
        const input = [
            {
                topic: "learn JavaScript",
                date: week,
            },
            {
                topic: "learn JavaScript",
                date: month,
            },
        ];

        const output = [
            {
                topic: "learn JavaScript",
                date: month,
            },
        ];

        expect(removeExpiredItems(input)).toEqual(output);
    });
});

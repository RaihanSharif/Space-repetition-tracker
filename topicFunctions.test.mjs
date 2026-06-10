import { describe, expect, it } from "vitest";
import { Temporal } from "@js-temporal/polyfill";

import {
    createRevisionDates,
    createAgendaItems,
    sortAgendaItems,
} from "./topicFunctions.mjs";

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

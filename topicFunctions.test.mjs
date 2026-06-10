import { describe, expect, it, vi, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
globalThis.Temporal = Temporal;

import {
    createRevisionDates,
    createAgendaItems,
    sortAgendaItems,
    removeExpiredItems,
    addTopic,
} from "./topicFunctions.mjs";

import { addData, getData } from "./storage.mjs";
vi.mock("./storage.mjs");

describe("createRevisionDates", () => {
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
            { topic: "Learn JavaScript", date: "2026-07-26" },
            { topic: "Learn JavaScript", date: "2026-08-19" },
            { topic: "Learn JavaScript", date: "2026-10-19" },
            { topic: "Learn JavaScript", date: "2027-01-19" },
            { topic: "Learn JavaScript", date: "2027-07-19" },
        ];
        expect(createAgendaItems("Learn JavaScript", "2026-07-19")).toEqual(
            result,
        );
    });
});

describe("sortAgendaItems", () => {
    it("returns agenda sorted in choronological order", () => {
        const input = [
            { topic: "Learn JavaScript", date: "2027-07-19" },
            { topic: "Learn JavaScript", date: "2027-01-19" },
            { topic: "Learn JavaScript", date: "2026-10-19" },
            { topic: "Learn JavaScript", date: "2026-08-19" },
            { topic: "Learn JavaScript", date: "2026-07-26" },
        ];
        const result = [
            { topic: "Learn JavaScript", date: "2026-07-26" },
            { topic: "Learn JavaScript", date: "2026-08-19" },
            { topic: "Learn JavaScript", date: "2026-10-19" },
            { topic: "Learn JavaScript", date: "2027-01-19" },
            { topic: "Learn JavaScript", date: "2027-07-19" },
        ];
        expect(sortAgendaItems(input)).toEqual(result);
    });
});

describe("addTopic", () => {
    afterEach(() => vi.resetAllMocks());

    it("throws if topic already exists", () => {
        vi.mocked(getData).mockReturnValue([
            { topic: "Learn JavaScript", date: "2026-07-26" },
        ]);

        expect(() => addTopic("1", "Learn JavaScript", "2026-07-19")).toThrow(
            "Topic already exists",
        );
    });

    it("calls addData with agenda items if topic does not exist", () => {
        vi.mocked(getData).mockReturnValue([]);

        addTopic("1", "Learn JavaScript", "2026-07-19");

        expect(addData).toHaveBeenCalledWith("1", expect.any(Array));
    });

    it("calls addData with correct topic in agenda items", () => {
        vi.mocked(getData).mockReturnValue([]);

        addTopic("1", "Learn JavaScript", "2026-07-19");

        expect(addData).toHaveBeenCalledWith(
            "1",
            expect.arrayContaining([
                expect.objectContaining({ topic: "Learn JavaScript" }),
            ]),
        );
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

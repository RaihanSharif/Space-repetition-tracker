import { describe, expect, it, vi, afterEach } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
globalThis.Temporal = Temporal;

import {
    createRevisionDates,
    createAgendaItems,
    sortAgendaItems,
    removeExpiredItems,
    addTopic,
    getAgenda,
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

    it("throws on invalid date format", () => {
        expect(() => createRevisionDates("asdf")).toThrow();
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

    it("throws on invalid date format", () => {
        expect(() => createAgendaItems("Learn JavaScript", "asfd")).toThrow();
    });
});

describe("sortAgendaItems", () => {
    it("returns agenda sorted in chronological order", () => {
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

    it("doesn't break already sorted array", () => {
        const input = [
            { topic: "Learn JavaScript", date: "2026-07-26" },
            { topic: "Learn JavaScript", date: "2026-08-19" },
            { topic: "Learn JavaScript", date: "2026-10-19" },
            { topic: "Learn JavaScript", date: "2027-01-19" },
            { topic: "Learn JavaScript", date: "2027-07-19" },
        ];
        expect(sortAgendaItems(input)).toEqual(input);
    });

    it("returns empty array when input is an empty array", () => {
        expect(sortAgendaItems([])).toEqual([]);
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

    it("throws if invalid date format", () => {
        vi.mocked(getData).mockReturnValue([]);

        expect(() => addTopic("1", "Learn JavaScript", "asdf")).toThrow(
            "Invalid date format. Please use YYYY-MM-DD",
        );
    });

    it("throws if topic is empty or whitespace", () => {
        expect(() => addTopic("1", "", "2026-07-19")).toThrow(
            "Topic cannot be empty",
        );
        expect(() => addTopic("1", "   ", "2026-07-19")).toThrow(
            "Topic cannot be empty",
        );
    });

    it("throws if date is empty or white space", () => {
        expect(() => addTopic("1", "Learn JavaScript", "")).toThrow(
            "Date cannot be empty",
        );
        expect(() => addTopic("1", "Learn JavaScript", " ")).toThrow(
            "Date cannot be empty",
        );
    });

    it("calls addData with correct topic and array of agenda items", () => {
        vi.mocked(getData).mockReturnValue([]);

        addTopic("1", "Learn JavaScript", "2026-07-19");

        expect(addData).toHaveBeenCalledWith(
            "1",
            expect.arrayContaining([
                expect.objectContaining({
                    topic: "Learn JavaScript",
                    date: expect.any(String),
                }),
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

    it("returns empty array when all revision dates in the past", () => {
        const initial = Temporal.Now.plainDateISO().subtract({ years: 2 });

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

        expect(removeExpiredItems(input)).toEqual([]);
    });

    it("does not remove pending revision dates", () => {
        const initial = Temporal.Now.plainDateISO();

        const week = initial.add({ weeks: 1 }).toString();
        const month = initial.add({ months: 1 }).toString();
        const threeMonth = initial.add({ months: 3 }).toString();
        const sixMonth = initial.add({ months: 6 }).toString();
        const year = initial.add({ years: 1 }).toString();
        const input = [
            {
                topic: "learn JavaScript",
                date: week,
            },
            {
                topic: "learn JavaScript",
                date: month,
            },
            {
                topic: "learn JavaScript",
                date: threeMonth,
            },
            {
                topic: "learn JavaScript",
                date: sixMonth,
            },
            {
                topic: "learn JavaScript",
                date: year,
            },
        ];

        expect(removeExpiredItems(input)).toEqual(input);
    });

    it("does not remove if revision date is today", () => {
        const input = [
            {
                topic: "Learn JavaScript",
                date: Temporal.Now.plainDateISO().toString(),
            },
        ];
        expect(removeExpiredItems(input)).toEqual(input);
    });

    it("returns empty array if input is empty array", () => {
        expect(removeExpiredItems([])).toEqual([]);
    });
});

describe("getAgenda", () => {
    afterEach(() => vi.resetAllMocks());

    it("returns sorted, non-expired agenda items for a user", () => {
        const today = Temporal.Now.plainDateISO();
        const future1 = today.add({ weeks: 1 }).toString();
        const future2 = today.add({ months: 1 }).toString();
        const past = today.subtract({ weeks: 1 }).toString();

        vi.mocked(getData).mockReturnValue([
            { topic: "Learn JavaScript", date: future2 },
            { topic: "Learn JavaScript", date: past },
            { topic: "Learn JavaScript", date: future1 },
        ]);

        const result = getAgenda("1");

        expect(result).toEqual([
            { topic: "Learn JavaScript", date: future1 },
            { topic: "Learn JavaScript", date: future2 },
        ]);
    });
});

import { Temporal } from "temporal-polyfill";
import { addData, getData } from "./storage.mjs";

// generates revision dates at 1w, 1m, 3m, 6m, 1y intervals
export function createRevisionDates(initialDate) {
    const date = Temporal.PlainDate.from(initialDate);

    const dates = [
        date.add({ weeks: 1 }),
        date.add({ months: 1 }),
        date.add({ months: 3 }),
        date.add({ months: 6 }),
        date.add({ years: 1 }),
    ];

    return dates;
}

/**
 * Creates agenda items for a topic across 5 revision dates.
 *
 * @param {string} topic - The topic title
 * @param {string} date - ISO date string (YYYY-MM-DD) -- Throws RangeError if invalid date string
 * @returns {{ topic: string, date: string }[]} Array of agenda items
 */
export function createAgendaItems(topic, date) {
    const dates = createRevisionDates(date);
    const agendaItems = dates.map((d) => {
        return { topic: topic, date: d.toString() };
    });

    return agendaItems;
}

/**
 * Creates and stores revision agenda items for a topic.
 *
 * @param {string} userId - The ID of the user
 * @param {string} topic - The topic title
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @throws {Error} If the topic already exists for the user
 */
export function addTopic(userId, topic, date) {
    // ? is optional chaining. if topic is null/undefined, return null/undefined, else trim
    if (!topic?.trim()) {
        throw new Error("Topic cannot be empty");
    }

    if (!date?.trim()) {
        throw new Error("Date cannot be empty");
    }

    const existing = getData(userId) ?? [];

    if (existing.some((item) => item.topic === topic)) {
        throw new Error("Topic already exists");
    }
    let agendaItems;
    try {
        agendaItems = createAgendaItems(topic, date);
    } catch (err) {
        throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

    addData(userId, agendaItems);
}

// helper function that removes topics with expired revision dates
export function removeExpiredItems(agendaItems) {
    const today = Temporal.Now.plainDateISO();
    return agendaItems.filter((item) => {
        const itemDate = Temporal.PlainDate.from(item.date);
        return Temporal.PlainDate.compare(itemDate, today) >= 0;
    });
}

// sort agenda items chronologically
export function sortAgendaItems(agendaItems) {
    return agendaItems.toSorted((a, b) => {
        const tempA = Temporal.PlainDate.from(a.date);
        const tempB = Temporal.PlainDate.from(b.date);
        return Temporal.PlainDate.compare(tempA, tempB);
    });
}

/**
 * Retrieves agenda items for a user, filtered and sorted chronologically.
 * Removes expired items and sorts by date ascending.
 *
 * @param {string} userId - The ID of the user
 * @returns {{ topic: string, date: string }[]} Sorted, non-expired agenda items
 */
export function getAgenda(userId) {
    const allAgendaItems = getData(userId) ?? [];
    const validAgendaItems = removeExpiredItems(allAgendaItems);
    return sortAgendaItems(validAgendaItems);
}

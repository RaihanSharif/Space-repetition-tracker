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
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @returns {{ topic: string, date: string }[]} Array of agenda items
 */
export function createAgendaItems(topic, date) {
    const dates = createRevisionDates(date);
    const agendaItems = dates.map((d) => {
        return { topic: topic, date: d.toString() };
    });

    return agendaItems;
}

// sort agenda items chronologically
export function sortAgendaItems(agendaItems) {
    return agendaItems.toSorted((a, b) => {
        const tempA = Temporal.PlainDate.from(a.date);
        const tempB = Temporal.PlainDate.from(b.date);
        return Temporal.PlainDate.compare(tempA, tempB);
    });
}

// store agenda items in localStorage
export function storeAgendaItems(userId, agendaItems) {
    const existing = getData(userId) ?? [];

    const exists = agendaItems.some((item) => {
        return existing.some((item2) => item2.topic === item.topic);
    });

    if (exists) {
        throw new Error("topic already exists");
    }

    addData(userId, agendaItems);
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
    const agendaItems = createAgendaItems(topic, date);
    storeAgendaItems(userId, agendaItems);
}

export function removeExpiredItems(agendaItems) {
    const today = Temporal.Now.plainDateISO();

    if (!agendaItems || agendaItems.length === 0) {
        return [];
    }
    return agendaItems.filter((item) => {
        const itemDate = Temporal.PlainDate.from(item.date);
        return Temporal.PlainDate.compare(itemDate, today) >= 0;
    });
}

export function getAgenda(userId) {
    const allAgendaItems = getData(userId) ?? [];
    const validAgendaItems = removeExpiredItems(allAgendaItems);
    return sortAgendaItems(validAgendaItems);
}

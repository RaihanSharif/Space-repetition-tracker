import { Temporal } from "@js-temporal/polyfill";

import { addData } from "./storage.mjs";

// function to calculate revision dates given a date
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

// create agenda items given date, and a topic
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
    // get agenda items for the user, dedupe and then store
    addData(userId, agendaItems);
}

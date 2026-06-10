import { addTopic, getAgenda } from "./topicFunctions.mjs";

export function handleSelectUser(e) {
    const userId = e.target.value;
    const agendaItems = getAgenda(userId);
    console.log(agendaItems);
    displayAgenda(userId, agendaItems);
}

export function handleFormSubmit(e) {
    e.preventDefault();
    const topicTitle = document.getElementById("topic-title");
    const topicDate = document.getElementById("topic-date");
    const userId = document.getElementById("user-select").value;

    if (userId) {
        addTopic(userId, topicTitle.value, topicDate.value);
        e.target.reset();
        document.getElementById("topic-date").value =
            Temporal.Now.plainDateISO();

        displayAgenda(userId, getAgenda(userId));
    } else {
        alert("Please select a user before adding topic");
    }
}

function displayAgenda(userId, agendaItems) {
    const topicsHeading = document.getElementById("topic-section-status");
    const topicsUl = document.getElementById("topics-ul");

    if (agendaItems.length === 0) {
        topicsHeading.textContent = `User ${userId} has nothing to revise.`;
    } else {
        topicsHeading.textContent = `Revision topics for User ${userId}`;
    }
    const agendaLi = agendaItems.map(({ topic, date }) => {
        const li = document.createElement("li");
        const tempDate = Temporal.PlainDate.from(date).toLocaleString("en-GB", {
            dateStyle: "long",
        });
        li.textContent = `${topic} || Date: ${tempDate}`;
        return li;
        w;
    });
    topicsUl.replaceChildren(...agendaLi);
}

import { Temporal } from "temporal-polyfill";
import { getUserIds } from "./common.mjs";
import { handleFormSubmit, handleSelectUser } from "./eventHandlers.mjs";

function setup() {
    // populate the user select element
    const userSelect = document.getElementById("user-select");
    const userIds = getUserIds();
    userIds.forEach((id) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `User ${id}`;
        userSelect.appendChild(opt);
    });

    // set calendar default to current date
    document.getElementById("topic-date").value = Temporal.Now.plainDateISO();

    userSelect.addEventListener("change", handleSelectUser);

    const form = document.getElementById("topic-form");

    form.addEventListener("submit", handleFormSubmit);
}

setup();

import { getUserIds } from "./common.mjs";
import { handleFormSubmit, handleSelectUser } from "./evenHandlers.mjs";
import { addData, clearData } from "./storage.mjs";

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

    // clearData("1");
    // clearData("2");
    // clearData("3");
    // clearData("4");
    // clearData("5");
}

setup();

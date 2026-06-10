// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";

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
    console.log(Temporal.Now.plainDateISO());

    const form = document.getElementById("topic-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const topic = document.getElementById("topic-title");
        const date = document.getElementById("topic-date");
        console.log(`topic: ${topic.value} || date: ${date.value}`);
        form.reset();
        date.value = Temporal.Now.plainDateISO();
    });
}

setup();

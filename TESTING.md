### The website must contain a drop-down which lists exactly 5 users

### No user is selected on page load

### All of the users must have no agenda when first loading (i.e. with clear localStorage). Data should be persisted across page loads (which is handled by the code in storage.mjs).

### Selecting a user must load the relevant user's agenda from storage

### Selecting a user must display the agenda for the relevant user (see manual testing below)

### If there is no agenda for the selected user, a message is displayed to explain this

### The website must contain a form with inputs for a topic name and a date picker. The form should also have a submit button.

### The date picker must default to today’s date on first page load

### The form has validation to ensure that both the topic name and and selected date have been set by the user

### Submitting the form adds a new topic to revise for the relevant user only. The topic’s dates to revise are calculated as one week, one month, three months, six months and one year from the selected date (see manual testing below)

### After creating a new topic to revise, the agenda for the current user is shown, including the new topic

### The website must score 100 for accessibility in Lighthouse

### Unit tests must be written for at least one non-trivial function

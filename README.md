# Codewars Leaderboard project

A website that takes a comma-separated list of Codewars usernames, fetches their data from the [Codewars API](https://dev.codewars.com/), and displays a leaderboard.

**Live site:** https://codewarsleader.netlify.app/

## Features

- Enter a comma-separated list of usernames (e.g. `CodeYourFuture, SallyMcGrath`)
- Shows a table with rank, username, clan and score, sorted from highest to lowest
- A drop-down lets you switch between the overall ranking and any language the users have a ranking in
- Users without a ranking in the selected language are left out of the table
- The top user is highlighted with a gold row and a trophy
- Clear error messages for usernames that don't exist, for network failures, and for empty input

## How it works

- `functions.mjs` contains the logic (fetching users, building and sorting the leaderboard). It doesn't touch the DOM, so it can be tested in Node.
- `script.mjs` handles the page: reading the input, updating the drop-down and table, and showing error messages.
- Nothing is pre-computed. Data is fetched and the results calculated each time.

## Running the project

Open `index.html` in a browser, or serve the folder with a local server. Because the script uses ES modules, opening the file directly may be blocked by the browser, so a local server is safer.

## Running the tests

From the project folder:

```bash
npm install
npm test
```

The tests use Node's built-in test runner and cover `get_leaderboard` (sorting by overall score, and filtering by language).

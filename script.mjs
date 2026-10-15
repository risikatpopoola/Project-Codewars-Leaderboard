import { get_users, get_leaderboard } from "./functions.mjs";

const button = document.getElementById("load-users");
const input = document.getElementById("name");
const select = document.getElementById("language-select");
const overall_option = document.createElement("option");
const leaderboard_body = document.getElementById("leaderboard-body");
const error_message = document.getElementById("error-message");
let users = [];
overall_option.textContent = "Overall";
select.appendChild(overall_option);

function display_leaderboard(leaderboard) {
  leaderboard_body.replaceChildren();

  for (const [index, user] of leaderboard.entries()) {
    const row = document.createElement("tr");
    const rank_cell = document.createElement("td");
    const username_cell = document.createElement("td");
    const clan_cell = document.createElement("td");
    const score_cell = document.createElement("td");

    //The index starts at zero, so we start at one to display ranks starting from 1
    rank_cell.textContent = index + 1;
    username_cell.textContent = user.username;
    clan_cell.textContent = user.clan || "";
    score_cell.textContent = user.score;

    row.appendChild(rank_cell);
    row.appendChild(username_cell);
    row.appendChild(clan_cell);
    row.appendChild(score_cell);
    if (index === 0) {
      // This will highlight the winner's row to a gold background colour by accessing the first item in the array using its index
      row.classList.add("winner");
      username_cell.textContent = `🏆 ${user.username}`;
    }

    leaderboard_body.appendChild(row);
  }
}

// creating the button addeventlistener
button.addEventListener("click", async function () {
  //clear previous error message content each time the button is clicked
  error_message.textContent = "";
  //converting the user's input into an array that could be used to get data from the api
  const usernames = input.value
    .split(",")
    .map((username) => username.trim())
    .filter((username) => username !== "");
  //If the length of the username is still zero after it has been trimmed and filtered, then an appropriate message is displayed
  if (usernames.length === 0) {
    error_message.textContent = "Please enter at least one username.";
    //Clear the previously retrieved users and leaderboard because no valid usernames were entered
    users = [];
    display_leaderboard([]);
    return;
  }

  users = await get_users(usernames, (username, reason) => {
    if (reason === "not_found") {
      error_message.textContent += `The user "${username}" does not exist. Check the spelling.\n`;
    } else {
      error_message.textContent += `Could not load "${username}" from Codewars. Check your internet connection and try again.\n`;
    }
  });

  //If no users were successfully retrieved, then an appropriate error message is displayed and the table is cleared
  if (users.length === 0) {
    error_message.textContent +=
      "No users could be loaded. See the messages above for what to do.";
    select.replaceChildren(overall_option);
    display_leaderboard([]);
    return;
  }

  //This generates a unique set of languages based of users selected
  const languages = new Set(
    users.map((user) => Object.keys(user.ranks.languages || {})).flat(),
  );
  select.replaceChildren(overall_option);
  for (const language of languages) {
    const language_option = document.createElement("option");
    language_option.textContent = language;
    language_option.value = language;
    select.appendChild(language_option);
  }
  display_leaderboard(get_leaderboard(users, select.value));
});
select.addEventListener("change", function () {
  // Respond to the selected option
  display_leaderboard(get_leaderboard(users, select.value));
});

// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.
const button = document.getElementById("load-users");
const input = document.getElementById("name");
const select = document.getElementById("language-select");
const overall_option = document.createElement("option");
let users = [];
overall_option.textContent = "Overall";
select.appendChild(overall_option);

export function makeFetchRequest() {
  return fetch("https://example.com/test");
}

export async function get_users(usernames) {
  const users = [];

  for (const username of usernames) {
    //error handling, the try and catch block is in the for loop so that all data gotten is handled properly
    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed for ${username}`);
      }
      const user = await response.json();
      users.push(user);
      //console.log(users[0].ranks.languages);
    } catch (error) {
      console.error(
        //error message for particular username that failed is logged onto the console
        `Failed to retrieve ${username}:`,
        error.message,
      );
    }
  }

  return users;
}

// creating the button addeventlistener
button.addEventListener("click", async function () {
  //converting the user's input into an array that could be used to get data from the api
  const usernames = input.value.split(",").map((username) => username.trim());
  users = await get_users(usernames);
  //This generates a unique set of languages based of users selected
  const languages = new Set(
    users.map((user) => Object.keys(user.ranks.languages)).flat(),
  );
  select.replaceChildren(overall_option);
  for (const language of languages) {
    const language_option = document.createElement("option");
    language_option.textContent = language;
    language_option.value = language;
    select.appendChild(language_option);
  }
  console.log(languages);
  console.log(users);
});
select.addEventListener("change", function () {
  // Respond to the selected option
  console.log(select.value);
});

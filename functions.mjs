// on_error is used so that get users doesn't handle error display itself

export async function get_users(usernames, on_error = () => {}) {
  const users = [];

  for (const username of usernames) {
    let response;

    // This fetches the user's data from the Codewars API.
    try {
      response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`,
      );
    } catch (error) {
      // A failed fetch usually indicates a network or connection problem.
      on_error(username, "network_error");
      continue;
    }

    // This handles an invalid username separately from other API errors.
    if (response.status === 404) {
      on_error(username, "not_found");
      continue;
    }

    // Codewars may limit requests if too many are made.
    if (response.status === 429) {
      on_error(username, "rate_limit");
      continue;
    }

    // A server error means the API may be temporarily unavailable.
    if (response.status >= 500) {
      on_error(username, "server_error");
      continue;
    }

    // This handles other unsuccessful HTTP responses.
    if (!response.ok) {
      on_error(username, "request_failed");
      continue;
    }

    // Converting the response into a JavaScript object.
    try {
      const user = await response.json();
      users.push(user);
    } catch (error) {
      // The response could not be read as valid JSON.
      on_error(username, "invalid_response");
    }
  }

  return users;
}

//using export so that we can use the function in our tests
//This function gets exactly what we need for the leaderboard
export function get_leaderboard(users, language) {
  let leaderboard = users;
  // Filter out users who don't have the selected language rank
  if (language !== "Overall") {
    leaderboard = leaderboard.filter((user) => user.ranks.languages[language]);
  }

  // Give each user the score for the selected leaderboard
  leaderboard = leaderboard.map((user) => {
    let score;

    if (language === "Overall") {
      score = user.ranks.overall.score;
    } else {
      score = user.ranks.languages[language].score;
    }

    return {
      username: user.username,
      clan: user.clan,
      score: score,
    };
  });

  // Sort from highest score to lowest

  return sort_leaderboard(leaderboard);
}
export function sort_leaderboard(leaderboard) {
  leaderboard.sort((a, b) => b.score - a.score);
  return leaderboard;
}

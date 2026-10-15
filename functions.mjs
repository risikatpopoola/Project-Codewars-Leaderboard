// on_error is used so that get users doesn't handle error display itself
export async function get_users(usernames, on_error = () => {}) {
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
      //convert response to javascript object
      const user = await response.json();
      users.push(user);
    } catch (error) {
      //error message for particular username that failed is logged onto the console
      on_error(username);
      console.error(`Failed to retrieve ${username}:`, error.message);
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

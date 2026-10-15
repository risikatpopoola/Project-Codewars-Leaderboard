import test from "node:test";
import assert from "node:assert";
import { get_leaderboard } from "./functions.mjs";

test("sorts users by overall score from highest to lowest", () => {
  const users = [
    {
      username: "User1",
      clan: "Clan Gold",
      ranks: {
        overall: { score: 200 },
      },
    },
    {
      username: "User2",
      clan: "Clan Silver",
      ranks: {
        overall: { score: 500 },
      },
    },
    {
      username: "User3",
      clan: "Clan Diamond",
      ranks: {
        overall: { score: 700 },
      },
    },
  ];

  const leaderboard = get_leaderboard(users, "Overall");

  assert.deepEqual(
    leaderboard.map((user) => user.username),
    ["User3", "User2", "User1"],
  );
});

test("only includes users who have the selected language", () => {
  const users = [
    {
      username: "User1",
      clan: "Clan Gold",
      ranks: {
        overall: { score: 200 },
        languages: { javascript: { score: 100 } },
      },
    },
    {
      username: "User2",
      clan: "Clan Silver",
      ranks: {
        overall: { score: 500 },
        languages: { python: { score: 400 } },
      },
    },
  ];

  const leaderboard = get_leaderboard(users, "javascript");

  assert.deepEqual(leaderboard, [
    { username: "User1", clan: "Clan Gold", score: 100 },
  ]);
});

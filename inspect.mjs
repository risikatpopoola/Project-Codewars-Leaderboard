import { get_users } from "./index.mjs";

const users = await get_users([
  "CodeYourFuture",
  "rizqahthetechgirlie",
  "monadius",
]);

console.log(users[2].ranks.languages);

const languages = new Set(
  users.map((user) => Object.keys(user.ranks.languages)).flat(),
);
console.log([...languages]);

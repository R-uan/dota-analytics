import fs from "fs";

const data = JSON.parse(fs.readFileSync("./postTestData.json", "utf-8"));
const req = await fetch("http://localhost:3000/matches", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const res = await req.json();
console.log(res);

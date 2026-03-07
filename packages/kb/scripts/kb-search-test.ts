import "dotenv/config";
import { kbSearch } from "../src/kbSearch.js";

const query = process.argv[2] ?? "What are the side effects of Mounjaro?";

console.log(`Query: "${query}"\n`);

const results = await kbSearch(query, 3);

for (const r of results) {
  console.log(`[${r.score.toFixed(4)}] ${r.title} (${r.source})`);
  console.log(r.snippet);
  console.log("---");
}

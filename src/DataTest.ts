import { getAppData, getRankingData } from './Data';

let nexusApiKey: string = "Yq-Uko9BMim3iXQbP0AAA-xr-C8";
let tbaApiKey: string = "0aEOFkhqU9q6qoWdYv2FevqVN0XRlzj4axcqp3coPz5fBjHPJiXvjtuPkuMbJx35";

console.log("AppData: ");
const appData = await getAppData(nexusApiKey, "2024cc", 254);
console.log(appData);

console.log("RankingData: ");
const rankingData = await getRankingData(tbaApiKey, "2024cala", 4201);
console.log(rankingData);
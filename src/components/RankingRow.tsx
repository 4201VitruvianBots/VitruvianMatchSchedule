import { RankingData } from "../Data";
import TeamIcon from "./TeamIcon";

function RankingRow({ranking, yourTeam}: {ranking: RankingData, yourTeam: boolean}) {
    return (
        <tr className={yourTeam ? "bg-gray-800 text-white font-bold" : "odd:bg-gray-300 even:bg-gray-200"}>
            <td className="border-4 border-gray-400 p-2 pr-5">{ranking.rank}</td>
            <td className="border-4 border-gray-400 p-2 pl-3 pr-3">
                <div className="flex items-center">
                    {<TeamIcon teamNumber={ranking.team_number} />}
                    <p className="pl-2">{ranking.team_number}</p>
                </div>
            </td>
            <td className="border-4 border-gray-400 p-2 pl-5">
                <div className="flex justify-end">
                    <p className="text-green-700">{ranking.wins}</p>
                    -
                    <p className="text-red-700">{ranking.losses}</p>
                    -
                    <p>{ranking.ties}</p>
                </div>
            </td>
        </tr>
    );
} 

export default RankingRow;
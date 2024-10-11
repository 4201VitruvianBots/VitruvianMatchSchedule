import dayjs from "dayjs";
import { TeamMatch, AppData } from "../Data";

function Match({teamMatch, nextMatch, teamNumber, appData}: {
    teamMatch: TeamMatch
    nextMatch: TeamMatch | null
    teamNumber: number
    appData: AppData
}) {
    const shortMatchName = teamMatch.match_name.split(" ")[0][0] + teamMatch.match_name.split(" ")[1];
    
    let matchesBetween = 0;
    
    if (nextMatch !== null) {
        if ((teamMatch.match_name.startsWith("Practice") && nextMatch.match_name.startsWith("Practice")) ||
            (teamMatch.match_name.startsWith("Qual") && nextMatch.match_name.startsWith("Qual")) || // TODO: Uncaught TypeError: nextMatch is undefined
            (teamMatch.match_name.startsWith("Playoff") && nextMatch.match_name.startsWith("Playoff"))
        ) {
            matchesBetween = parseInt(nextMatch.match_name.split(" ")[1]) - parseInt(teamMatch.match_name.split(" ")[1]) - 1;
        } else if ((teamMatch.match_name.startsWith("Practice") && nextMatch.match_name.startsWith("Qual"))) {
            matchesBetween = appData.number_of_practice_matches - parseInt(teamMatch.match_name.split(" ")[1]) + parseInt(nextMatch.match_name.split(" ")[1]) - 1;
        } else if ((teamMatch.match_name.startsWith("Qual") && nextMatch.match_name.startsWith("Playoff"))) {
            matchesBetween = appData.number_of_qual_matches - parseInt(teamMatch.match_name.split(" ")[1]) + parseInt(nextMatch.match_name.split(" ")[1]) - 1;
        } else if ((teamMatch.match_name.startsWith("Playoff") && nextMatch.match_name.startsWith("Final"))) {
            matchesBetween = appData.number_of_playoff_matches - parseInt(teamMatch.match_name.split(" ")[1]) + parseInt(nextMatch.match_name.split(" ")[1]) - 1;
        }
    }
    
    return (
        <>
            <table className="border-4 border-gray-400 bg-gray-300 text-lg mx-auto w-[90%]">
                <tbody>
                    <tr>
                        <td className="border-4 border-gray-400 p-2 pr-5 align-top" rowSpan={2}>{shortMatchName}</td>
                        <td className={`border-4 border-gray-400 p-2 bg-red-400 ${teamNumber === teamMatch.red1 ? 'font-bold' : ''}`}>{teamMatch.red1}</td>
                        <td className={`border-4 border-gray-400 p-2 bg-red-400 ${teamNumber === teamMatch.red2 ? 'font-bold' : ''}`}>{teamMatch.red2}</td>
                        <td className={`border-4 border-gray-400 p-2 bg-red-400 ${teamNumber === teamMatch.red3 ? 'font-bold' : ''}`}>{teamMatch.red3}</td>
                        <td className="border-4 border-gray-400 p-2 align-top" rowSpan={2}>
                            <p>Q {dayjs(teamMatch.queue_time).format("h:mm")}</p>
                            <p>S {dayjs(teamMatch.start_time).format("h:mm")}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className={`border-4 border-gray-400 p-2 bg-blue-400 ${teamNumber === teamMatch.blue1 ? 'font-bold' : ''}`}>{teamMatch.blue1}</td>
                        <td className={`border-4 border-gray-400 p-2 bg-blue-400 ${teamNumber === teamMatch.blue2 ? 'font-bold' : ''}`}>{teamMatch.blue2}</td>
                        <td className={`border-4 border-gray-400 p-2 bg-blue-400 ${teamNumber === teamMatch.blue3 ? 'font-bold' : ''}`}>{teamMatch.blue3}</td>
                    </tr>
                </tbody>
            </table>
            {matchesBetween > 0 && <p className="text-center text-lg">︙ {matchesBetween} match{matchesBetween > 1 && "es"}</p>}
            {teamMatch.break_after && <p className="text-center text-lg">︙ {teamMatch.break_after}</p>}
        </>
    );
}

export default Match;
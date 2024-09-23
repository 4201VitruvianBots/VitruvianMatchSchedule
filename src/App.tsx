import topBarLogo from "./assets/top_bar_logo.png";
import defaultIcon from "./assets/default_icon.png";
import Timer from "./components/Timer";
import 'react-material-symbols/rounded';
import { MaterialSymbol } from "react-material-symbols";
import { getAppData, getRankingData, AppData, RankingData, TeamMatch } from "./Data";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

const currentYear = new Date().getFullYear().toString();

function getTeamIcon(teamNumber: number) {
    return (
    <a href={"https://www.thebluealliance.com/team/"+teamNumber.toString()+"/"+currentYear} target="_blank">
        <img
        src={"https://www.thebluealliance.com/avatar/"+currentYear+"/frc"+teamNumber.toString()+".png"}
        onError={(e) => {
            if (e.target) {
                (e.target as HTMLImageElement).src = defaultIcon;
            }
        }}
        />
    </a>);
};

function getAllianceRow(teamNumber: number, rank: number, alliance: string) {
    return (
        <div className="flex drop-shadow-4xl mb-1">
            {
                alliance === "red" ?
                <div className="w-1/4"></div> :
                <>{/* Dev extends red alliance element length using this one weird trick!*/}</> 
            }
            <div className={alliance === "red" ? "bg-allianceLightRed w-3/5 min-w-max flex p-1 items-center" : "bg-allianceLightBlue w-3/5 flex p-1 items-center"}>
                {getTeamIcon(teamNumber)}
                <p className="pl-2">{teamNumber}</p>
            </div>
            <div className="bg-allianceDarkGray flex p-1 pr-5 items-center min-w-20">
                <p className="pl-2">{rank}</p>
            </div>
        </div>
    );
}

function getRankingRow(ranking: RankingData, yourTeam: boolean = false) {
    const {rank, team_number, wins, losses, ties } = ranking;
    
    return (
        <tr className={yourTeam ? "bg-gray-800 text-white font-bold" : "odd:bg-gray-300 even:bg-gray-200"}>
            <td className="border-4 border-gray-400 p-2 pr-5">{rank}</td>
            <td className="border-4 border-gray-400 p-2 pl-3 pr-3">
                <div className="flex items-center">
                    {getTeamIcon(team_number)}
                    <p className="pl-2">{team_number}</p>
                </div>
            </td>
            <td className="border-4 border-gray-400 p-2 pl-5">
                <div className="flex justify-end">
                    <p className="text-green-700">{wins}</p>
                    -
                    <p className="text-red-700">{losses}</p>
                    -
                    <p>{ties}</p>
                </div>
            </td>
        </tr>
    );
}

function getMatchTable(teamMatch: TeamMatch) {
    const shortMatchName = teamMatch.match_name.split(" ")[0][0] + teamMatch.match_name.split(" ")[1];
    
    return (
        <table className="border-4 border-gray-400 bg-gray-300 text-lg mx-auto w-[90%]">
            <tr>
                <td className="border-4 border-gray-400 p-2 pr-5 align-top" rowSpan={2}>{shortMatchName}</td>
                <td className="border-4 border-gray-400 p-2 bg-red-400">{teamMatch.red1}</td>
                <td className="border-4 border-gray-400 p-2 bg-red-400">{teamMatch.red2}</td>
                <td className="border-4 border-gray-400 p-2 bg-red-400 font-bold">{teamMatch.red3}</td>
                <td className="border-4 border-gray-400 p-2 align-top" rowSpan={2}>
                    <p>Q {dayjs(teamMatch.queue_time).format("h:mm")}</p>
                    <p>S {dayjs(teamMatch.start_time).format("h:mm")}</p>
                </td>
            </tr>
            <tr>
                <td className="border-4 border-gray-400 p-2 bg-blue-400">{teamMatch.blue1}</td>
                <td className="border-4 border-gray-400 p-2 bg-blue-400">{teamMatch.blue2}</td>
                <td className="border-4 border-gray-400 p-2 bg-blue-400">{teamMatch.blue3}</td>
            </tr>
        </table> 
    );
}

function App() {
    let nexusApiKey: string = "Yq-Uko9BMim3iXQbP0AAA-xr-C8";
    let tbaApiKey: string = "0aEOFkhqU9q6qoWdYv2FevqVN0XRlzj4axcqp3coPz5fBjHPJiXvjtuPkuMbJx35";
    
    const [appData, setAppData] = useState({} as AppData);

    useEffect(() => {
        getAppData(nexusApiKey, "demo6517", 100)
            .then(data => setAppData(data))
            .catch(error => console.error(error));
    }, []);
    
    const [rankingData, setRankingData] = useState({} as RankingData);
    
    useEffect(() => {
        getRankingData(tbaApiKey, "2024cala")
            .then(data => setRankingData(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <main>
            {/* Top bar */}
            <div className="flex h-[10vh] bg-top-bar bg-cover items-center justify-between">
                <img className="h-[10vh]" src={topBarLogo} />
                <p className="text-white text-2xl">Los Angeles Regional 2024 - Updated {dayjs(appData.updated_at).fromNow()}</p>
                <p className="text-white text-2xl">Happening now: {appData.current_match}</p>
                <p className="text-white text-2xl">Now queueing: {appData.queuing_match}</p>
                <div className="flex justify-center w-[11vw] items-center">
                    <button>
                        <MaterialSymbol icon="settings" fill color="black" size={96}/>
                    </button>
                </div>
            </div>
            <div className="flex h-[90vh]">
                {/* Rankings */}
                <div className="w-[40vw]">
                    <div className="flex justify-center items-end pb-5">
                        <h1 className="text-3xl p-3 pb-1 pr-5">Rankings</h1>
                        <p className="text-xl text-gray-600">as of {appData.current_match}</p>
                    </div>
                    <table className="border-4 border-gray-400 text-2xl mx-auto">
                            {Array.isArray(rankingData) && rankingData.slice(0, 8).map((ranking) => (
                                getRankingRow(ranking)
                            ))}
                            <tr className="odd:bg-gray-300 even:bg-gray-200">
                                <td className="border-4 border-gray-400 p-2 pr-5 text-center" colSpan={3}>↑ Alliance captains ↑</td>
                            </tr>
                            {Array.isArray(rankingData) && rankingData.slice(8, 11).map((ranking) => (
                                getRankingRow(ranking)
                            ))}
                    </table> 
                </div>
                {/* Next match */}
                <div className="border-l-2 border-r-2 border-gray-500 w-full h-[90vh] flex flex-col items-center">
                    <h1 className="p-5 text-3xl font-bold">Qualification 4 of 74</h1>
                    
                    <Timer targetName="Queuing" targetDate={new Date(2024, 8, 13, 9, 45, 0)} />
                    <Timer targetName="Starting" targetDate={new Date(2024, 8, 13, 10, 1, 0)} />
                    
                    <div className="flex p-3 pb-10 text-3xl">
                        <p>Team 4201 will be on the</p>
                        <p className="text-red-500 pl-2 pr-2 font-bold">RED</p>
                        <p>alliance</p>
                    </div>
                    
                    <div className="w-[53vw] text-3xl relative items-center flex text-white flex-grow">
                        <div className="w-1/2 bg-allianceDarkBlue rounded-tl-3xl p-3 min-h-full flex flex-col justify-center">
                            {getAllianceRow(4501, 21, "blue")}
                            {getAllianceRow(6658, 20, "blue")}
                            {getAllianceRow(968, 19, "blue")}
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-100 drop-shadow-4xl">
                            <p className="text-3xl text-black p-5 font-bold">VS</p>
                        </div>
                        <div className="w-1/2 bg-allianceDarkRed rounded-tr-3xl p-3 min-h-full flex flex-col justify-center">
                            {getAllianceRow(6000, 7, "red")}
                            {getAllianceRow(599, 8, "red")}
                            {getAllianceRow(4201, 9, "red")}
                        </div>
                    </div>
                    
                </div>
                {/* Match list */}
                <div className="w-[40vw]">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <h1 className="text-3xl p-3">Upcoming Matches</h1>
                            <button className="pr-3">
                                <MaterialSymbol icon="keyboard_arrow_down" fill color="black" size={64}/>
                            </button>
                        </div>
                        
                        {Array.isArray(appData.team_matches) && appData.team_matches.filter((match) => (
                            // Only show matches that are in the future
                            match.start_time > new Date()
                        )).map((match) => (
                            getMatchTable(match)
                        ))}
                    </div>
                    
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <h1 className="text-3xl p-3">Previous Matches</h1>
                            <button className="pr-3">
                                <MaterialSymbol icon="keyboard_arrow_down" fill color="black" size={64}/>
                            </button>
                        </div>
                        
                        {Array.isArray(appData.team_matches) && appData.team_matches.filter((match) => (
                            // Only show matches that are in the future
                            match.start_time < new Date()
                        )).map((match) => (
                            getMatchTable(match)
                        ))}
                    </div>
                </div>
            </div>
            {/* Announcements bar */}
            <div className="fixed bottom-0 bg-lime-100 text-green-900 text-2xl p-1 rounded-xl border border-green-900 w-full">
                <p>Parts request: Team 7415 [C4] is requesting 4x ¼-20 5” fully threaded hex head bolts (12 minutes ago)</p>
            </div>
        </main>
    );
}

export default App;
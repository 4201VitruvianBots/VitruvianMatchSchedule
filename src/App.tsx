import topBarLogo from "./assets/top_bar_logo.png";
import defaultIcon from "./assets/default_icon.png";
import Timer from "./components/Timer";
import 'react-material-symbols/rounded';
import { MaterialSymbol } from "react-material-symbols";
import { getAppData, getRankingData, AppData, RankingData, TeamMatch, getAllEvents, Event } from "./Data";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@tater-archives/react-use-localstorage";

dayjs.extend(relativeTime);

const currentYear = new Date().getFullYear().toString();

type Theme = 'glight' | 'gdark' | 'vlight' | 'vdark';

const themes: Record<Theme, string> = {
    vlight: "Vitruvian Light",
    vdark: "Vitruvian Dark",
    glight: "Generic Light",
    gdark: "Generic Dark",
};

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

function getAllianceRow(teamNumber: number, rank: string, alliance: string) {
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

function getMatchTable(teamMatch: TeamMatch, teamNumber: number) {
    const shortMatchName = teamMatch.match_name.split(" ")[0][0] + teamMatch.match_name.split(" ")[1];
    
    return (
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
    );
}

function App() {
    // Settings
    const testMode = false;
    
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [teamNumber, setTeamNumber] = useLocalStorage(0, "teamNumber");
    const [tbaApiKey, setTbaApiKey] = useLocalStorage("", "tbaApiKey");
    const [nexusApiKey, setNexusApiKey] = useLocalStorage("", "nexusApiKey");
    
    const [eventKey, setEventKey] = useLocalStorage("", "eventKey");
    const [eventName, setEventName] = useLocalStorage("Select an event", "eventName");
    const handleEventSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEventKey(event.target.value);
        setEventName(event.target.selectedOptions[0].text);
    };
    
    const baseEvent: Event = {
        key: "",
        name: "Select an event",
        start_date: new Date(),
        end_date: new Date(),
        teams: [],
    };
    const [events, setEvents] = useState([baseEvent] as Event[]);
    useEffect(() => {
        getAllEvents(tbaApiKey)
            .then(events => setEvents([baseEvent, ...events]))
            .catch(error => console.error(error));
    }, [tbaApiKey]);

    const [theme, setTheme] = useLocalStorage<Theme>('vlight', 'theme');

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value as Theme);
    }
    
    // App state
    const [appData, setAppData] = useState({} as AppData);

    const refreshAppData = () => {
        getAppData(nexusApiKey, eventKey, teamNumber, testMode)
            .then(data => setAppData(data))
            .catch(error => console.error(error));
    }
    useEffect(refreshAppData, [eventKey]);
    
    const [rankingData, setRankingData] = useState({} as RankingData[]);
    
    const refreshRankingData = () => {
        getRankingData(tbaApiKey, eventKey, teamNumber, testMode)
            .then(data => setRankingData(data))
            .catch(error => console.error(error));
    };
    useEffect(refreshRankingData, [eventKey]);
    
    // Timer properties
    let nextMatch: TeamMatch | null = null;
    if (Array.isArray(appData.team_matches)) {
        nextMatch = appData.team_matches.filter((match) => (
                match.start_time > new Date()
        ))[0];
    } else {
        nextMatch = null;
    }
    
    let totalMatches = null;
    if (nextMatch?.match_name.startsWith("Practice")) {
        totalMatches = appData.number_of_practice_matches;
    } else if (nextMatch?.match_name.startsWith("Qualification")) {
        totalMatches = appData.number_of_qual_matches;
    } else {
        totalMatches = null;
    }
    
    let redAlliance = null;
    if (nextMatch?.red1 === teamNumber || nextMatch?.red2 === teamNumber || nextMatch?.red3 === teamNumber) {
        redAlliance = true;
    } else if (nextMatch?.blue1 === teamNumber || nextMatch?.blue2 === teamNumber || nextMatch?.blue3 === teamNumber) {
        redAlliance = false;
    } else {
        redAlliance = null;
    }
    
    let nextMatchRankings = ["", "", "", "", "", ""];
    if (Array.isArray(rankingData) && nextMatch) {
        try {
        nextMatchRankings[0] = rankingData.find((ranking) => ranking.team_number === nextMatch?.blue1)?.rank.toString() || "";
        nextMatchRankings[1] = rankingData.find((ranking) => ranking.team_number === nextMatch?.blue2)?.rank.toString() || "";
        nextMatchRankings[2] = rankingData.find((ranking) => ranking.team_number === nextMatch?.blue3)?.rank.toString() || "";
        nextMatchRankings[3] = rankingData.find((ranking) => ranking.team_number === nextMatch?.red1)?.rank.toString() || "";
        nextMatchRankings[4] = rankingData.find((ranking) => ranking.team_number === nextMatch?.red2)?.rank.toString() || "";
        nextMatchRankings[5] = rankingData.find((ranking) => ranking.team_number === nextMatch?.red3)?.rank.toString() || "";
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <main>
            {/* Settings menu */}
            {settingsOpen &&
                <div className="flex fixed inset-0 z-10">
                    <div className="w-1/2 h-screen bg-black bg-opacity-50" onClick={() => setSettingsOpen(!settingsOpen)}/>
                    <div className="block w-1/2">
                        <div className="bg-barGreen max-h-[10vh] px-5 flex flex-auto justify-end z-50">
                        <div className="flex justify-center w-[9vw] items-center">
                            <button onClick={() => setSettingsOpen(!settingsOpen)}>
                                <MaterialSymbol icon="settings" fill color="white" size={96}/>
                            </button>
                        </div>
                        </div>
                        <div className="min-h-full bg-white z-50">
                            <h1 className="text-3xl p-5">Event</h1>
                            <div className="pl-5 pb-5">
                                <select className="bg-gray-200 text-3xl max-w-96" value={eventKey} onChange={handleEventSelectChange}>
                                    {events.filter(event => showPastEvents || (dayjs(event.start_date).subtract(1, "day").toDate() <= new Date() && dayjs(event.end_date).add(1, "day").toDate() >= new Date())).map((event) => <option value={event.key}>{event.name}</option>)}
                                </select>
                            </div>
                            <div className="pl-5">
                                <input className="w-6 h-6" type="checkbox" checked={showPastEvents} onChange={e => setShowPastEvents(e.target.checked)}/>
                                <label className="text-3xl p-5">Show past events</label>
                            </div>
                            <h1 className="text-3xl p-5">Team Number</h1>
                            <div className="pl-5">
                                <input className="bg-gray-200 text-3xl max-w-32" type="number" value={teamNumber} onChange={e => setTeamNumber(parseInt(e.target.value))}></input>
                            </div>
                            <h1 className="text-3xl p-5">Theme</h1>
                            <div className="pl-5">
                                <select className="bg-gray-200 text-3xl max-w-96" value={theme} onChange={handleThemeChange}>
                                    {Object.entries(themes).map(([id, name]) => <option value={id} >{name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <h1 className="text-3xl p-5">TBA API Key</h1>
                                <form>
                                    <button formAction="https://www.thebluealliance.com/account#api-read-key-add" formTarget="_blank" title="The Read API key from The Blue Alliance (TBA) the app will use to gather data.">
                                            <MaterialSymbol icon="help" size={36} />
                                    </button>
                                </form>
                            </div>
                            <div className="pl-5">
                                <input className="bg-gray-200 text-3xl" type="string" value={tbaApiKey} onChange={e => setTbaApiKey(e.target.value)}></input>
                            </div>
                            <div className="flex items-center">
                                <h1 className="text-3xl p-5">Nexus API Key</h1>
                                <form>
                                    <button formAction="https://frc.nexus/en/api" formTarget="_blank" title="The Pull API key from Nexus the app will use to gather accurate real-time event data.">
                                            <MaterialSymbol icon="help" size={36} />
                                    </button>
                                </form>
                            </div>
                            <div className="pl-5 pb-5">
                                <input className="bg-gray-200 text-3xl" type="string" value={nexusApiKey} onChange={e => setNexusApiKey(e.target.value)}></input>
                            </div>
                            <div className="flex justify-center items-center">
                                <h1 className="text-xl p-5">
                                    Powered by <a href="https://www.thebluealliance.com/" target="_blank" className="text-blue-500 hover:underline">The Blue Alliance</a> and <a href="https://frc.nexus/" target="_blank" className="text-blue-500 hover:underline">Nexus</a>
                                </h1>
                                <a href="https://www.thebluealliance.com/" target="_blank" className="pr-5">
                                    <img src="tbaLogo.png" width={48} className="object-scale-down"/>
                                </a>
                                <a href="https://frc.nexus/" target="_blank">
                                    <img src="nexusLogo.svg" width={48} className="object-scale-down"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
            {/* Top bar */}
            <div className="flex h-[10vh] bg-top-bar bg-cover items-center justify-between">
                <img className="h-[10vh]" src={topBarLogo} />
                {eventName == "Select an event" ? 
                    <p className="text-white text-2xl">Select an event to get started</p>
                    :
                    <>
                    <p className="text-white text-2xl">{testMode ? "Test Match" : eventName} - Updated {dayjs(appData.updated_at).fromNow()}</p>
                    <p className="text-white text-2xl">Happening now: {appData.current_match}</p>
                    <p className="text-white text-2xl">Now queueing: {appData.queuing_match}</p>
                    </>
                }
                <div className="flex justify-center w-[11vw] items-center">
                    <button onClick={() => setSettingsOpen(!settingsOpen)}>
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
                                getRankingRow(ranking, ranking.team_number === teamNumber)
                            ))}
                            <tr className="odd:bg-gray-300 even:bg-gray-200">
                                <td className="border-4 border-gray-400 p-2 pr-5 text-center" colSpan={3}>↑ Alliance captains ↑</td>
                            </tr>
                            {Array.isArray(rankingData) && rankingData.slice(8, 11).map((ranking) => (
                                getRankingRow(ranking, ranking.team_number === teamNumber)
                            ))}
                    </table> 
                </div>
                {/* Next match */}
                <div className="border-l-2 border-r-2 border-gray-500 w-full h-[90vh] flex flex-col items-center">
                    {nextMatch ? 
                        <>
                            <h1 className="p-5 text-3xl font-bold">{nextMatch.match_name} {totalMatches && "of"} {totalMatches}</h1>
                            
                            <Timer targetName="Queuing" targetDate={nextMatch.queue_time} />
                            <Timer targetName="Starting" targetDate={nextMatch.start_time} />
                            
                            <div className="flex p-3 pb-10 text-3xl">
                            {redAlliance !== null && <>
                                <p>Team {teamNumber} will be on the</p>
                                {redAlliance ? <p className="text-red-500 pl-2 pr-2 font-bold">RED</p>
                                : <p className="text-blue-500 pl-2 pr-2 font-bold">BLUE</p>}
                                <p>alliance</p>
                            </>}
                            </div>
                            
                            
                            <div className="w-[53vw] text-3xl relative items-center flex text-white flex-grow">
                                <div className="w-1/2 bg-allianceDarkBlue rounded-tl-3xl p-3 min-h-full flex flex-col justify-center">
                                    {getAllianceRow(nextMatch.blue1, nextMatchRankings[0], "blue")}
                                    {getAllianceRow(nextMatch.blue2, nextMatchRankings[1], "blue")}
                                    {getAllianceRow(nextMatch.blue3, nextMatchRankings[2], "blue")}
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-100 drop-shadow-4xl">
                                    <p className="text-3xl text-black p-5 font-bold">VS</p>
                                </div>
                                <div className="w-1/2 bg-allianceDarkRed rounded-tr-3xl p-3 min-h-full flex flex-col justify-center">
                                    {getAllianceRow(nextMatch.red1, nextMatchRankings[3], "red")}
                                    {getAllianceRow(nextMatch.red2, nextMatchRankings[4], "red")}
                                    {getAllianceRow(nextMatch.red3, nextMatchRankings[5], "red")}
                                </div>
                            </div>
                            
                        </>
                        :
                        <h1 className="text-3xl p-5">No upcoming matches</h1>
                    }
                    
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
                            getMatchTable(match, teamNumber)
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
                            // Only show matches that are in the past
                            match.start_time < new Date()
                        )).map((match) => (
                            getMatchTable(match, teamNumber)
                        ))}
                    </div>
                </div>
            </div>
            {/* Announcements bar */}
            {appData.latest_announcement &&
                <div className="fixed bottom-0 bg-lime-100 text-green-900 text-2xl p-1 rounded-xl border border-green-900 w-full">
                    <p>{appData.latest_announcement} ({dayjs(appData.announcement_sent_at).fromNow()})</p>
                </div>
            }
        </main>
    );
}

export default App;
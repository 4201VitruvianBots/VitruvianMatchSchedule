import './index.css';
import { useEffect, useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';
import EditableButton from './components/EditableButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Match, { MatchInfo } from './components/Match';
import Timer from './components/Timer';
import { getTeamMatches, extractNumber, EventInfo, getAllEvents } from './TBA';
import { useLocalStorage } from '@tater-archives/react-use-localstorage';

dayjs.extend(relativeTime);

type Theme = 'glight' | 'gdark' | 'vlight' | 'vdark';

const themes: Record<Theme, string> = {
    glight: "Generic Light",
    gdark: "Generic Dark",
    vlight: "Vitruvian Light",
    vdark: "Vitruvian Dark",
};

function generateMatchTransitions(match1: MatchInfo, match2: MatchInfo) {
    // Cover the case where there is no next match
    if (match2 == undefined) {
        return [""];
    // Cover the case where both matches are qual/playoff matches
    } else if ((match1.matchName.startsWith("Qual") && match2.matchName.startsWith("Qual")) || (match1.matchName.startsWith("Playoff") && match2.matchName.startsWith("Playoff"))) {
        return [`︙ ${extractNumber(match2.matchName) - extractNumber(match1.matchName)} match${extractNumber(match2.matchName) - extractNumber(match1.matchName) != 1 ? "es" : ""}`];
    // Cover the case where one match is a qual match and the other is a playoff match
    } else if (match1.matchName.startsWith("Qual") && match2.matchName.startsWith("Playoff")) {
        let allStrings = ["︙ Alliance selection"];
        const qualMatchesLeft = match1.totalQualMatches - extractNumber(match1.matchName);
        const playoffMatchesBefore = extractNumber(match2.matchName) - 1;
        if (qualMatchesLeft > 0) allStrings = [`︙ ${qualMatchesLeft} match${qualMatchesLeft != 1 ? "es" : ""}`, ...allStrings];
        if (playoffMatchesBefore > 0) allStrings.push(`︙ ${playoffMatchesBefore} match${playoffMatchesBefore != 1 ? "es" : ""}`);
        return allStrings;
    // Cover the case where one match is a playoff match and the other is a final match
    } else if (match1.matchName.startsWith("Playoff") && match2.matchName.startsWith("Final")) {
        const playoffMatchesLeft = match1.totalPlayoffMatches - extractNumber(match1.matchName);
        const finalMatchesBefore = extractNumber(match2.matchName) - 1;
        if ((playoffMatchesLeft > 0) || (finalMatchesBefore > 0)) return [`︙ ${playoffMatchesLeft + finalMatchesBefore} match${playoffMatchesLeft + finalMatchesBefore != 1 ? "es" : ""}`];
        else return [""];
    } else {
        return [""];
    }
}
    

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [delayMins, setDelayMins] = useState(0);
    
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const refreshMessage = dayjs(lastRefresh).fromNow();
    
    const [teamNumber, setTeamNumber] = useLocalStorage(0, "teamNumber");
    const handleTeamNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(parseInt(event.target.value));
    }
    
    const [apiKey, setApiKey] = useLocalStorage("", "apiKey");
    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    }
    
    const [eventKey, setEventKey] = useLocalStorage("", "eventKey");
    const handleEventSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEventKey(event.target.value);
    };
    
    const [teamMatchInfos, setTeamMatchInfos] = useState<MatchInfo[]>([]);
    const [events, setEvents] = useState<EventInfo[]>([]);
    
    const refreshTeamMatches = () => {
        getTeamMatches(teamNumber, eventKey, apiKey).then((matches: MatchInfo[]) => {
                setTeamMatchInfos(matches);
    })};

    const refreshEvents = () => {
        getAllEvents(apiKey).then((events: EventInfo[]) => {
            events.push({ eventKey: "", eventName: "Select an event", teams: [] });
            setEvents(events);
        });
    }
    useEffect(refreshTeamMatches, [teamNumber, eventKey, apiKey, delayMins]);
    useEffect(refreshEvents, [apiKey]);
    
    const refreshData = () => {
        refreshTeamMatches();
        refreshEvents();
        setLastRefresh(new Date());
    }

    const [theme, setTheme] = useState<Theme>('glight');

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value as Theme);
    }
    
    const nextMatch = teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date());
    
    return (
        <main className={`theme-${theme}`}>
            {settingsOpen &&
                <div className="flex fixed inset-0">
                    <div className="w-1/2 h-screen bg-black bg-opacity-50" onClick={() => setSettingsOpen(!settingsOpen)}/>
                    <div className="block w-1/2">
                        <div className="bg-yellow-300 theme-gdark:bg-orange-300 theme-vlight:bg-barGreen theme-vdark:bg-blue-500 max-h-[10vh] px-5 flex flex-auto justify-end z-50">
                            <button onClick={() => setSettingsOpen(!settingsOpen)}>
                                <MaterialSymbol icon="settings" fill color="white" size={96}/>
                            </button>
                        </div>
                        <div className="min-h-full bg-white z-50">
                            <h1 className="text-4xl p-5">Event</h1>
                            <div className="pl-5">
                                <select className="bg-gray-200 text-4xl max-w-96" value={eventKey} onChange={handleEventSelectChange}>
                                    {events.map((event) => <option value={event.eventKey}>{event.eventName}</option>)}
                                </select>
                            </div>
                            <br />
                            <h1 className="text-4xl p-5">Team Number</h1>
                            <div className="pl-5">
                                <input className="bg-gray-200 text-4xl max-w-32" type="number" value={teamNumber} onChange={handleTeamNumberChange}></input>
                            </div>
                            <br />
                            <h1 className="text-4xl p-5">Theme</h1>
                            <div className="pl-5">
                                <select className="bg-gray-200 text-4xl max-w-96" onChange={handleThemeChange}>
                                    {Object.entries(themes).map(([id, name]) => <option value={id} >{name}</option>)}
                                </select>
                            </div>
                            <br />
                            <div className="flex items-center">
                                <h1 className="text-4xl p-5">API Key</h1>
                                <form>
                                    <button formAction="https://www.thebluealliance.com/account#api-read-key-add" formTarget="_blank" title="The Read API key from The Blue Alliance (TBA) the app will use to gather data.">
                                            <MaterialSymbol icon="help" size={36} />
                                    </button>
                                </form>
                            </div>
                            <div className="pl-5">
                                <input className="bg-gray-200 text-4xl" type="string" value={apiKey} onChange={handleApiKeyChange}></input>
                            </div>
                            <br />
                            <div className="flex justify-center items-center">
                                <h1 className="text-2xl p-5">Powered by The Blue Alliance</h1>
                                <a href="https://www.thebluealliance.com/">
                                    <img src="tbaLogo.png" width={48} className="object-scale-down"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
            <div className="grid grid-rows-[auto_1fr_auto] h-screen">
                <div className="bg-barGreen min-h-[10vh] w-full px-5 flex flex-auto justify-between">
                    <img src="4201logo.png" width={100} className="object-scale-down"/>
                    <button onClick={() => setSettingsOpen(!settingsOpen)}>
                        <MaterialSymbol icon="settings" fill color="white" size={96}/>
                    </button>
                </div>
                
                <div className="p-8 gap-8 grid grid-cols-[1fr_auto_1fr] min-h-0">
                    <div className="space-y-5 overflow-y-auto">
                        {teamMatchInfos.length === 0
                            ? <p className="text-4xl flex justify-center text-gray-500">{((eventKey !== "" && teamNumber !== 0)) ? "No matches for this event" : "No team or event selected"}</p>
                            : teamMatchInfos.map((match, index, array) =>
                                <>
                                    <Match matchInfo={match} teamNumber={teamNumber} delayMins={delayMins} mostRecentMatch={match === nextMatch}/>
                                    {generateMatchTransitions(match, array[index+1]).map((text) => (<p className="text-2xl">{text}</p>))}
                                </>
                            )
                        }
                    </div>
                    <div className="w-0.5 bg-gray-500" />
                    <div className="text-3xl text-center space-y-5 mx-auto">
                        {nextMatch ?
                            // Display the time until the next match
                            <>
                                <p className="font-bold">{nextMatch.matchName}</p>
                                <Timer targetName="Queuing" targetDate={teamMatchInfos.find((match) => match.queue && match.queue > new Date())?.queue || new Date()}/>
                                <Timer targetName="Match starts" targetDate={nextMatch.matchStart || new Date()}/>
                            </>
                        :
                            <p className="text-4xl flex justify-center text-gray-500" >No upcoming matches</p>
                        }
                    </div>
                </div>
                
                <div className="bg-barGreen min-h-[10vh] max-h-[10vh] w-full block h">
                    <br />
                    <div className="px-5 grid grid-cols-2">
                        <div className="flex flex-auto">
                            <div className="bg-buttonOuterGreen max-w-[64px]">
                                <button onClick={refreshData}>
                                    <MaterialSymbol icon="refresh" fill color="white" size={50}/>
                                </button>
                            </div>
                            <p className="text-white text-3xl p-2">Refreshed {refreshMessage}</p>
                        </div>
                        
                        <div className="flex flex-auto">
                            <div className="bg-buttonOuterGreen max-w-[64px]">
                                <button onClick={() => setDelayMins(delayMins-1)}>
                                    <p className="text-white text-3xl p-2 min-w-10">-</p>
                                </button>
                            </div>
                            <div className="bg-buttonInnerGreen max-w-[64px]">
                                <EditableButton value={delayMins} setValue={setDelayMins} />
                            </div>
                            <div className="bg-buttonOuterGreen max-w-[64px]">
                                <button onClick={() => setDelayMins(delayMins+1)}>
                                    <p className="text-white text-3xl p-2 min-w-10">+</p>
                                </button>
                            </div>
                            <p className="text-white text-3xl p-2">Delay (minutes)</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;

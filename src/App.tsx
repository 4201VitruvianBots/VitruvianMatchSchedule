import './index.css';
import { ReactNode, useEffect, useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';
import EditableButton from './components/EditableButton';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Match, { MatchInfo } from './components/Match';
import Timer from './components/Timer';
import { getTeamMatches, extractNumber, EventInfo, getAllEvents } from './TBA';

dayjs.extend(relativeTime);

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [delayMins, setDelayMins] = useState(0);
    
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const refreshMessage = dayjs(lastRefresh).fromNow();
    
    const [teamNumber, setTeamNumber] = useState(0);
    const handleTeamNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNumber(parseInt(event.target.value));
        refreshData();
    }
    const [eventKey, setEventKey] = useState("");
    const handleEventSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEventKey(event.target.value);
        refreshData();
    };
    
    const [teamMatches, setTeamMatches] = useState<ReactNode[]>([<p className="text-4xl flex justify-center text-gray-500">{((eventKey != "" && teamNumber != 0)) ? "Loading..." : "No team or event selected"}</p>]);
    const [teamMatchInfos, setTeamMatchInfos] = useState<MatchInfo[]>([]);
    const [events, setEvents] = useState<EventInfo[]>([]);
    
    const refreshTeamMatches = () => {
        getTeamMatches(teamNumber, eventKey).then((matches: MatchInfo[]) => {
            const matchElements = matches.map((match: MatchInfo, index, array) =>
                <>
                    <Match matchInfo={match} teamNumber={4201} delayMins={delayMins} />
                    {array[index+1] && !array[index+1].matchName.startsWith("Final") &&
                        <p className="text-2xl">
                            {((array[index+1].matchName.startsWith("Qual") && match.matchName.startsWith("Qual")) || (array[index+1].matchName.startsWith("Playoff") && match.matchName.startsWith("Playoff")))
                            ? `︙ ${extractNumber(array[index+1].matchName) - extractNumber(match.matchName)} matches` : "︙ Alliance selection"}
                        </p>}
                </>);
            if (matchElements.length > 0) {
                setTeamMatches(matchElements);
                setTeamMatchInfos(matches);
            } else {
                setTeamMatches([<p className="text-4xl flex justify-center text-gray-500" >No matches for this event</p>]);
                setTeamMatchInfos([]);
            }
    })};
    const refreshEvents = () => {
        getAllEvents().then((events: EventInfo[]) => setEvents(events));
    }
    useEffect(refreshTeamMatches, [delayMins, teamNumber, eventKey]);
    useEffect(refreshEvents, []);
    
    const refreshData = () => {
        refreshTeamMatches();
        refreshEvents();
        setLastRefresh(new Date());
    }
    
    return (
        <>
            {settingsOpen &&
                <div className="flex fixed inset-0">
                    <div className="w-1/2 h-screen bg-black bg-opacity-50" onClick={() => setSettingsOpen(!settingsOpen)}/>
                    <div className="block w-1/2">
                        <div className="bg-barGreen max-h-[10vh] px-5 flex flex-auto justify-end z-50">
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
                            
                            <h1 className="text-4xl p-5">Team Number</h1>
                            <div className="pl-5">
                                <input className="bg-gray-200 text-4xl max-w-32" type="number" value={teamNumber} onChange={handleTeamNumberChange}></input>
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
                        {teamMatches}
                    </div>
                    <div className="w-0.5 bg-gray-500" />
                    <div className="text-3xl text-center space-y-5 mx-auto">
                        {teamMatchInfos.length > 0 &&
                            // Find the first match that hasn't started yet 
                            teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date()) &&
                            // Display the time until the next match
                            <>
                                <p className="font-bold">{teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date())?.matchName}</p>
                                {teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date())?.queue && <Timer targetName="Queuing" targetDate={teamMatchInfos.find((match) => match.queue && match.queue > new Date())?.queue || new Date()}/>}
                                {teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date())?.matchStart && <Timer targetName="Match starts" targetDate={teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date())?.matchStart || new Date()}/>}
                            </>
                        }
                        {!(teamMatchInfos.length > 0 &&
                            teamMatchInfos.find((match) => match.matchStart && match.matchStart > new Date())) &&
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
        </>
    );
}

export default App;

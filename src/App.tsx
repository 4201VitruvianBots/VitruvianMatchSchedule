import './index.css';
import { ReactNode, useEffect, useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';
import EditableButton from './components/EditableButton';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Match, { MatchInfo } from './components/Match';
import Timer from './components/Timer';
import { getTeamMatches, extractNumber } from './TBA';

dayjs.extend(relativeTime);

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [delayMins, setDelayMins] = useState(0);
    
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const refreshMessage = dayjs(lastRefresh).fromNow();
    
    const [teamMatches, setTeamMatches] = useState<ReactNode[]>([<p className="text-4xl" >Loading...</p>]);
    
    useEffect(() => {
        getTeamMatches(4201, "2024cala").then((matches: MatchInfo[]) => {
            const matchElements = matches.map((match: MatchInfo, index, array) =>
                <>
                    <Match matchInfo={match} teamNumber={4201} />
                    {array[index+1] &&
                        <p className="text-2xl">
                            {((array[index+1].matchName.startsWith("Qual") && match.matchName.startsWith("Qual")) || (array[index+1].matchName.startsWith("Playoff") && match.matchName.startsWith("Playoff")))
                            ? `︙ ${extractNumber(array[index+1].matchName) - extractNumber(match.matchName)} matches` : "︙ Alliance selection"}
                        </p>}
                </>);
            setTeamMatches(matchElements);
        });
    }, []);
    
    const refreshData = () => {
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
                            
                            <h1 className="text-4xl p-5">Team Number</h1>
                            <input className="bg-gray-200 text-4xl" type="number"></input>
                        </div>
                    </div>
                </div>
            }
            
            <div className="grid grid-rows-[auto_1fr_auto] h-screen">
                <div className="bg-barGreen min-h-[10vh] w-full px-5 flex flex-auto justify-between">
                    <img src="4201logo.png" width={100} />
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
                        <p className="font-bold">Qual 1</p>
                        <Timer targetName="Queuing" targetDate={dayjs().add(5, "minutes").toDate()}/>
                        <Timer targetName="Match starts" targetDate={dayjs().add(5, "minutes").toDate()}/>
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

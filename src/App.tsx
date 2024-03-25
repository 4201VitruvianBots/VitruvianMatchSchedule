import './index.css';
import { useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';
import EditableButton from './components/EditableButton';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Match from './components/Match';

dayjs.extend(relativeTime);

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [delayMins, setDelayMins] = useState(0);
    
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const refreshMessage = dayjs(lastRefresh).fromNow();
    
    const refreshData = () => {
        setLastRefresh(new Date());
    }
    
    const testMatchInfo = {
        matchName: "Qual 1",
        red1: 4201,
        red2: 4202,
        red3: 4203,
        blue1: 4204,
        blue2: 4205,
        blue3: 4206,
        queue: new Date(),
        matchStart: new Date(),
    };
    
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
                        <Match matchInfo={testMatchInfo} teamNumber={4201}/>
                        <p className="text-2xl">︙ 9 matches</p>
                        <Match matchInfo={testMatchInfo} teamNumber={4201}/>
                        <p className="text-2xl">︙ 4 matches</p>
                        <Match matchInfo={testMatchInfo} teamNumber={4201}/>
                    </div>
                    <div className="w-0.5 bg-gray-500" />
                    <div>
                        
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

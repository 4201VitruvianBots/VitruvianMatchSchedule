import './index.css';
import { useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';
import EditableButton from './components/EditableButton';

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [delayMins, setDelayMins] = useState(0);
    
    return (
        <>
            {settingsOpen &&
                <div className="flex flex-auto">
                    <div className="w-1/2 h-screen bg-black bg-opacity-50 z-50" onClick={() => setSettingsOpen(!settingsOpen)}/>
                    <div className="block w-1/2">
                        <div className="bg-[#38761d] max-h-[10vh] px-5 flex flex-auto justify-end z-50">
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
            
            <div>
                <div className="bg-[#38761d] min-h-[10vh] fixed top-0 w-full px-5 flex flex-auto justify-between -z-10">
                    <img src="4201logo.png" width={100} />
                    <button onClick={() => setSettingsOpen(!settingsOpen)}>
                        <MaterialSymbol icon="settings" fill color="white" size={96}/>
                    </button>
                </div>
                
                <div className="-z-10">
                    
                </div>
                
                <div className="bg-[#38761d] min-h-[10vh] max-h-[10vh] fixed bottom-0 w-full -z-10 block h">
                    <br />
                    <div className="flex px-5 justify-between">
                        <div className="flex flex-auto">
                        <div className="bg-[#499529] max-w-[64px]">
                            <button>
                                <MaterialSymbol icon="refresh" fill color="white" size={50}/>
                            </button>
                        </div>
                        <p className="text-white text-3xl p-2">Refreshed 5 seconds ago</p>
                        </div>
                        
                        <div className="flex flex-auto">
                        <div className="bg-[#499529] max-w-[64px]">
                            <button onClick={() => setDelayMins(delayMins-1)}>
                                <p className="text-white text-3xl p-2 min-w-10">-</p>
                            </button>
                        </div>
                        <div className="bg-[#6aa84f] max-w-[64px]">
                            <EditableButton value={delayMins} setValue={setDelayMins} />
                        </div>
                        <div className="bg-[#499529] max-w-[64px]">
                            <button onClick={() => setDelayMins(delayMins+1)}>
                                <p className="text-white text-3xl p-2 min-w-10">+</p>
                            </button>
                        </div>
                        <p className="text-white text-3xl p-2">Delay (minutes)</p>
                        </div>
                    </div>
                    <br />
                </div>
            </div>
        </>
    );
}

export default App;

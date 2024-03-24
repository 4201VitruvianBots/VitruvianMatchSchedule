import './index.css';
import { useState } from 'react';
import 'react-material-symbols/rounded';
import { MaterialSymbol } from 'react-material-symbols';

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    
    return (
        <>
            {settingsOpen &&
                <div className="flex flex-auto">
                    <div className="w-1/2 h-screen bg-black bg-opacity-50 z-50" />
                    <div className="bg-[#38761d] max-h-[10vh] px-5 flex flex-auto justify-end z-50">
                        <button onClick={() => setSettingsOpen(!settingsOpen)}>
                            <MaterialSymbol icon="settings" fill color="white" size={96}/>
                        </button>
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
                
                <div className="bg-[#38761d] min-h-[10vh] fixed bottom-0 w-full -z-10">
                    
                </div>
            </div>
        </>
    );
}

export default App;

import './index.css';
import TopBar from './components/TopBar';
import Schedule from './components/Schedule';
import MainTimer from './components/MainTimer';
import BottomBar from './components/BottomBar';
import Timer from './components/Timer';

function App() {
    
    return (
        <>
            <Timer targetName={"Queueing"} targetDate={new Date("October 24, 2023 21:30:00")}/>
        </>
    );
}

export default App;

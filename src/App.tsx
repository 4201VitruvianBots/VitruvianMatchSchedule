import './index.css';
import TopBar from './components/TopBar';
import Schedule from './components/Schedule';
import MainTimer from './components/MainTimer';
import BottomBar from './components/BottomBar';

function App() {

    
    return (
        <>
            {/* Top Bar */}
            <TopBar />

            {/* Left Box */}
            <Schedule />
            
            
            {/* Right Box*/}
            <MainTimer />

            {/* Bottom Bar */}
            <BottomBar />
        </>
    );
}

export default App;

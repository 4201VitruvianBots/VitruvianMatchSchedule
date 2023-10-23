import { useInterval } from "@tater-archives/react-use-interval";

function Timer({target}: {
    target: Date
}) {
    const currentDate = new Date();
    const deltaTime = target.valueOf() - currentDate.valueOf();
    
    const secondsLeft = Math.floor(deltaTime / 1000);
    const minutesLeft = Math.floor(deltaTime / 1000 * 60);
    const hoursLeft = Math.floor(deltaTime / 1000 * 60 * 60);


    return <>
        
    </>
    
}

export default Timer;
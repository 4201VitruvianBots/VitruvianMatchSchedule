import { useInterval } from "@tater-archives/react-use-interval";
import { format } from "date-fns";
import { useState, useCallback } from 'react';

function Timer({targetName, targetDate}: {
    targetName: String
    targetDate: Date
}) {
    const currentDate = new Date();
    const [deltaTime, setDeltaTime] = useState(targetDate.valueOf() - currentDate.valueOf());
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [hoursLeft, setHoursLeft] = useState(0);
    
    const updateTimer = useCallback(() => {
        setDeltaTime(targetDate.valueOf() - currentDate.valueOf());
        setSecondsLeft(Math.floor(deltaTime / 1000) % 60);
        setMinutesLeft(Math.floor(deltaTime / 1000 / 60) % 60);
        setHoursLeft(Math.floor(deltaTime / 1000 / 60 / 60) % 24);
      }, []);
    
    useInterval(updateTimer, 1000);
    
    return <>
        <p>{targetName} at {format(targetDate, "h:mm a")}</p>
        <p>{hoursLeft} : {minutesLeft} : {secondsLeft}</p>
    </>
    
}

export default Timer;
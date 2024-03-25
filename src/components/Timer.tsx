import { useInterval } from "@tater-archives/react-use-interval";
import { format } from "date-fns";
import { useState } from 'react';

function Timer({targetName, targetDate}: {
    targetName: string
    targetDate: Date
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [, setDeltaTime] = useState(targetDate.valueOf() - currentDate.valueOf());
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [hoursLeft, setHoursLeft] = useState(0);

    useInterval(() => {
        setCurrentDate(new Date());
        const newDeltaTime = targetDate.valueOf() - currentDate.valueOf();
        setDeltaTime(newDeltaTime);
        if (newDeltaTime > 0) {
            setSecondsLeft(Math.floor(newDeltaTime / 1000) % 60);
            setMinutesLeft(Math.floor(newDeltaTime / 1000 / 60) % 60);
            setHoursLeft(Math.floor(newDeltaTime / 1000 / 60 / 60) % 24);
        } else {
            setSecondsLeft(0);
            setMinutesLeft(0);
            setHoursLeft(0);
        }
      }, 1000);
    
    return <>
        <p>{targetName} at {format(targetDate, "h:mm a")}</p>
        <p className="text-8xl">{hoursLeft} : {minutesLeft} : {secondsLeft}</p>
    </>
}

export default Timer;
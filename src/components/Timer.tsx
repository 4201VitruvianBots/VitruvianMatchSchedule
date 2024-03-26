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
    
    const numberTo2DigitString = (num: number) => {
        return num < 10 ? `0${num}` : `${num}`;
    }
    
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
        <div className="flex space-x-5">
            <div className="text-8xl bg-gray-200 p-5 w-36">{hoursLeft}</div>
            <p className="text-8xl">:</p>
            <div className="text-8xl bg-gray-200 p-5 w-36">{numberTo2DigitString(minutesLeft)}</div>
            <p className="text-8xl">:</p>
            <div className="text-8xl bg-gray-200 p-5 w-36">{numberTo2DigitString(secondsLeft)}</div>
        </div>
    </>
}

export default Timer;
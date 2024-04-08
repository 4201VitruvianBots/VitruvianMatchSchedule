import { useInterval } from "@tater-archives/react-use-interval";
import { format } from "date-fns";
import { useCallback, useState } from 'react';

const numberTo2DigitString = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
}
    

function Timer({targetName, targetDate}: {
    targetName: string
    targetDate: Date
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    useInterval(useCallback(() => {
        setCurrentDate(new Date());
    }, []), 1000);
    
    const deltaTime = Math.max(targetDate.getTime() - currentDate.getTime(), 0);
    
    const secondsLeft = Math.floor(deltaTime / 1000) % 60;
    const minutesLeft = Math.floor(deltaTime / 1000 / 60) % 60;
    const hoursLeft = Math.floor(deltaTime / 1000 / 60 / 60) % 24;
    
    return <>
        <p className="text-black theme-gdark:text-white theme-vdark:text-white">{targetName} at {format(targetDate, "h:mm a")}</p>
        <div className="flex space-x-5">
            <div className="text-8xl text-black theme-gdark:text-white theme-vdark:text-white bg-gray-200 theme-gdark:bg-gray-700 theme-vdark:bg-gray-700 p-5 w-36">{hoursLeft}</div>
            <p className="text-8xl text-black theme-gdark:text-white theme-vdark:text-white">:</p>
            <div className="text-8xl text-black theme-gdark:text-white theme-vdark:text-white bg-gray-200 theme-gdark:bg-gray-700 theme-vdark:bg-gray-700 p-5 w-36">{numberTo2DigitString(minutesLeft)}</div>
            <p className="text-8xl text-black theme-gdark:text-white theme-vdark:text-white">:</p>
            <div className="text-8xl text-black theme-gdark:text-white theme-vdark:text-white bg-gray-200 theme-gdark:bg-gray-700 theme-vdark:bg-gray-700 p-5 w-36">{numberTo2DigitString(secondsLeft)}</div>
        </div>
    </>
}

export default Timer;

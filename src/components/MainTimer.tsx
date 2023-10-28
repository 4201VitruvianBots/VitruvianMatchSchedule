import { API } from 'tba-api-client';
import { useInterval } from "@tater-archives/react-use-interval";
import { env } from "node:process";
import { useState } from 'react';
import Timer from './Timer';

function MainTimer({eventName, teamNumber}: {
    eventName: string
    teamNumber: number
}) {
    const client = new API(env.TBA_API_KEY!);
    const [targetDate, setTargetDate] = useState(new Date());
    
    useInterval(() => {
        client.TeamEventMatches("frc" + teamNumber.toString(), eventName).then(allMatches => {
            var allTimestamps = new Array<number>();
            for (const match of allMatches) {
                allTimestamps.push(match.predicted_time!);
            }
            var currentTimestamp = Date.now() / 1000;
            allTimestamps = allTimestamps.filter(function(item) {
                return item >= currentTimestamp;
            });
            setTargetDate(new Date(Math.min.apply(null, allTimestamps) * 1000));
        }).catch(console.error);
    }, 300000); // Updates timer every 5 minutes

    return <>
        <Timer targetName={"Match starts"} targetDate={targetDate}/>
    </>
}

export default MainTimer;
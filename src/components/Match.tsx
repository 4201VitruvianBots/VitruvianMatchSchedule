import { format } from 'date-fns';
import { shortenMatchName } from '../TBA';
import { useEffect, useRef } from 'react';

interface MatchInfo {
    matchName: string;
    red1: number | undefined;
    red2: number | undefined;
    red3: number | undefined;
    blue1: number | undefined;
    blue2: number | undefined;
    blue3: number | undefined;
    
    queue: Date | undefined;
    matchStart: Date | undefined;
    
    totalQualMatches: number;
    totalPlayoffMatches: number;
    
    id: string;
}

function withMinuteChange(date: Date, minuteChange: number) {
    if (minuteChange === 0)
        return date;

    const newDate = new Date(date.getTime());
    
    newDate.setMinutes(newDate.getMinutes() + minuteChange)

    return newDate;    
}

function Match({matchInfo, teamNumber, delayMins, mostRecentMatch} : {matchInfo: MatchInfo, teamNumber: number, delayMins: number, mostRecentMatch: boolean}) {
    const elementRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (mostRecentMatch) {
            elementRef.current?.scrollIntoView({block: 'start'})
        }
    }, [mostRecentMatch]);
    
    const startTime = matchInfo.matchStart && withMinuteChange(matchInfo.matchStart, delayMins);
    const queueTime = matchInfo.queue && withMinuteChange(matchInfo.queue, delayMins);
    
    return (
        <div className="grid grid-cols-5 grid-rows-2 text-2xl" ref={elementRef}>
            <div className="row-span-2 bg-gray-400 p-2 grid grid-rows-2">
                <p>{shortenMatchName(matchInfo.matchName)}</p>
                <div className="flex w-24 space-x-4 items-end">
                    <a href={"https://www.thebluealliance.com/match/"+matchInfo.id}>
                        <img src="tbaLogo.png" />
                    </a>
                    <a href={"https://www.statbotics.io/match/"+matchInfo.id}>
                        <img src="statboticsLogo.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.red1 ? "font-bold" : ""}>{matchInfo.red1}</p>
                </div>
                <div className="bg-blue-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.blue1 ? "font-bold" : ""}>{matchInfo.blue1}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.red2 ? "font-bold" : ""}>{matchInfo.red2}</p>
                </div>
                <div className="bg-blue-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.blue2 ? "font-bold" : ""}>{matchInfo.blue2}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.red3 ? "font-bold" : ""}>{matchInfo.red3}</p>
                </div>
                <div className="bg-blue-500 border border-white h-full">
                    <p className={teamNumber == matchInfo.blue3 ? "font-bold" : ""}>{matchInfo.blue3}</p>
                </div>
            </div>
            <div className="row-span-2 bg-gray-400 p-2">
                {queueTime && <p>Queuing at {format(queueTime, "h:mm a")}</p>}
                {startTime && <p>Match start{startTime > new Date() ? "s" : "ed"} at {format(startTime, "h:mm a")}</p>}
            </div>
        </div>
    );
}

export default Match;
export type { MatchInfo };

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

function Match({matchInfo, teamNumber, delayMins, mostRecentMatch} : {matchInfo: MatchInfo, teamNumber: number, delayMins: number, mostRecentMatch: boolean}) {
    const elementRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (mostRecentMatch) {
            elementRef.current?.scrollIntoView({block: 'start'})
        }
    }, [mostRecentMatch]);
    
    // Shift the time by the delay
    if (matchInfo.matchStart) {
        matchInfo.matchStart.setMinutes(matchInfo.matchStart.getMinutes() + (delayMins / 2));
    }
    if (matchInfo.queue) {
        matchInfo.queue.setMinutes(matchInfo.queue.getMinutes() + (delayMins / 2));
    }
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
                <div className="bg-red-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.red1 ? "font-bold" : ""}>{matchInfo.red1}</p>
                </div>
                <div className="bg-blue-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.blue1 ? "font-bold" : ""}>{matchInfo.blue1}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.red2 ? "font-bold" : ""}>{matchInfo.red2}</p>
                </div>
                <div className="bg-blue-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.blue2 ? "font-bold" : ""}>{matchInfo.blue2}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.red3 ? "font-bold" : ""}>{matchInfo.red3}</p>
                </div>
                <div className="bg-blue-500 border border-white theme-gdark:border-gray-900 theme-vdark:border-gray-900 h-full">
                    <p className={teamNumber == matchInfo.blue3 ? "font-bold" : ""}>{matchInfo.blue3}</p>
                </div>
            </div>
            <div className="row-span-2 bg-gray-400 p-2">
                {matchInfo.queue && <p>Queuing at {format(matchInfo.queue, "h:mm a")}</p>}
                {matchInfo.matchStart && <p>Match start{matchInfo.matchStart > new Date() ? "s" : "ed"} at {format(matchInfo.matchStart, "h:mm a")}</p>}
            </div>
        </div>
    );
}

export default Match;
export type { MatchInfo };
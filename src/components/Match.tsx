import { format } from 'date-fns';
import { shortenMatchName } from '../TBA';

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
}

function Match({matchInfo, teamNumber} : {matchInfo: MatchInfo, teamNumber: number}) {
    return (
        <div className="grid grid-cols-5 grid-rows-2 text-2xl">
            <div className="row-span-2 bg-gray-400 p-2">
                <p>{shortenMatchName(matchInfo.matchName)}</p>
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
                {matchInfo.queue && <p>Q {format(matchInfo.queue, "h:mm")}</p>}
                {matchInfo.matchStart && <p>S {format(matchInfo.matchStart, "h:mm")}</p>}
            </div>
        </div>
    );
}

export default Match;
export type { MatchInfo };
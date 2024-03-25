interface MatchInfo {
    matchName: string;
    red1: number;
    red2: number;
    red3: number;
    blue1: number;
    blue2: number;
    blue3: number;
    
    queue: Date | undefined;
    matchStart: Date | undefined;
}

function Match({matchInfo, teamNumber} : {matchInfo: MatchInfo, teamNumber: number}) {
    return (
        <div className="grid grid-cols-5 grid-rows-2">
            <div className="row-span-2 bg-gray-400">
                <p>{matchInfo.matchName}</p>
            </div>
            <div>
                <div className="bg-red-500 border border-white">
                    <p className={teamNumber == matchInfo.red1 ? "font-bold" : ""}>{matchInfo.red1}</p>
                </div>
                <div className="bg-blue-500 border border-white">
                    <p className={teamNumber == matchInfo.blue1 ? "font-bold" : ""}>{matchInfo.blue1}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white">
                    <p className={teamNumber == matchInfo.red2 ? "font-bold" : ""}>{matchInfo.red2}</p>
                </div>
                <div className="bg-blue-500 border border-white">
                    <p className={teamNumber == matchInfo.blue2 ? "font-bold" : ""}>{matchInfo.blue2}</p>
                </div>
            </div>
            <div>
                <div className="bg-red-500 border border-white">
                    <p className={teamNumber == matchInfo.red3 ? "font-bold" : ""}>{matchInfo.red3}</p>
                </div>
                <div className="bg-blue-500 border border-white">
                    <p className={teamNumber == matchInfo.blue3 ? "font-bold" : ""}>{matchInfo.blue3}</p>
                </div>
            </div>
            <div className="row-span-2 bg-gray-400">
                {matchInfo.queue && <p>Q {matchInfo.queue.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>}
                {matchInfo.matchStart && <p>Q {matchInfo.matchStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
        </div>
    );
}

export default Match;
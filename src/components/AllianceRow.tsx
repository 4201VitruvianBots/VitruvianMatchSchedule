import TeamIcon from "./TeamIcon";

function AllianceRow({teamNumber, rank, alliance}: {teamNumber: number, rank: string, alliance: string}) {
    return (
        <div className="flex drop-shadow-4xl mb-1">
            {
                alliance === "red" ?
                <div className="w-1/4"></div> :
                <>{/* Dev extends red alliance element length using this one weird trick!*/}</> 
            }
            <div className={alliance === "red" ? "bg-allianceLightRed w-3/5 min-w-max flex p-1 items-center" : "bg-allianceLightBlue w-3/5 flex p-1 items-center"}>
                {<TeamIcon teamNumber={teamNumber} />}
                <p className="pl-2">{isNaN(teamNumber) ? 'TBD' : teamNumber}</p>
            </div>
            <div className="bg-allianceDarkGray flex p-1 pr-5 items-center min-w-20">
                <p className="pl-2">{rank}</p>
            </div>
        </div>
    );
}

export default AllianceRow;
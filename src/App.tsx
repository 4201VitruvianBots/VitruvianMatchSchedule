import topBarLogo from "./assets/top_bar_logo.png";
import defaultIcon from "./assets/default_icon.png";

function getRankingRow(ranking: number, teamNumber: number, wins: number, losses: number, ties: number, yourTeam: boolean = false) {
    const currentYear = new Date().getFullYear().toString();
    return (
        <tr className={yourTeam ? "bg-gray-800 text-white font-bold" : "odd:bg-gray-300 even:bg-gray-200"}>
            <td className="border-4 border-gray-400 p-2 pr-5">{ranking}</td>
            <td className="border-4 border-gray-400 p-2 pl-3 pr-3">
                <div className="flex items-center">
                    <a href={"https://www.thebluealliance.com/team/"+teamNumber.toString()+"/"+currentYear} target="_blank">
                        <img
                            src={"https://www.thebluealliance.com/avatar/"+currentYear+"/frc"+teamNumber.toString()+".png"}
                            onError={(e) => {
                                if (e.target) {
                                    (e.target as HTMLImageElement).src = defaultIcon;
                                }
                            }}
                        />
                    </a>
                    <p className="pl-2">{teamNumber}</p>
                </div>
            </td>
            <td className="border-4 border-gray-400 p-2 pl-5">
                <div className="flex justify-end">
                    {/* Wins */} <p className="text-green-700">{wins}</p>
                    -
                    {/* Losses */} <p className="text-red-700">{losses}</p>
                    -
                    {/* Ties */} <p>{ties}</p>
                </div>
            </td>
        </tr>
    );
}

function App() {
    return (
        <main>
            {/* Top bar */}
            <div className="flex h-[10vh] bg-top-bar bg-cover items-center">
                <img className="h-[10vh]" src={topBarLogo} />
                <p className="text-white pl-[40px] text-2xl">Los Angeles Regional 2024 - Updated 4 minutes ago</p>
                <p className="text-white pl-[80px] text-2xl">Happening now: Qualification 1</p>
                <p className="text-white pl-[80px] text-2xl">Now queueing: Qualification 3</p>
            </div>
            <div className="flex h-[90vh]">
                {/* Rankings */}
                <div className="w-[40vw]">
                    <div className="flex justify-center items-end pb-5">
                        <h1 className="text-3xl p-3 pb-1 pr-5">Rankings</h1>
                        <p className="text-xl text-gray-600">as of Qualification 2</p>
                    </div>
                    <table className="border-4 border-gray-400 text-2xl mx-auto">
                        {getRankingRow(1, 368, 10, 0, 0)}
                        {getRankingRow(2, 1197, 7, 3, 0)}
                        {getRankingRow(3, 7415, 9, 1, 0)}
                        {getRankingRow(4, 9408, 7, 3, 0)}
                        {getRankingRow(5, 687, 9, 1, 0)}
                        {getRankingRow(6, 4201, 8, 2, 0, true)}
                        {getRankingRow(7, 1452, 6, 4, 0)}
                        {getRankingRow(8, 1148, 6, 4, 0)}
                        <tr className="odd:bg-gray-300 even:bg-gray-200">
                            <td className="border-4 border-gray-400 p-2 pr-5 text-center" colSpan={3}>↑ Alliance captains ↑</td>
                        </tr>
                        {getRankingRow(9, 5199, 6, 4, 0)}
                        {getRankingRow(10, 7042, 7, 3, 0)}
                        {getRankingRow(11, 7137, 6, 4, 0)}
                    </table> 
                </div>
                {/* Next match */}
                <div className="border-l-2 border-r-2 border-gray-500 w-full flex flex-col items-center">
                    <h1 className="p-5 text-3xl font-bold">Qualification 4 of 74</h1>
                    
                    <p className="p-3 text-3xl">Queuing at 9:45 AM</p>
                    
                    <p className="p-3 text-3xl">Starting at 10:01 AM</p>
                    
                    <div className="flex p-3 text-3xl">
                        <p>Team 4201 will be on the</p>
                        <p className="text-red-500 pl-2 pr-2 font-bold">RED</p>
                        <p>alliance</p>
                    </div>
                </div>
                {/* Match list */}
                <div className="w-[40vw]">
                    
                </div>
            </div>
            {/* Announcements bar */}
            <div></div>
        </main>
    );
}

export default App;
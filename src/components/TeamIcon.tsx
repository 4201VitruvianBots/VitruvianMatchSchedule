import defaultIcon from "../assets/default_icon.png";

const currentYear = new Date().getFullYear().toString();

function TeamIcon({teamNumber}: {teamNumber: number}) {
    if (isNaN(teamNumber)) {
       // Return a div with a fixed height of 64px using tailwindcss
       return <div className="h-10"></div>
    } else {
        return (
        <a href={`https://www.thebluealliance.com/team/${teamNumber}/${currentYear}`} target="_blank"> {/* TODO: Uncaught TypeError: teamNumber is undefined */}
            <img
            src={`https://www.thebluealliance.com/avatar/${currentYear}/frc${teamNumber}.png`}
            onError={(e) => {
                if (e.target) {
                    (e.target as HTMLImageElement).src = defaultIcon;
                }
            }}
            />
        </a>)
    }
}

export default TeamIcon;
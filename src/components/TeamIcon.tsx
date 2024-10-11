import defaultIcon from "../assets/default_icon.png";

const currentYear = new Date().getFullYear().toString();

function TeamIcon({teamNumber}: {teamNumber: number}) {
    return (
    <a href={"https://www.thebluealliance.com/team/"+teamNumber.toString()+"/"+currentYear} target="_blank">
        <img
        src={"https://www.thebluealliance.com/avatar/"+currentYear+"/frc"+teamNumber.toString()+".png"}
        onError={(e) => {
            if (e.target) {
                (e.target as HTMLImageElement).src = defaultIcon;
            }
        }}
        />
    </a>);
};

export default TeamIcon;
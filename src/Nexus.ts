import { MatchInfo } from './components/Match';
import XRay from "x-ray";

/* Write web scraping code using the typescript npm library XRay to do the following:
  - Find the component nexus-upcoming-matches
  - Then find the div inside of it with the class "card overflow-hidden"
  - Find the div inside of it with the id "upcomingMatches"
  - Then find all of the divs inside of that with the class "accordion-item ng-star-inserted".
  - For each div, get the h2 component inside of it, then the button inside of that,
    then the contents of the span component inside of it. Should say something like "Qualification 11" or "Playoff 2". 
  - Compare this string to another string, and if they match, this is the div we want to get data from.
  - If none of the divs match, return the same MatchInfo data we were given.
  - Go back to the top of the "accordion-item" div we selected and look for another div inside of it with the id "match-dell",
    and the div inside of that with the class "accordion-body".
  - Inside of this div should be multiple p components, each containing an i component and some text.
    Add each of these pieces of text to a list.
  - For each piece of text, check if it contains "Estimated to queue @ " and then a valid time formatted such as "3:05 PM".
  - If it does, set the queue time of the MatchInfo to this time, with the same day as the date given in matchStart.
  - If matchStart is undefined, set the day to today.
  - Return this updated MatchInfo.
*/

function getQueueTime(teamNumber: number, eventKey: string, match: MatchInfo) {
    const url = "https://frc.nexus/en/event/" + eventKey + "/team/" + teamNumber.toString();
    const x = XRay();
    x(url, "nexus-upcoming-matches .card.overflow-hidden #upcomingMatches .accordion-item.ng-star-inserted", [{
        matchName: "h2 button span",
        matchDell: x("div#match-dell .accordion-body", ["p i", "p"])
    }])((err, data) => {
        if (err) {
            console.error(err);
            return match;
        }
        for (const matchData of data) {
            if (matchData.matchName === match.matchName) {
                for (const matchDell of matchData.matchDell) {
                    for (const text of matchDell) {
                        if (text.includes("Estimated to queue @ ")) {
                            const queueTime = text.split("Estimated to queue @ ")[1];
                            const matchStart = match.matchStart || new Date();
                            const queueDate = new Date(matchStart);
                            const [hours, minutes] = queueTime.split(":");
                            queueDate.setHours(parseInt(hours));
                            queueDate.setMinutes(parseInt(minutes));
                            match.queue = queueDate;
                            return match;
                        }
                    }
                }
            }
        }
        return match;
    });
    return match;
}

export { getQueueTime };
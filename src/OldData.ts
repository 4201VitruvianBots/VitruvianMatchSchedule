import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface EventInfo {
    eventName: string;
    eventKey: string;
    teams: number[];
}

interface Match {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
        red: {
            score: number;
            team_keys: string[];
            surrogate_team_keys: string[];
            dq_team_keys: string[];
        };
        blue: {
            score: number;
            team_keys: string[];
            surrogate_team_keys: string[];
            dq_team_keys: string[];
        };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    actual_time: number;
    predicted_time: number;
    post_result_time: number;
    score_breakdown: Record<string, unknown>;
    videos: {
        type: string;
        key: string;
    }[];
}

interface Event {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
}

interface Team {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
}

async function getAllEvents(apiKey: string, pastEvents: boolean) {
    const currentYear = new Date().getFullYear();
    const events: Event[] = await (await fetch(`https://www.thebluealliance.com/api/v3/events/${currentYear}/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json();
    
    let teamEvents: Event[];
    if (pastEvents) {
        teamEvents = events;
    } else {
        teamEvents = events.filter(event => dayjs(event.start_date).subtract(1, "day").toDate() <= new Date() && dayjs(event.end_date).add(1, "day").toDate() >= new Date());
    }
    
    return Promise.all(teamEvents
        .map(async event => ({
            eventName: event.name,
            eventKey: event.key,
            teams: (await (await fetch(`https://www.thebluealliance.com/api/v3/event/${event.key}/teams/simple`, {
                headers: {
                    'X-TBA-Auth-Key': apiKey,
                },
            })).json() as Team[]).map(team => team.team_number),
        })));
}

async function getTeamMatches(teamNumber: number, eventKey: string, apiKey: string) {
    const totalQualMatches = (await (await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json() as Match[]).filter((match) => match.comp_level == "qm").length;

    const totalPlayoffMatches = (await (await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json() as Match[]).filter((match: Match) => (match.comp_level == "sf") || (match.comp_level == "qf") || (match.comp_level == "ef")).length;
    
    const [totalQual, totalPlayoff] = await Promise.all([totalQualMatches, totalPlayoffMatches]);

    const matchList_2: Match[] = await (await fetch(`https://www.thebluealliance.com/api/v3/team/${teamNumberToKey(teamNumber)}/event/${eventKey}/matches`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json();

    return matchList_2.map(match => {
        return {
            matchName: getMatchName(match),
            red1: teamKeyToNumber(match.alliances?.red?.team_keys[0] || ""),
            red2: teamKeyToNumber(match.alliances?.red?.team_keys[1] || ""),
            red3: teamKeyToNumber(match.alliances?.red?.team_keys[2] || ""),
            blue1: teamKeyToNumber(match.alliances?.blue?.team_keys[0] || ""),
            blue2: teamKeyToNumber(match.alliances?.blue?.team_keys[1] || ""),
            blue3: teamKeyToNumber(match.alliances?.blue?.team_keys[2] || ""),
            queue: undefined,
            matchStart: match.time ? new Date(match.time * 1000) : undefined,
            totalQualMatches: totalQual,
            totalPlayoffMatches: totalPlayoff,
            id: match.key,
        };
    }).sort((a, b) => a.matchStart && b.matchStart ? a.matchStart.getTime() - b.matchStart?.getTime() : 0);
}

function getMatchName(match: Match) {
    let semifinal = false;
    let matchName = "";
    if (match.comp_level == "qm") {
        matchName = "Qualification ";
    } else if (match.comp_level == "ef" || match.comp_level == "qf" || match.comp_level == "sf") {
        matchName = "Playoff ";
        semifinal = true;
    } else if (match.comp_level == "f") {
        matchName = "Final ";
    }
    
    if (semifinal) {
        matchName = matchName + match.set_number;
    } else {
        matchName = matchName + match.match_number;
    }
    
    return matchName;
}

function shortenMatchName(matchName: string) {
    if (matchName.startsWith("Qualification ")) {
        return "Qual" + matchName.substring(13);
    }
    
    return matchName;
}

function teamKeyToNumber(teamKey: string) {
    return parseInt(teamKey.substring(3));
}

function teamNumberToKey(teamNumber: number) {
    return "frc" + teamNumber.toString();
}

function extractNumber(str: string) {
    const match = str.match(/\d+$/);
    return match ? parseInt(match[0]) : 0;
}

export { getTeamMatches, getAllEvents, shortenMatchName, extractNumber, teamKeyToNumber};
export type { EventInfo };

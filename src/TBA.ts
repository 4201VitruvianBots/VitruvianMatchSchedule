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

function getAllEvents(apiKey: string) {
    const currentYear = new Date().getFullYear();
    const events = fetch(`https://www.thebluealliance.com/api/v3/events/${currentYear}/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    }).then((res) => res.json());
    return events.then((eventList) => {
        return eventList
            .filter((event: Event) => dayjs(event.start_date).subtract(1, "day").toDate() <= new Date() && dayjs(event.end_date).add(1, "day").toDate() >= new Date())
            .map((event: Event) => {
                return {
                    eventName: event.name,
                    eventKey: event.key,
                    teams: (fetch(`https://www.thebluealliance.com/api/v3/event/${event.key}/teams/simple`, {
                        headers: {
                            'X-TBA-Auth-Key': apiKey,
                        },
                    }).then((res) => res.json()).then((teamList) => {
                        return teamList.map((team: Team) => team.team_number);
                    })),
                };
            });
    });
}

function getTeamMatches(teamNumber: number, eventKey: string, apiKey: string) {
    const totalQualMatches = fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    }).then((res) => res.json()).then((matchList: Match[]) => {
        return matchList.filter((match: Match) => match.comp_level == "qm").length;
    });
    const totalPlayoffMatches = fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    }).then((res) => res.json()).then((matchList: Match[]) => {
        return matchList.filter((match: Match) => (match.comp_level == "sf") || (match.comp_level == "qf") || (match.comp_level == "ef")).length;
    });
    
    return Promise.all([totalQualMatches, totalPlayoffMatches])
    .then(([totalQual, totalPlayoff]) => {
        return fetch(`https://www.thebluealliance.com/api/v3/team/${teamNumberToKey(teamNumber)}/event/${eventKey}/matches`, {
            headers: {
                'X-TBA-Auth-Key': apiKey,
            },
        })
        .then((res) => res.json())
        .then((matchList: Match[]) => {
            return matchList
                .map((match: Match) => {
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
                })
                .sort((a, b) => {
                    if (a.matchStart && b.matchStart) {
                        return a.matchStart.getTime() - b.matchStart.getTime();
                    }
                    return 0;
                });
        });
    });
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

export { getTeamMatches, getAllEvents, shortenMatchName, extractNumber};
export type { EventInfo };

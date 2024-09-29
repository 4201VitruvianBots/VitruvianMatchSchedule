import dayjs from 'dayjs';

interface TeamMatch {
    match_name: string;
    red1: number;
    red2: number;
    red3: number;
    blue1: number;
    blue2: number;
    blue3: number;
    queue_time: Date;
    start_time: Date;
    break_after: string | null;
}

interface AppData {
    updated_at: Date;
    current_match: string | null;
    queuing_match: string | null;
    
    team_matches: TeamMatch[];
    
    latest_announcement: string;
    announcement_sent_at: Date;
};

interface RankingData {
    rank: number;
    team_number: number;
    wins: number;
    losses: number;
    ties: number;
}[];

interface Event {
    key: string;
    name: string;
    start_date: Date;
    end_date: Date;
    teams: number[];
}

interface EventFull {
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

async function getAppData(nexusApiKey: string, eventKey: string, teamNumber: number) {
    let data: AppData = {} as AppData;
    const nexusResponse = await fetch(`https://frc.nexus/api/v1/event/${eventKey}`, {
        method: 'GET',
        headers: {
        'Nexus-Api-Key': nexusApiKey,
        },
    });
    const nexusData = await nexusResponse.json();
    
    data.updated_at = dayjs.unix(nexusData.dataAsOfTime / 1000).toDate();
    
    const teamMatches = nexusData.matches.filter((match: any) => {
        return match.redTeams.includes(teamNumber.toString()) || match.blueTeams.includes(teamNumber.toString());
    });
    
    data.team_matches = teamMatches.map((match: any) => {
        return {
            match_name: match.label,
            red1: parseInt(match.redTeams[0]),
            red2: parseInt(match.redTeams[1]),
            red3: parseInt(match.redTeams[2]),
            blue1: parseInt(match.blueTeams[0]),
            blue2: parseInt(match.blueTeams[1]),
            blue3: parseInt(match.blueTeams[2]),
            queue_time: dayjs.unix(match.times.estimatedQueueTime / 1000).toDate(),
            start_time: dayjs.unix(match.times.estimatedStartTime / 1000).toDate(),
            break_after: match.breakAfter,
        };
    });
    
    let onFieldMatches = nexusData.matches.filter((match: any) => match.status === 'On field');
    // Don't know why I have to do this condition... Too bad!
    if (onFieldMatches.length === 0) {
        data.current_match = onFieldMatches.label;
    } else {
        data.current_match = onFieldMatches[onFieldMatches.length - 1].label;
    }
    
    let queuingMatches = nexusData.matches.filter((match: any) => match.status === 'Now queuing');
    // Don't know why I have to do this condition... Too bad!
    if (queuingMatches.length === 0) {
        data.queuing_match = queuingMatches.label;
    } else {
        data.queuing_match = queuingMatches[queuingMatches.length - 1].label;
    }
    
    data.latest_announcement = nexusData.announcements[nexusData.announcements.length - 1].announcement;
    data.announcement_sent_at = dayjs.unix(nexusData.announcements[nexusData.announcements.length - 1].postedTime / 1000).toDate();
    
    return data;
}

async function getRankingData(tbaApiKey: string, eventKey: string) {
    const rankingResponse = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`, {
        headers: {
            'X-TBA-Auth-Key': tbaApiKey,
        },
    });
    const rankingData = await rankingResponse.json();
    
    const convertedRankingData: RankingData = rankingData.rankings.map((ranking: any) => {
        return {
            rank: ranking.rank,
            team_number: teamKeyToNumber(ranking.team_key),
            wins: ranking.record.wins,
            losses: ranking.record.losses,
            ties: ranking.record.ties,
        };
    });
    
    return convertedRankingData;
}

async function getAllEvents(apiKey: string) {
    const currentYear = new Date().getFullYear();
    const events: EventFull[] = await (await fetch(`https://www.thebluealliance.com/api/v3/events/${currentYear}/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json();
    
    // let teamEvents: EventFull[];
    // if (pastEvents) {
    //     teamEvents = events;
    // } else {
    //     teamEvents = events.filter(event => dayjs(event.start_date).subtract(1, "day").toDate() <= new Date() && dayjs(event.end_date).add(1, "day").toDate() >= new Date());
    // }
    
    var simpleEvents = Promise.all(events
        .map(async (event: EventFull) => ({
            key: event.key,
            name: event.name,
            start_date: dayjs(event.start_date).toDate(),
            end_date: dayjs(event.end_date).toDate(),
            teams: (await (await fetch(`https://www.thebluealliance.com/api/v3/event/${event.key}/teams/simple`, {
                headers: {
                    'X-TBA-Auth-Key': apiKey,
                },
            },
            )).json() as Team[]).map(team => team.team_number),
        } as Event)));
    return simpleEvents;
}

function teamKeyToNumber(teamKey: string) {
    return parseInt(teamKey.substring(3));
}

export { getAppData, getRankingData, getAllEvents};
export type { AppData, RankingData, TeamMatch, Event};
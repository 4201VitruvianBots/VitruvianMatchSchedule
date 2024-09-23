import dayjs from 'dayjs';
import { teamKeyToNumber, shortenMatchName } from './TBA';

interface AppData {
    updated_at: dayjs.Dayjs;
    current_match: string | null;
    queuing_match: string | null;
    
    team_matches: {
        match_name: string;
        red1: number;
        red2: number;
        red3: number;
        blue1: number;
        blue2: number;
        blue3: number;
        queue_time: string;
        start_time: string;
        break_after: string | null;
    }[];
    
    latest_announcement: string;
    announcement_sent_at: dayjs.Dayjs;
};

interface RankingData {
    rank: number;
    team_number: number;
    wins: number;
    losses: number;
    ties: number;
}[];

async function getAppData(nexusApiKey: string, eventKey: string, teamNumber: number) {
    let data: AppData = {} as AppData;
    const nexusResponse = await fetch(`https://frc.nexus/api/v1/event/${eventKey}`, {
        method: 'GET',
        headers: {
        'Nexus-Api-Key': nexusApiKey,
        },
    });
    const nexusData = await nexusResponse.json();
    
    data.updated_at = dayjs.unix(nexusData.dataAsOfTime / 1000);
    
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
            queue_time: dayjs.unix(match.times.estimatedQueueTime / 1000).format('h:mm'),
            start_time: dayjs.unix(match.times.estimatedStartTime / 1000).format('h:mm'),
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
    data.announcement_sent_at = dayjs.unix(nexusData.announcements[nexusData.announcements.length - 1].postedTime / 1000);
    
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

export { getAppData, getRankingData};
export type { AppData, RankingData };
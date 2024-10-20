import dayjs from 'dayjs';

// Create a list of 40 random numbers from 1-12000
let teamNumbers: number[] = generateUniqueRandomIntegers(1, 12000, 40);

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
    
    number_of_practice_matches: number;
    number_of_qual_matches: number;
    number_of_playoff_matches: number;
};

interface RankingData {
    rank: number;
    team_number: number;
    team_number_string: string; // Added to account for B teams (TBA only)
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

async function getAppData(nexusApiKey: string, eventKey: string, teamNumber: number, testMode: boolean = false) {
    if (testMode) {
        return getFakeAppData(teamNumber);
    } else {
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
        
        // TODO: Check if any of the original matches have a break after them that wasn't transferred to the new most recent match for the team
        // If so, add the break after to the most recent match
        // For example: A break after Qual 45, closest match number for the team is Qual 44, so add the break after to Qual 44
        
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
        
        if (nexusData.announcements.length > 0) {
            data.latest_announcement = nexusData.announcements[nexusData.announcements.length - 1].announcement;
            data.announcement_sent_at = dayjs.unix(nexusData.announcements[nexusData.announcements.length - 1].postedTime / 1000).toDate();
        }
        
        data.number_of_practice_matches = nexusData.matches.filter((match: any) => match.label.startsWith("Practice")).length;
        data.number_of_qual_matches = nexusData.matches.filter((match: any) => match.label.startsWith("Qualification")).length;
        data.number_of_playoff_matches = nexusData.matches.filter((match: any) => match.label.startsWith("Playoff")).length;
    
        console.log("Refreshed app data at " + dayjs().format("h:mm:ss a"));
        
        return data;
    }
}

async function getRankingData(tbaApiKey: string, eventKey: string, teamNumber: number, testMode: boolean = false) {
    if (testMode) {
        return getFakeRankingData(teamNumber);
    } else {
        const rankingResponse = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`, {
            headers: {
                'X-TBA-Auth-Key': tbaApiKey,
            },
        });
        const rankingData = await rankingResponse.json();
        
        const convertedRankingData: RankingData[] = rankingData.rankings.map((ranking: any) => {
            return {
                rank: ranking.rank,
                team_number: teamKeyToNumber(ranking.team_key),
                team_number_string: teamKeyToString(ranking.team_key),
                wins: ranking.record.wins,
                losses: ranking.record.losses,
                ties: ranking.record.ties,
            };
        });
        
        console.log("Refreshed ranking data at " + dayjs().format("h:mm:ss a"));
        
        return convertedRankingData;
    }
}

async function getAllEvents(apiKey: string) {
    const currentYear = new Date().getFullYear();
    const events: EventFull[] = await (await fetch(`https://www.thebluealliance.com/api/v3/events/${currentYear}/simple`, {
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })).json();
    
    var simpleEvents = Promise.all(events
        .map(async (event: EventFull) => ({ // TODO: TypeError: events.map is not a function
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

function getFakeAppData(teamNumber: number) {
    const myTeamNumbers = [teamNumber, ...teamNumbers];
    
    let teamMatches: TeamMatch[] = [];
    for (let i = 0; i < 20; i++) {
        // Get 6 random but unique team numbers from the list teamNumbers
        let matchTeams: number[] = generateUniqueRandomIntegers(0, 39, 6);
        
        teamMatches.push({
            match_name: `Practice ${i + 1}`,
            red1: matchTeams[0],
            red2: matchTeams[0],
            red3: matchTeams[0],
            blue1: matchTeams[0],
            blue2: matchTeams[0],
            blue3: matchTeams[0],
            queue_time: dayjs().subtract(1, 'day').add(i*10, 'minute').toDate(),
            start_time: dayjs().subtract(1, 'day').add((i*10)+15, 'minute').toDate(),
            break_after: null,
        });
    }
    for (let i = 0; i < 70; i++) {
        // Get 6 random but unique team numbers from the list teamNumbers
        teamMatches.push({
            match_name: `Qualification ${i + 1}`,
            red1: myTeamNumbers[randomInt(0, 39)],
            red2: myTeamNumbers[randomInt(0, 39)],
            red3: myTeamNumbers[randomInt(0, 39)],
            blue1: myTeamNumbers[randomInt(0, 39)],
            blue2: myTeamNumbers[randomInt(0, 39)],
            blue3: myTeamNumbers[randomInt(0, 39)],
            queue_time: dayjs().subtract(270, 'minute').add(i*10, 'minute').toDate(),
            start_time: dayjs().subtract(270, 'minute').add((i*10)+15, 'minute').toDate(),
            break_after: null,
        });
    }
    teamMatches = teamMatches.filter((match: TeamMatch) => {
        return match.red1 === teamNumber || match.red2 === teamNumber || match.red3 === teamNumber || match.blue1 === teamNumber || match.blue2 === teamNumber || match.blue3 === teamNumber;
    });
    
    return {
        updated_at: new Date(),
        current_match: "Qualification 26",
        queuing_match: "Qualification 28",
        
        team_matches: teamMatches,
        
        latest_announcement: "This is a test announcement",
        announcement_sent_at: dayjs().subtract(1, 'hour').toDate(),
        
        number_of_practice_matches: 20,
        number_of_qual_matches: 70,
        number_of_playoff_matches: 0,
    };
}

function getFakeRankingData(teamNumber: number) {
    const myTeamNumbers = [teamNumber, ...teamNumbers];
    
    let rankingData: RankingData[] = [];
    for (let i = 0; i < 40; i++) {
        let myNumber = myTeamNumbers[randomInt(0, myTeamNumbers.length - 1)];
        myTeamNumbers.splice(myTeamNumbers.indexOf(myNumber), 1);
        rankingData.push({
            rank: i + 1,
            team_number: myNumber,
            team_number_string: myNumber.toString(),
            wins: randomInt(0, 9),
            losses: randomInt(0, 9),
            ties: randomInt(0, 2),
        });
    }
    
    return rankingData;
}

function teamKeyToNumber(teamKey: string) {
    return parseInt(teamKey.substring(3));
}

function teamKeyToString(teamKey: string) {
    return teamKey.substring(3);
}

function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueRandomIntegers(min: number, max: number, count: number): number[] {
    const numbers = Array.from({length: max - min + 1}, (_, i) => i + min);
    const result = [];

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1);
    }

    return result;
}

export { getAppData, getRankingData, getAllEvents};
export type { AppData, RankingData, TeamMatch, Event};
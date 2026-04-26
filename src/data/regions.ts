export type RegionCode = "IN" | "US" | "UK";

export interface Region {
  code: RegionCode;
  name: string;
  flag: string;
  authority: string;
  tagline: string;
}

export const REGIONS: Region[] = [
  { code: "IN", name: "India", flag: "🇮🇳", authority: "Election Commission of India (ECI)", tagline: "World's largest democracy" },
  { code: "US", name: "United States", flag: "🇺🇸", authority: "Federal Election Commission (FEC) & state boards", tagline: "Federal & state-run elections" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", authority: "Electoral Commission", tagline: "Constituency-based parliament" },
];

export interface ElectionStep {
  title: string;
  description: string;
  icon: string;
}

export const ELECTION_FLOW: Record<RegionCode, ElectionStep[]> = {
  IN: [
    { title: "Voter Registration", description: "Apply for a Voter ID (EPIC) via NVSP or Form 6. Must be 18+ and an Indian citizen.", icon: "📝" },
    { title: "Election Announcement", description: "ECI announces dates and the Model Code of Conduct comes into force.", icon: "📢" },
    { title: "Nomination of Candidates", description: "Candidates file nominations with deposits and affidavits.", icon: "🧑‍💼" },
    { title: "Campaigning", description: "Parties campaign with strict spending and conduct rules.", icon: "🎤" },
    { title: "Polling Day", description: "Vote on EVM at your assigned booth. Get the indelible ink mark.", icon: "🗳️" },
    { title: "Counting & Results", description: "Votes are counted by Returning Officers; results declared by ECI.", icon: "📊" },
    { title: "Government Formation", description: "Majority party/alliance forms the government.", icon: "🏛️" },
  ],
  US: [
    { title: "Voter Registration", description: "Register through your state — deadlines vary. Some states allow same-day registration.", icon: "📝" },
    { title: "Primaries & Caucuses", description: "Parties pick nominees through state-level primaries or caucuses.", icon: "🎯" },
    { title: "Conventions", description: "National conventions formally nominate presidential candidates.", icon: "🎉" },
    { title: "Campaigning & Debates", description: "Candidates campaign nationwide; televised debates are held.", icon: "🎤" },
    { title: "Early & Mail-in Voting", description: "Many states offer early in-person and mail-in ballots.", icon: "✉️" },
    { title: "Election Day", description: "First Tuesday after first Monday in November.", icon: "🗳️" },
    { title: "Electoral College & Results", description: "Electors cast votes in December; Congress certifies in January.", icon: "🏛️" },
  ],
  UK: [
    { title: "Voter Registration", description: "Register online at gov.uk. Photo ID required at the polling station.", icon: "📝" },
    { title: "Election Called", description: "The PM requests dissolution of Parliament; date is announced.", icon: "📢" },
    { title: "Nominations", description: "Candidates file in 650 constituencies with a £500 deposit.", icon: "🧑‍💼" },
    { title: "Campaign Period", description: "Short, regulated campaigns of ~6 weeks with spending caps.", icon: "🎤" },
    { title: "Polling Day", description: "Usually a Thursday. Vote with a paper ballot at your station.", icon: "🗳️" },
    { title: "Counting Overnight", description: "Constituency counts begin immediately after polls close.", icon: "📊" },
    { title: "Government Formation", description: "Party with majority of MPs forms government; PM appointed.", icon: "🏛️" },
  ],
};

export interface TimelineEvent {
  label: string;
  detail: string;
  weeksBefore: number;
}

export const TIMELINES: Record<RegionCode, TimelineEvent[]> = {
  IN: [
    { label: "Electoral Roll Update", detail: "Voter list revision begins", weeksBefore: 16 },
    { label: "Election Notification", detail: "Model Code of Conduct kicks in", weeksBefore: 8 },
    { label: "Last Date for Nominations", detail: "Candidates file papers", weeksBefore: 6 },
    { label: "Campaigning Ends", detail: "48-hour silence period", weeksBefore: 1 },
    { label: "Polling Day", detail: "Multi-phase voting", weeksBefore: 0 },
    { label: "Counting Day", detail: "Results declared", weeksBefore: -1 },
  ],
  US: [
    { label: "Registration Deadlines", detail: "Varies by state, ~30 days before", weeksBefore: 5 },
    { label: "Early Voting Begins", detail: "In many states", weeksBefore: 3 },
    { label: "Final Debates", detail: "Presidential debates conclude", weeksBefore: 4 },
    { label: "Election Day", detail: "Tuesday after first Monday in Nov", weeksBefore: 0 },
    { label: "Electoral College Vote", detail: "Mid-December", weeksBefore: -6 },
    { label: "Inauguration", detail: "January 20", weeksBefore: -11 },
  ],
  UK: [
    { label: "Election Announced", detail: "Parliament dissolved", weeksBefore: 6 },
    { label: "Registration Deadline", detail: "12 working days before", weeksBefore: 2 },
    { label: "Nomination Deadline", detail: "Candidates confirmed", weeksBefore: 4 },
    { label: "Postal Vote Deadline", detail: "Apply in advance", weeksBefore: 2 },
    { label: "Polling Day", detail: "Usually a Thursday", weeksBefore: 0 },
    { label: "Results Declared", detail: "Overnight counting", weeksBefore: 0 },
  ],
};

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export const QUIZZES: Record<RegionCode, QuizQuestion[]> = {
  IN: [
    { q: "What is the minimum age to vote in India?", options: ["16", "18", "21", "25"], correct: 1, explain: "Indian citizens aged 18+ can vote." },
    { q: "Which body conducts elections in India?", options: ["Parliament", "Supreme Court", "ECI", "Cabinet"], correct: 2, explain: "The Election Commission of India is an autonomous body." },
    { q: "What machine is used to vote in India?", options: ["Paper ballot", "EVM", "Online portal", "Phone"], correct: 1, explain: "Electronic Voting Machines, often paired with VVPAT." },
    { q: "What does the indelible ink mark indicate?", options: ["Citizenship", "That you have voted", "Party support", "Age proof"], correct: 1, explain: "It prevents double voting." },
  ],
  US: [
    { q: "When is US Election Day?", options: ["First Mon of Nov", "Tue after first Mon of Nov", "Last Tue of Oct", "Nov 1"], correct: 1, explain: "Set by federal law in 1845." },
    { q: "How many electoral votes are needed to win the presidency?", options: ["218", "270", "300", "538"], correct: 1, explain: "270 of 538 electors." },
    { q: "What are primaries?", options: ["Final election", "Party nomination contests", "Recounts", "Debates"], correct: 1, explain: "States choose their party nominees." },
    { q: "Who certifies the election results?", options: ["President", "Supreme Court", "Congress", "FEC"], correct: 2, explain: "Congress certifies in early January." },
  ],
  UK: [
    { q: "How many constituencies elect MPs in the UK?", options: ["435", "538", "650", "750"], correct: 2, explain: "650 constituencies, one MP each." },
    { q: "What ID do you need at a UK polling station?", options: ["None", "Any ID", "Photo ID", "Passport only"], correct: 2, explain: "Photo ID required since 2023." },
    { q: "Which day are UK elections usually held?", options: ["Sunday", "Monday", "Thursday", "Saturday"], correct: 2, explain: "Traditionally a Thursday." },
    { q: "Who becomes Prime Minister?", options: ["Most-voted person", "Leader of majority party in Commons", "King's choice", "Elected separately"], correct: 1, explain: "Leader of the party that commands a Commons majority." },
  ],
};

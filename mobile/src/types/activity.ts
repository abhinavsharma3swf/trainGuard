export type ActivityStatus = "PENDING" | "COMPLETED";

export type ActivityType = "RUN" | "RIDE";

export type Activity = {
    id: number;
    type: ActivityType;
    name: string;
    date: string;
    distance: string;
    time: string;
    pace: string;
    averageWatts: string;
    status: ActivityStatus;
    rpe?: string;
    pain?: string;
    mood?: string;
};
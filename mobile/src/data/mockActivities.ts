import {Activity} from "@/types/activity";


export const activities: Activity[] = [
    {
        id: 1,
        type: "RUN",
        name: "Morning Run",
        date: "Today · 6:45 AM",
        distance: "5.0 mi",
        time: "40 min",
        paceOrPower: "8:00 /mi",
        status: "PENDING",
    },
    {
        id: 2,
        type: "RIDE",
        name: "Endurance Ride",
        date: "Yesterday · 2:20 PM",
        distance: "25.0 mi",
        time: "90 min",
        paceOrPower: "178 W",
        status: "COMPLETED",
        rpe: "4/10",
        pain: "0/10",
        mood: "Good",
    },
    {
        id: 3,
        type: "RUN",
        name: "Easy Run",
        date: "Jul 7 · 7:00 AM",
        distance: "4.2 mi",
        time: "36 min",
        paceOrPower: "8:34 /mi",
        status: "PENDING",
    },
];
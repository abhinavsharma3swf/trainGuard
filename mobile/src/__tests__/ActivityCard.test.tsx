/// <reference types="jest" />
import React from "react";
import { render } from "@testing-library/react-native";
import { ActivityCard } from "../components/ActivityCard";

// Mock router to avoid navigation during render
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("ActivityCard", () => {
  it("renders activity name and date for a ride", async () => {
    // Simple activity object matching the Activity type
    const activity = {
      id: 1,
      type: "RIDE",
      name: "Morning Ride",
      date: "2026-01-01T00:00:00Z",
      distance: "10 mi",
      time: "60 min",
      pace: "6:00",
      averageWatts: "150",
      status: "COMPLETED",
    } as any;

    // Render and assert it doesn't throw and shows the name
    const { getByText } = await render(<ActivityCard activity={activity} />);
    expect(getByText("Morning Ride")).toBeTruthy();
    expect(getByText("WATTS")).toBeTruthy();
  });
});

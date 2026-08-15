/// <reference types="jest" />
import React from "react";
import {render} from "@testing-library/react-native";
import { act } from "react-test-renderer";
import Dashboard from "../app/dashboard";

// Mock the DashboardDataContext hook to return a static value for tests
jest.mock("../context/DashboardDataContext", () => ({
  useDashboardData: () => ({
    feedItems: [],
    isLoading: false,
    error: "",
    refreshDashboardFeed: async () => {},
    clearDashboardData: () => {},
  }),
}));

// Mock expo-router to avoid navigation context requirement in tests
jest.mock("expo-router", () => ({
  useFocusEffect: (cb: any) => {
    // call the effect synchronously for tests
    try {
      cb();
    } catch (e) {
      // ignore
    }
  },
  router: { replace: jest.fn() },
  useNavigation: () => ({})
}));

// Mock services that trigger native or network behavior
jest.mock("@/services/notificationService", () => ({
  registerForRemoteNotifications: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/services/agreementService", () => ({
  acceptedUserDisclaimers: jest.fn().mockResolvedValue(undefined),
}));

describe("Dashboard screen", () => {
  it("renders header and sync button when there are no feed items", async () => {
    jest.useFakeTimers();
    const rendered = await render(<Dashboard />);
    const { getByText } = rendered;

    // run pending timers (modal timeout) inside act to avoid update warnings
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByText("Smart Gauge")).toBeTruthy();
    expect(getByText("Sync")).toBeTruthy();

    jest.useRealTimers();
  });
});

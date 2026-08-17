/// <reference types="jest" />
import {getDashboardFeed} from "../services/dashboardApi";
import * as athleteStorage from "../services/athleteStorage";

describe("dashboardApi.getDashboardFeed", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws when no session token is available", async () => {
    jest.spyOn(athleteStorage, "getSessionToken").mockResolvedValue(null);

    await expect(getDashboardFeed()).rejects.toThrow("Missing session token.");
  });

  it("fetches and returns feed items when token is present", async () => {
    jest.spyOn(athleteStorage, "getSessionToken").mockResolvedValue("fake-token");

    const fakeResponse = [{ activityId: 1, sportType: "RIDE", name: "Ride 1", startDate: "2026-01-01T00:00:00Z", distanceMiles: 10, movingTimeMinutes: 60, pacePerMile: "6:00", checkinStatus: "COMPLETED", rpe: null, painScore: null, painLocation: null, averageWatts: "150", description: "" }];

    (globalThis as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(fakeResponse) });

    const result = await getDashboardFeed();

    expect((globalThis as any).fetch).toHaveBeenCalled();
    expect(result).toEqual(fakeResponse);
  });
});

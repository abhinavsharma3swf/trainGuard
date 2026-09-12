/// <reference types="jest" />
import {getActivities} from "../services/activityApi";
import * as athleteStorage from "../services/athleteStorage";

describe("activityApi.getActivities", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("requires a session token", async () => {
    jest.spyOn(athleteStorage, "getSessionToken").mockResolvedValue(null);

    await expect(getActivities()).rejects.toThrow("Missing session token.");
  });

  it("sends the session token and pagination parameters", async () => {
    jest.spyOn(athleteStorage, "getSessionToken").mockResolvedValue("fake-token");
    const response = {ok: true, json: () => Promise.resolve([])};
    (globalThis as any).fetch = jest.fn().mockResolvedValue(response);

    await expect(getActivities(2, 25)).resolves.toEqual([]);

    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/activities?page=2&size=25"),
      {headers: {Authorization: "Bearer fake-token"}},
    );
  });
});
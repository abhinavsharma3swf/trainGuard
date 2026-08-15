/// <reference types="jest" />
import React from "react";
import { render } from "@testing-library/react-native";
import SummaryProgressBar from "../components/SummaryProgressBar";

describe("SummaryProgressBar", () => {
  it("shows numeric progress text", async () => {
    const { getByText } = await render(
      <SummaryProgressBar label="Completed" value={2} total={4} />
    );

    // Should show 2/4 and percentage
    expect(getByText("2/4 · 50%")).toBeTruthy();
    expect(getByText("Completed")).toBeTruthy();
  });
});

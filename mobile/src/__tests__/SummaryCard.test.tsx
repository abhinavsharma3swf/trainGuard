/// <reference types="jest" />
import React from "react";
import { render } from "@testing-library/react-native";
import { SummaryCard } from "../components/SummaryCard";

describe("SummaryCard", () => {
  it("displays label, value and unit", async () => {
    // Render a simple summary with label and unit
    const { getByText } = await render(
      <SummaryCard label="Pending" value="3" unit="check-ins" />
    );

    // Verify important pieces are present
    expect(getByText("Pending")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
    expect(getByText("check-ins")).toBeTruthy();
  });
});

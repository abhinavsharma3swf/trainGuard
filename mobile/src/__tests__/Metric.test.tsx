/// <reference types="jest" />
import React from "react";
import { render } from "@testing-library/react-native";
import { Metric } from "../components/Metric";

describe("Metric", () => {
  it("renders the label and value", async () => {
    // Render a simple metric and assert label/value are present
    const { getByText } = await render(<Metric label="Distance" value="10 mi" />);
    expect(getByText("Distance")).toBeTruthy();
    expect(getByText("10 mi")).toBeTruthy();
  });
});

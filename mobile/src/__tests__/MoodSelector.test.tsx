/// <reference types="jest" />
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodSelector } from "../components/MoodSelector";

describe("MoodSelector", () => {
  it("calls onSelect with the chosen mood", async () => {
    const onSelect = jest.fn();

    const { getByText } = await render(
      <MoodSelector selectedMood="Good" onSelect={onSelect} />
    );

    // Press the 'Great' option and expect onSelect called with 'Great'
    const option = getByText("Great");
    fireEvent.press(option);
    expect(onSelect).toHaveBeenCalledWith("Great");
  });
});

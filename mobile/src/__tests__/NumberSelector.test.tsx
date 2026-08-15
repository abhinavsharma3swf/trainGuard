/// <reference types="jest" />
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import { NumberSelector } from "../components/NumberSelector";

// Mock the keyboard-aware scroll view import used by the component
jest.mock("react-native-keyboard-controller", () => ({ KeyboardAwareScrollView: ({ children }: any) => children }));

describe("NumberSelector", () => {
  it("selects a value and toggles off when pressed again", async () => {
    const onSelect = jest.fn();
    const values = [1, 2, 3];

    // Use a small wrapper to simulate a parent managing `selectedValue`.
    const TestWrapper = () => {
      const [selected, setSelected] = React.useState<number | null>(null);
      return (
        <NumberSelector
          label="RPE"
          values={values}
          selectedValue={selected}
          onSelect={(v) => {
            setSelected(v);
            onSelect(v);
          }}
        />
      );
    };

    const wrapper = await render(<TestWrapper />);
    const { getByText: getByTextFromWrapper } = wrapper;

    // First press selects 2
    fireEvent.press(getByTextFromWrapper("2"));
    expect(onSelect).toHaveBeenCalledWith(2);

    // Clear mock and wait a tick for state to update in the wrapper
    onSelect.mockClear();
    await act(async () => {
      await Promise.resolve();
    });

    // Second press should toggle off (null)
    fireEvent.press(getByTextFromWrapper("2"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});

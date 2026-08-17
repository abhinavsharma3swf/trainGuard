/// <reference types="jest" />
import React from "react";
import { render } from "@testing-library/react-native";
import { BottomNav } from "../components/BottomNav";

// Mock router and vector icons used by BottomNav
jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }));
jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));

describe("BottomNav", () => {
  it("renders without crashing for activeRoute weekly", async () => {
    const tree = await render(<BottomNav activeRoute="weekly" />);
    // Ensure render produced a tree
    expect(tree.toJSON()).toBeTruthy();
  });
});

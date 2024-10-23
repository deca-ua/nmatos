import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchButton from "../components/SearchButton";

describe("SearchButton", () => {
  it("renders with the correct text when not loading", () => {
    const mockOnClick = jest.fn();
    render(
      <SearchButton onClick={mockOnClick} loading={false} disabled={false} />,
    );

    const buttonElement = screen.getByRole("button", { name: /search/i });
    expect(buttonElement).toBeInTheDocument(); // Check if the button is rendered
    expect(buttonElement).not.toBeDisabled(); // Ensure the button is not disabled
    expect(buttonElement).toHaveTextContent("Search"); // Check button text
  });

  it("renders with the correct text when loading", () => {
    const mockOnClick = jest.fn();
    render(
      <SearchButton onClick={mockOnClick} loading={true} disabled={false} />,
    );

    const buttonElement = screen.getByRole("button", { name: /search/i });
    expect(buttonElement).toBeInTheDocument(); // Check if the button is rendered
    expect(buttonElement).not.toBeDisabled(); // Ensure the button is not disabled
    expect(buttonElement).toHaveTextContent("Searching..."); // Check button text
  });

  it("is disabled when disabled prop is true", () => {
    const mockOnClick = jest.fn();
    render(
      <SearchButton onClick={mockOnClick} loading={false} disabled={true} />,
    );

    const buttonElement = screen.getByRole("button", { name: /search/i });
    expect(buttonElement).toBeDisabled(); // Ensure the button is disabled
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = jest.fn();
    render(
      <SearchButton onClick={mockOnClick} loading={false} disabled={false} />,
    );

    const buttonElement = screen.getByRole("button", { name: /search/i });
    fireEvent.click(buttonElement); // Simulate a button click

    expect(mockOnClick).toHaveBeenCalledTimes(1); // Ensure onClick is called once
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import ClearButton from '../components/ClearButton'; // Adjust the path as necessary

describe('ClearButton', () => {
  it('renders the button with correct text', () => {
    const mockOnClick = jest.fn(); // Mock the onClick function

    render(<ClearButton onClick={mockOnClick} />);

    const buttonElement = screen.getByRole('button', { name: /clear all/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    const mockOnClick = jest.fn(); // Mock the onClick function

    render(<ClearButton onClick={mockOnClick} />);

    const buttonElement = screen.getByRole('button', { name: /clear all/i });
    buttonElement.click(); // Simulate a click event

    expect(mockOnClick).toHaveBeenCalled(); // Assert that onClick was called
  });
});

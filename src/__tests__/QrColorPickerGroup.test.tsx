import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QrColorPickerGroup } from '@/components/qrcodes/QrColorPickerGroup';

describe('QrColorPickerGroup', () => {
  const defaultProps = {
    codeColor: '#000000',
    bgColor: '#ffffff',
    presetColor: '#000000',
    onChangeCodeColor: jest.fn(),
    onChangeBgColor: jest.fn(),
    onChangePresetColor: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Choose your colors heading and preset buttons', () => {
    render(<QrColorPickerGroup {...defaultProps} />);
    expect(screen.getByText(/Choose your colors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Royal Blue preset/i)).toBeInTheDocument();
  });

  it('triggers color callbacks when preset button is clicked', () => {
    render(<QrColorPickerGroup {...defaultProps} />);
    const royalBlueBtn = screen.getByLabelText(/Select Royal Blue preset/i);
    fireEvent.click(royalBlueBtn);

    expect(defaultProps.onChangePresetColor).toHaveBeenCalledWith('#2a5bd7');
    expect(defaultProps.onChangeCodeColor).toHaveBeenCalledWith('#2a5bd7');
  });
});

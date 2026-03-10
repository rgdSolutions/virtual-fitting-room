import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TryOnResultScreen } from '../../src/screens/TryOnResultScreen';
import { useNavigation } from '@react-navigation/native';

const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useNavigation as jest.Mock).mockReturnValue({
    navigate: mockNavigate,
    goBack: jest.fn(),
  });
});

describe('TryOnResultScreen', () => {
  it('renders title "Your" / "Try-On"', () => {
    const { getByText } = render(<TryOnResultScreen />);
    expect(getByText('Your')).toBeTruthy();
    expect(getByText('Try-On')).toBeTruthy();
  });

  it('renders description text', () => {
    const { getByText } = render(<TryOnResultScreen />);
    expect(getByText(/sample result/i)).toBeTruthy();
  });

  it('renders "Start Over" button', () => {
    const { getByText } = render(<TryOnResultScreen />);
    expect(getByText('Start Over')).toBeTruthy();
  });

  it('navigates to PhotoUpload with { reset: true } on press', () => {
    const { getByText } = render(<TryOnResultScreen />);
    fireEvent.press(getByText('Start Over'));
    expect(mockNavigate).toHaveBeenCalledWith('PhotoUpload', { reset: true });
  });
});

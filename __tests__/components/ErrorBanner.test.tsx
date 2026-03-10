import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBanner } from '../../src/components/ErrorBanner';

describe('ErrorBanner', () => {
  const onDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when !visible and !message', () => {
    const { toJSON } = render(
      <ErrorBanner message="" visible={false} onDismiss={onDismiss} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders message text when visible', () => {
    const { getByText } = render(
      <ErrorBanner
        message="Something went wrong"
        visible={true}
        onDismiss={onDismiss}
      />,
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('renders dismiss button', () => {
    const { getByText } = render(
      <ErrorBanner message="Error" visible={true} onDismiss={onDismiss} />,
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('calls onDismiss on dismiss press', () => {
    const { getByText } = render(
      <ErrorBanner message="Error" visible={true} onDismiss={onDismiss} />,
    );
    fireEvent.press(getByText('✕'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('still renders when visible=false but message is non-empty', () => {
    const { getByText } = render(
      <ErrorBanner
        message="Lingering error"
        visible={false}
        onDismiss={onDismiss}
      />,
    );
    expect(getByText('Lingering error')).toBeTruthy();
  });
});

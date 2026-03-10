import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('renders PhotoUploadScreen as initial screen', () => {
    const { getByText } = render(<App />);
    expect(getByText('Virtual')).toBeTruthy();
    expect(getByText('Fitting Room')).toBeTruthy();
  });
});

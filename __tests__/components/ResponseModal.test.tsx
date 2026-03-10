import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResponseModal } from '../../src/components/ResponseModal';

describe('ResponseModal', () => {
  const onContinue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Upload Successful" header', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={{}}
        onContinue={onContinue}
      />,
    );
    expect(getByText('Upload Successful')).toBeTruthy();
  });

  it('shows "Continue" button and calls onContinue on press', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={{}}
        onContinue={onContinue}
      />,
    );
    const button = getByText('Continue');
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('filters out "files" key', () => {
    const { queryByText } = render(
      <ResponseModal
        visible={true}
        responseData={{ files: { big: 'data' }, url: 'https://example.com' }}
        onContinue={onContinue}
      />,
    );
    expect(queryByText('files')).toBeNull();
    expect(queryByText('url')).toBeTruthy();
  });

  it('renders primitive values as strings', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={{ status: 200, ip: '1.2.3.4' }}
        onContinue={onContinue}
      />,
    );
    expect(getByText('200')).toBeTruthy();
    expect(getByText('1.2.3.4')).toBeTruthy();
  });

  it('shows dash for null/undefined/empty string values', () => {
    const { getAllByText } = render(
      <ResponseModal
        visible={true}
        responseData={{ a: null, b: undefined, c: '' }}
        onContinue={onContinue}
      />,
    );
    const dashes = getAllByText('—');
    expect(dashes.length).toBe(3);
  });

  it('shows "(empty)" for empty object {}', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={{ headers: {} }}
        onContinue={onContinue}
      />,
    );
    expect(getByText('(empty)')).toBeTruthy();
  });

  it('renders nested objects as section + sub-rows', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={{
          headers: {
            Host: 'httpbin.org',
            Accept: '*/*',
          },
        }}
        onContinue={onContinue}
      />,
    );
    expect(getByText('headers')).toBeTruthy();
    expect(getByText('Host')).toBeTruthy();
    expect(getByText('httpbin.org')).toBeTruthy();
    expect(getByText('Accept')).toBeTruthy();
    expect(getByText('*/*')).toBeTruthy();
  });

  it('handles null responseData gracefully', () => {
    const { getByText } = render(
      <ResponseModal
        visible={true}
        responseData={null}
        onContinue={onContinue}
      />,
    );
    expect(getByText('Upload Successful')).toBeTruthy();
  });
});

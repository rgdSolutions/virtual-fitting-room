import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PhotoUploadScreen } from '../../src/screens/PhotoUploadScreen';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { uploadPhoto } from '../../src/services/api';

jest.mock('../../src/services/api');

const mockNavigate = jest.fn();
const mockLaunchImageLibrary = launchImageLibrary as jest.Mock;
const mockUploadPhoto = uploadPhoto as jest.Mock;
const mockUseRoute = useRoute as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  (useNavigation as jest.Mock).mockReturnValue({
    navigate: mockNavigate,
    goBack: jest.fn(),
  });
  mockUseRoute.mockReturnValue({ params: {} });
  mockLaunchImageLibrary.mockResolvedValue({
    assets: [{ uri: 'file:///photo.jpg' }],
  });
});

describe('PhotoUploadScreen', () => {
  it('renders title "Virtual" / "Fitting Room"', () => {
    const { getByText } = render(<PhotoUploadScreen />);
    expect(getByText('Virtual')).toBeTruthy();
    expect(getByText('Fitting Room')).toBeTruthy();
  });

  it('shows "Select Photo" button initially', () => {
    const { getByText } = render(<PhotoUploadScreen />);
    expect(getByText('Select Photo')).toBeTruthy();
  });

  it('does not show "Confirm & Upload" when no image', () => {
    const { queryByText } = render(<PhotoUploadScreen />);
    expect(queryByText('Confirm & Upload')).toBeNull();
  });

  it('shows placeholder "Select your photo"', () => {
    const { getByText } = render(<PhotoUploadScreen />);
    expect(getByText('Select your photo')).toBeTruthy();
  });

  it('calls launchImageLibrary on button press', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ didCancel: true });
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(mockLaunchImageLibrary).toHaveBeenCalledWith({
        mediaType: 'photo',
        selectionLimit: 1,
      });
    });
  });

  it('shows "Change Photo" after selection', async () => {
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(getByText('Change Photo')).toBeTruthy();
    });
  });

  it('shows "Confirm & Upload" after selection', async () => {
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(getByText('Confirm & Upload')).toBeTruthy();
    });
  });

  it('does nothing on picker cancel', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ didCancel: true });
    const { getByText, queryByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(mockLaunchImageLibrary).toHaveBeenCalled();
    });
    expect(queryByText('Confirm & Upload')).toBeNull();
  });

  it('shows permission error on picker permission errorCode', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ errorCode: 'permission' });
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(
        getByText('Photo library access denied. Please enable it in Settings.'),
      ).toBeTruthy();
    });
  });

  it('shows picker errorMessage for other errorCodes', async () => {
    mockLaunchImageLibrary.mockResolvedValue({
      errorCode: 'camera_unavailable',
      errorMessage: 'Camera not available',
    });
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(getByText('Camera not available')).toBeTruthy();
    });
  });

  it('shows fallback "Failed to open gallery" when no errorMessage', async () => {
    mockLaunchImageLibrary.mockResolvedValue({
      errorCode: 'other',
    });
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(getByText('Failed to open gallery')).toBeTruthy();
    });
  });

  it('shows generic error when launchImageLibrary throws', async () => {
    mockLaunchImageLibrary.mockRejectedValue(new Error('boom'));
    const { getByText } = render(<PhotoUploadScreen />);
    fireEvent.press(getByText('Select Photo'));

    await waitFor(() => {
      expect(
        getByText('An unexpected error occurred while selecting a photo.'),
      ).toBeTruthy();
    });
  });

  it('calls uploadPhoto with selected URI', async () => {
    mockUploadPhoto.mockResolvedValue({ status: 'ok' });
    const { getByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Confirm & Upload'));

    fireEvent.press(getByText('Confirm & Upload'));
    await waitFor(() => {
      expect(mockUploadPhoto).toHaveBeenCalledWith('file:///photo.jpg');
    });
  });

  it('shows response modal on successful upload', async () => {
    mockUploadPhoto.mockResolvedValue({ status: 'ok' });
    const { getByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Confirm & Upload'));

    fireEvent.press(getByText('Confirm & Upload'));
    await waitFor(() => {
      expect(getByText('Upload Successful')).toBeTruthy();
    });
  });

  it('shows error on upload failure (Error instance)', async () => {
    mockUploadPhoto.mockRejectedValue(new Error('Server down'));
    const { getByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Confirm & Upload'));

    fireEvent.press(getByText('Confirm & Upload'));
    await waitFor(() => {
      expect(getByText('Server down')).toBeTruthy();
    });
  });

  it('shows generic error on upload failure (non-Error)', async () => {
    mockUploadPhoto.mockRejectedValue('something');
    const { getByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Confirm & Upload'));

    fireEvent.press(getByText('Confirm & Upload'));
    await waitFor(() => {
      expect(getByText('Upload failed. Please try again.')).toBeTruthy();
    });
  });

  it('navigates to TryOnResult on Continue press', async () => {
    mockUploadPhoto.mockResolvedValue({ status: 'ok' });
    const { getByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Confirm & Upload'));

    fireEvent.press(getByText('Confirm & Upload'));
    await waitFor(() => getByText('Upload Successful'));

    fireEvent.press(getByText('Continue'));
    expect(mockNavigate).toHaveBeenCalledWith('TryOnResult');
  });

  it('resets state when route.params.reset is true', async () => {
    mockUploadPhoto.mockResolvedValue({ status: 'ok' });
    const { getByText, queryByText, rerender } = render(<PhotoUploadScreen />);

    // Select image
    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => getByText('Change Photo'));

    // Now simulate reset
    mockUseRoute.mockReturnValue({ params: { reset: true } });
    rerender(<PhotoUploadScreen />);

    await waitFor(() => {
      expect(queryByText('Confirm & Upload')).toBeNull();
      expect(getByText('Select Photo')).toBeTruthy();
    });
  });

  it('clears error on dismiss press', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ errorCode: 'permission' });
    const { getByText, queryByText } = render(<PhotoUploadScreen />);

    fireEvent.press(getByText('Select Photo'));
    await waitFor(() => {
      expect(
        getByText('Photo library access denied. Please enable it in Settings.'),
      ).toBeTruthy();
    });

    fireEvent.press(getByText('✕'));
    await waitFor(() => {
      expect(
        queryByText(
          'Photo library access denied. Please enable it in Settings.',
        ),
      ).toBeNull();
    });
  });
});

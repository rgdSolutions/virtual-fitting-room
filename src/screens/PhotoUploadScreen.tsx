import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { ErrorBanner } from '../components/ErrorBanner';
import { ResponseModal } from '../components/ResponseModal';
import { uploadPhoto } from '../services/api';
import { colors, typography, spacing } from '../theme';

export function PhotoUploadScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PhotoUpload'>>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [responseData, setResponseData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.reset) {
      setImageUri(null);
      setError(null);
      setResponseData(null);
      setModalVisible(false);
    }
  }, [route.params]);

  const handleSelectPhoto = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        const msg =
          result.errorCode === 'permission'
            ? 'Photo library access denied. Please enable it in Settings.'
            : result.errorMessage || 'Failed to open gallery';
        setError(msg);
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.uri) {
        setError(null);
        setImageUri(asset.uri);
      }
    } catch {
      setError('An unexpected error occurred while selecting a photo.');
    }
  }, []);

  const handleImageError = useCallback(() => {
    setError('Failed to load the selected image. Please try another.');
    setImageUri(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!imageUri) {
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const data = await uploadPhoto(imageUri);
      setResponseData(data);
      setModalVisible(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
    }
  }, [imageUri]);

  const handleContinue = useCallback(() => {
    setModalVisible(false);
    navigation.navigate('TryOnResult');
  }, [navigation]);

  const hasImage = imageUri !== null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ErrorBanner
        message={error || ''}
        visible={error !== null}
        onDismiss={() => setError(null)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Virtual</Text>
          <Text style={styles.title}>Fitting Room</Text>
        </View>

        {/* Image Preview */}
        <View
          style={[styles.previewContainer, !hasImage && styles.previewEmpty]}
        >
          {hasImage ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.cameraIcon}>&#x1F4F7;</Text>
              <Text style={styles.placeholderText}>Select your photo</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSelectPhoto}
          >
            <Text style={styles.primaryButtonText}>
              {hasImage ? 'Change Photo' : 'Select Photo'}
            </Text>
          </Pressable>

          {hasImage && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                uploading && styles.secondaryButtonDisabled,
                pressed && !uploading && styles.buttonPressed,
              ]}
              disabled={uploading}
              onPress={handleUpload}
            >
              {uploading ? (
                <ActivityIndicator color={colors.accent} size="small" />
              ) : (
                <Text
                  style={[
                    styles.secondaryButtonText,
                    uploading && styles.secondaryButtonTextDisabled,
                  ]}
                >
                  Confirm & Upload
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>

      <ResponseModal
        visible={modalVisible}
        responseData={responseData}
        onContinue={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  titleBlock: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.screenTitle,
  },
  previewContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    marginHorizontal: 'auto',
  },
  previewEmpty: {
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  previewImage: {
    flex: 1,
    borderRadius: 12,
  },
  placeholderContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  cameraIcon: {
    fontSize: 36,
    opacity: 0.6,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.background,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonDisabled: {
    borderColor: colors.accentMuted,
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.accent,
  },
  secondaryButtonTextDisabled: {
    color: colors.accentMuted,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

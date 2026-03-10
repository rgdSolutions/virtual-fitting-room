import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing} from '../theme';

function PlaceholderSilhouette() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={placeholderStyles.container}>
      {/* Abstract fashion silhouette built from geometric shapes */}
      <Animated.View
        style={[placeholderStyles.figure, {opacity: shimmerOpacity}]}>
        {/* Head */}
        <View style={placeholderStyles.head} />
        {/* Neck */}
        <View style={placeholderStyles.neck} />
        {/* Shoulders & torso */}
        <View style={placeholderStyles.shoulders} />
        <View style={placeholderStyles.torso} />
        {/* Waist accent line */}
        <View style={placeholderStyles.waistLine} />
        {/* Lower body / skirt silhouette */}
        <View style={placeholderStyles.skirt} />
      </Animated.View>

      {/* Decorative corner marks */}
      <View style={[placeholderStyles.corner, placeholderStyles.cornerTL]} />
      <View style={[placeholderStyles.corner, placeholderStyles.cornerTR]} />
      <View style={[placeholderStyles.corner, placeholderStyles.cornerBL]} />
      <View style={[placeholderStyles.corner, placeholderStyles.cornerBR]} />
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  figure: {
    alignItems: 'center',
  },
  head: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.accentMuted,
    marginBottom: 4,
  },
  neck: {
    width: 2,
    height: 10,
    backgroundColor: colors.accentMuted,
  },
  shoulders: {
    width: 72,
    height: 2,
    backgroundColor: colors.accentMuted,
    borderRadius: 1,
    marginBottom: 2,
  },
  torso: {
    width: 56,
    height: 64,
    borderWidth: 1.5,
    borderColor: colors.accentMuted,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  waistLine: {
    width: 48,
    height: 1,
    backgroundColor: colors.accent,
    marginVertical: 2,
  },
  skirt: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderTopWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surfaceLight,
    opacity: 0.6,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.accentMuted,
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderRightWidth: 1,
    borderTopWidth: 1,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
});

export function TryOnResultScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.screen, {paddingTop: insets.top}]}>
      <Animated.View
        style={[
          styles.content,
          {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
        ]}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Your</Text>
          <Text style={styles.title}>Try-On</Text>
        </View>

        {/* Result Image Area */}
        <View style={styles.resultContainer}>
          <PlaceholderSilhouette />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          This is a sample result.{'\n'}Real try-on coming soon.
        </Text>

        {/* Back button */}
        <Pressable
          style={({pressed}) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('PhotoUpload', {reset: true})}>
          <Text style={styles.backButtonText}>Start Over</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  titleBlock: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.screenTitle,
  },
  resultContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  backButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.button,
    color: colors.accent,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

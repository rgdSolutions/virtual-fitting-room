import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing} from '../theme';

const tryOnResultImage = require('../assets/gettyimages-1425659876-small.jpg');

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
          <Image
            source={tryOnResultImage}
            style={styles.resultImage}
            resizeMode="cover"
          />
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
  resultImage: {
    width: '100%',
    height: '100%',
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

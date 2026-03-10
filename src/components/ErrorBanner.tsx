import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../theme';

interface ErrorBannerProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export function ErrorBanner({message, visible, onDismiss}: ErrorBannerProps) {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  if (!visible && !message) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY}]}]}
      pointerEvents={visible ? 'auto' : 'none'}>
      <View style={styles.content}>
        <Text style={styles.text}>{message}</Text>
        <Pressable onPress={onDismiss} hitSlop={12}>
          <Text style={styles.dismiss}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.errorBg,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '400',
    marginRight: 12,
  },
  dismiss: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '300',
  },
});

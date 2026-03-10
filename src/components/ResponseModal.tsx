import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, typography, spacing} from '../theme';

interface ResponseModalProps {
  visible: boolean;
  responseData: Record<string, unknown> | null;
  onContinue: () => void;
}

export function ResponseModal({
  visible,
  responseData,
  onContinue,
}: ResponseModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.header}>Upload Successful</Text>
          <View style={styles.separator} />

          <View style={styles.fieldsContainer}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Origin</Text>
              <Text style={styles.fieldValue}>
                {responseData?.origin as string ?? '—'}
              </Text>
            </View>
            <View style={styles.fieldSeparator} />
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>URL</Text>
              <Text style={styles.fieldValue} numberOfLines={2}>
                {responseData?.url as string ?? '—'}
              </Text>
            </View>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  header: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.surfaceLight,
    marginVertical: 12,
  },
  fieldsContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: spacing.lg,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  fieldValue: {
    ...typography.mono,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  fieldSeparator: {
    height: 1,
    backgroundColor: colors.surfaceLight,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    ...typography.button,
    color: colors.background,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

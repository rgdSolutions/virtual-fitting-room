import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

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
  const renderField = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return (
        <View style={styles.fieldRow} key={key}>
          <Text style={styles.fieldLabel}>{key}</Text>
          <Text style={styles.fieldValue}>—</Text>
        </View>
      );
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return (
          <View style={styles.fieldRow} key={key}>
            <Text style={styles.fieldLabel}>{key}</Text>
            <Text style={styles.fieldValue}>(empty)</Text>
          </View>
        );
      }
      return (
        <View key={key}>
          <Text style={styles.sectionLabel}>{key}</Text>
          {entries.map(([subKey, subValue]) => (
            <View style={styles.fieldRow} key={`${key}-${subKey}`}>
              <Text style={styles.nestedFieldLabel}>{subKey}</Text>
              <Text style={styles.fieldValue} numberOfLines={2}>
                {String(subValue ?? '—')}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.fieldRow} key={key}>
        <Text style={styles.fieldLabel}>{key}</Text>
        <Text style={styles.fieldValue} numberOfLines={2}>
          {String(value)}
        </Text>
      </View>
    );
  };

  const entries = responseData
    ? Object.entries(responseData).filter(([key]) => key !== 'files')
    : [];

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.header}>Upload Successful</Text>
          <View style={styles.separator} />

          <ScrollView style={styles.scrollArea}>
            <View style={styles.fieldsContainer}>
              {entries.map(([key, value], index) => (
                <React.Fragment key={key}>
                  {index > 0 && <View style={styles.fieldSeparator} />}
                  {renderField(key, value)}
                </React.Fragment>
              ))}
            </View>
          </ScrollView>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onContinue}
          >
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
  scrollArea: {
    maxHeight: 350,
    marginBottom: spacing.lg,
  },
  fieldsContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
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
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingTop: 14,
    paddingBottom: 6,
  },
  nestedFieldLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '400',
    paddingLeft: 12,
    flexShrink: 0,
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

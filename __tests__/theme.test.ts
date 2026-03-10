import { colors, typography, spacing } from '../src/theme';

describe('theme', () => {
  describe('colors', () => {
    it('exports all expected keys with string values', () => {
      const expectedKeys = [
        'background',
        'surface',
        'surfaceLight',
        'accent',
        'accentMuted',
        'textPrimary',
        'textSecondary',
        'error',
        'errorBg',
      ];
      for (const key of expectedKeys) {
        expect(typeof colors[key as keyof typeof colors]).toBe('string');
      }
    });
  });

  describe('typography', () => {
    it('exports all expected keys', () => {
      const expectedKeys = ['screenTitle', 'button', 'body', 'mono'];
      for (const key of expectedKeys) {
        expect(typography[key as keyof typeof typography]).toBeDefined();
      }
    });

    it('mono fontFamily is "Menlo" on iOS (default platform)', () => {
      expect(typography.mono.fontFamily).toBe('Menlo');
    });
  });

  describe('spacing', () => {
    it('exports expected keys with numeric values', () => {
      const expectedKeys = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      for (const key of expectedKeys) {
        expect(typeof spacing[key as keyof typeof spacing]).toBe('number');
      }
    });
  });
});

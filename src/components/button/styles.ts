import { StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/styles/theme';

export const s = StyleSheet.create({
  container: {
    height: 56,
    maxHeight: 56,
    backgroundColor: colors.green.base,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: colors.gray[100],
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
});

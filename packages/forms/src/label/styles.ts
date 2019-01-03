import { Theme } from '../../../theme/lib';

export default (theme: Theme) => ({
  content: {
    marginTop: 5,
  },
  label: {
    color: theme.labelColor,
  },
  hasError: {
    color: theme.brandDanger,
  },
});

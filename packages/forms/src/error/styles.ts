import { Theme } from '../../../theme/lib';

export default (theme: Theme) => ({
  message: {
    color: theme.brandDanger,
    margin: '5px 0 0',
    fontSize: theme.uiFontSize,
  },
});

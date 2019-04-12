export default theme => ({
  container: {
    background: theme.colorSubscriptionContainerBackground,
    border: theme.colorSubscriptionContainerBorder,
    margin: [0, 0, 20, -20],
    padding: 20,
    'border-radius': theme.borderRadius,
    pointerEvents: 'none',
    height: 'auto',
  },
  titleContainer: {
    display: 'flex',
  },
  title: {
    'font-weight': 'bold',
    color: theme.colorSubscriptionContainerTitle,
  },
  actionButton: {
    background: theme.colorSubscriptionContainerActionButtonBackground,
    color: theme.colorSubscriptionContainerActionButtonColor,
    'margin-left': 'auto',
    'border-radius': theme.borderRadiusSmall,
    padding: [4, 8],
    'font-size': 12,
    pointerEvents: 'initial',
  },
  content: {
    opacity: 0.5,
    'margin-top': 20,
    '& > :last-child': {
      'margin-bottom': 0,
    },
  },
});

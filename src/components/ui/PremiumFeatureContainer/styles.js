export default theme => ({
  container: {
    background: theme.colorSubscriptionContainerBackground,
    border: theme.colorSubscriptionContainerBorder,
    margin: [0, 0, 20, -20],
    padding: 20,
    'border-radius': theme.borderRadius,
    pointerEvents: 'none',
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
    padding: [2, 4],
    'font-size': 12,
    pointerEvents: 'initial',
  },
  content: {
    opacity: 0.5,
    'margin-top': 20,
    '& :last-child': {
      'margin-bottom': 0,
    },
  },
});

export default theme => ({
  container: {
    background: theme.colorBackground,
    top: 0,
    width: '100%',
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
    'z-index': 150,
  },
  content: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
  },
  headline: {
    color: theme.colorHeadline,
    margin: [25, 0, 40],
    'max-width': 500,
    'text-align': 'center',
    'line-height': '1.3em',
  },
  button: {
    margin: [40, 0, 20],
  },
  countdown: {
    paddingBottom: 22,
  },
  continueCTA: {
    color: theme.colorText,
    textDecoration: 'underline',
    fontSize: 12,
  },
  poweredBy: {
    position: 'absolute',
    height: 'auto',
    // textAlign: 'center',
    maxWidth: 400,
    right: 40,
    bottom: 40,
  },
  poweredByContainer: {
    padding: 20,
    borderRadius: theme.borderRadius,
    background: theme.styleTypes.primary.accent,
    color: theme.styleTypes.primary.contrast,
  },
  poweredByIntro: {
    fontSize: 11,
    paddingBottom: 10,
    color: theme.colorText,
  },
  poweredByContentContainer: {
    display: 'flex',
  },
  poweredByContent: {
    marginLeft: 20,
  },
  poweredByName: {
    fontWeight: 'bold',
  },
  poweredByDescription: {
    // fontWeight: 'bold',
  },
  poweredByLogo: {
    maxWidth: 80,
    maxHeight: 80,
    borderRadius: theme.borderRadius,
    marginTop: 4,
  },
  poweredByCTA: {
    // border: [1, 'solid', theme.styleTypes.primary.contrast],
    // borderRadius: theme.borderRadiusSmall,
    color: theme.styleTypes.primary.contrast,
    // padding: [4, 8],
    marginTop: 10,
    cursor: 'pointer',
    transition: 'opacity 0.25s',
    display: 'flex',
    alignItems: 'center',

    '& span': {
      marginLeft: 5,
      textDecoration: 'underline',
    },

    '&:hover': {
      opacity: 0.7,
    },
  },
  poweredByActionsContainer: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',

    '& button': {
      fontSize: 11,
      color: theme.colorText,
      cursor: 'pointer',
    },
  },
});

export default {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    position: ({ isAbsolutePositioned }) => (isAbsolutePositioned ? 'absolute' : 'relative'),
    width: '100%',
  },
  component: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: 'auto',
  },
  title: {
    fontSize: 35,
  },
  content: {
    marginTop: 20,
    width: '100%',
  },
};

import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import withTheme from '../.storybook/theme';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withInfo());
addDecorator(withTheme());

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

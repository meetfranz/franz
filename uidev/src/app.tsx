import { Classes } from 'jss';
import React, { Component } from 'react';
import { render } from 'react-dom';
import injectSheet from 'react-jss';
import './stories/input';
import { WithTheme } from './withTheme';

import { store } from './stores';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
  },
  menu: {
    width: 300,
    position: 'fixed' as any,
  },
  stories: {
    width: '100%',
    marginLeft: 320,
    paddingLeft: 40,
    paddingRight: 40,
    borderLeft: '1px solid #CFCFCF',
  },
  sectionHeadline: {
    fontSize: 30,
  },
  storyHeadline: {
    fontSize: 24,
  },
  story: {
    paddingBottom: 40,
    marginBottom: 40,
    borderBottom: '1px solid #CFCFCF',
  },
};

const foo = {
  seas: 'bar',
};

export const App = injectSheet(styles)(({ classes }: { classes: Classes }) => (
  <div className={classes.container}>
    <ul className={classes.menu}>
      {store.stories.sections.map((section, key) => (
        <li key={key}>
          <a href={`#section-${key}`}>{
            section.name}
          </a>
          <ul>
            {section.stories.map((story, storyKey) => (
              <li key={storyKey}>
                <a href={`#section-${key}-story-${storyKey}`}>
                  {story.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
    <div className={classes.stories}>
      {store.stories.sections.map((section, key) => (
        <div key={key}>
          <h1
            id={`section-${key}`}
            className={classes.sectionHeadline}
          >
            {section.name}
          </h1>
          {section.stories.map((story, storyKey) => (
            <div className={classes.story} key={storyKey}>
              <h2
                id={`section-${key}-story-${storyKey}`}
                className={classes.storyHeadline}
              >
                {story.name}
              </h2>
              <WithTheme>
                {story.component()}
              </WithTheme>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
));

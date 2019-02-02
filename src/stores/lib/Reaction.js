// @flow
import { autorun } from 'mobx';

export default class Reaction {
  reaction;

  hasBeenStarted;

  dispose;

  constructor(reaction) {
    this.reaction = reaction;
    this.hasBeenStarted = false;
  }

  start() {
    this.dispose = autorun(() => this.reaction());
    this.hasBeenStarted = true;
  }

  stop() {
    if (this.hasBeenStarted) this.dispose();
  }
}

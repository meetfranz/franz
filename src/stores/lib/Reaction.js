import { autorun } from 'mobx';

export default class Reaction {
  reaction;

  options;

  isRunning = false;

  dispose;

  constructor(reaction, options = {}) {
    this.reaction = reaction;
    this.options = options;
  }

  start() {
    if (!this.isRunning) {
      this.dispose = autorun(this.reaction, this.options);
      this.isRunning = true;
    }
  }

  stop() {
    if (this.isRunning) {
      this.dispose();
      this.isRunning = false;
    }
  }
}

export const createReactions = reactions => (
  reactions.map(r => new Reaction(r))
);

import Reaction from '../../stores/lib/Reaction';

export class FeatureStore {
  _actions = null;

  _reactions = null;

  stop() {
    this._stopActions();
    this._stopReactions();
  }

  // ACTIONS

  _registerActions(actions) {
    this._actions = [];
    actions.forEach(a => this._actions.push(a));
    this._startActions(this._actions);
  }

  _startActions(actions = this._actions) {
    actions.forEach(a => a[0].listen(a[1]));
  }

  _stopActions(actions = this._actions) {
    actions.forEach(a => a[0].off(a[1]));
  }

  // REACTIONS

  _registerReactions(reactions) {
    this._reactions = [];
    reactions.forEach(r => this._reactions.push(new Reaction(r)));
    this._startReactions(this._reactions);
  }

  _startReactions(reactions = this._reactions) {
    reactions.forEach(r => r.start());
  }

  _stopReactions(reactions = this._reactions) {
    reactions.forEach(r => r.stop());
  }
}

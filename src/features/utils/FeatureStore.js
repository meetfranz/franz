import Reaction from '../../stores/lib/Reaction';

export class FeatureStore {
  _actions = null;

  _reactions = null;

  _registerActions(actions) {
    this._actions = [];
    actions.forEach(a => this._actions.push(a));
    this._startListeningToActions();
  }

  _startListeningToActions() {
    this._stopListeningToActions();
    this._actions.forEach(a => a[0].listen(a[1]));
  }

  _stopListeningToActions() {
    this._actions.forEach(a => a[0].off(a[1]));
  }

  _registerReactions(reactions) {
    this._reactions = [];
    reactions.forEach(r => this._reactions.push(new Reaction(r)));
    this._startReactions();
  }

  _startReactions() {
    this._stopReactions();
    this._reactions.forEach(r => r.start());
  }

  _stopReactions() {
    this._reactions.forEach(r => r.stop());
  }

  stop() {
    this._stopListeningToActions();
    this._stopReactions();
  }
}

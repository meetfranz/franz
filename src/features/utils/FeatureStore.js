import Reaction from '../../stores/lib/Reaction';

export class FeatureStore {
  _actions = null;

  _reactions = null;

  _listenToActions(actions) {
    if (this._actions) this._actions.forEach(a => a[0].off(a[1]));
    this._actions = [];
    actions.forEach(a => this._actions.push(a));
    this._actions.forEach(a => a[0].listen(a[1]));
  }

  _startReactions(reactions) {
    if (this._reactions) this._reactions.forEach(r => r.stop());
    this._reactions = [];
    reactions.forEach(r => this._reactions.push(new Reaction(r)));
    this._reactions.forEach(r => r.start());
  }
}

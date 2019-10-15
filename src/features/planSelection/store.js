import {
  action,
  observable,
  computed,
} from 'mobx';
import { remote } from 'electron';

import { planSelectionActions } from './actions';
import { FeatureStore } from '../utils/FeatureStore';
// import { createReactions } from '../../stores/lib/Reaction';
import { createActionBindings } from '../utils/ActionBinding';
import { downgradeUserRequest } from './api';

const debug = require('debug')('Franz:feature:planSelection:store');

const { BrowserWindow } = remote;

export default class PlanSelectionStore extends FeatureStore {
  @observable isFeatureEnabled = false;

  @observable isFeatureActive = false;

  @observable hideOverlay = false;

  @computed get showPlanSelectionOverlay() {
    const { team } = this.stores.user;
    if (team && !this.hideOverlay) {
      return team.state === 'expired' && !team.userHasDowngraded;
    }

    return false;
  }

  // ========== PUBLIC API ========= //

  @action start(stores, actions, api) {
    debug('PlanSelectionStore::start');
    this.stores = stores;
    this.actions = actions;
    this.api = api;

    // ACTIONS

    this._registerActions(createActionBindings([
      [planSelectionActions.upgradeAccount, this._upgradeAccount],
      [planSelectionActions.downgradeAccount, this._downgradeAccount],
      [planSelectionActions.hideOverlay, this._hideOverlay],
    ]));

    // REACTIONS

    // this._allReactions = createReactions([
    //   this._setFeatureEnabledReaction,
    //   this._updateTodosConfig,
    //   this._firstLaunchReaction,
    //   this._routeCheckReaction,
    // ]);

    // this._registerReactions(this._allReactions);

    this.isFeatureActive = true;
  }

  @action stop() {
    super.stop();
    debug('PlanSelectionStore::stop');
    this.reset();
    this.isFeatureActive = false;
  }

  // ========== PRIVATE METHODS ========= //

  // Actions

  @action _upgradeAccount = ({ planId, onCloseWindow = () => null }) => {
    let hostedPageURL = this.stores.features.features.subscribeURL;

    const parsedUrl = new URL(hostedPageURL);
    const params = new URLSearchParams(parsedUrl.search.slice(1));

    params.set('plan', planId);

    hostedPageURL = this.stores.user.getAuthURL(`${parsedUrl.origin}${parsedUrl.pathname}?${params.toString()}`);

    const win = new BrowserWindow({
      parent: remote.getCurrentWindow(),
      modal: true,
      title: '🔒 Upgrade Your Franz Account',
      width: 800,
      height: window.innerHeight - 100,
      maxWidth: 800,
      minWidth: 600,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      },
    });
    win.loadURL(`file://${__dirname}/../../index.html#/payment/${encodeURIComponent(hostedPageURL)}`);

    win.on('closed', () => {
      onCloseWindow();
    });
  };

  @action _downgradeAccount = () => {
    console.log('downgrade to free', downgradeUserRequest);
    downgradeUserRequest.execute();
  }

  @action _hideOverlay = () => {
    this.hideOverlay = true;
  }
}

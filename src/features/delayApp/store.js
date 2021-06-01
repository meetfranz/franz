import {
  computed,
} from 'mobx';

import { FeatureStore } from '../utils/FeatureStore';
import { getPoweredByRequest } from './api';

export class DelayAppStore extends FeatureStore {
  @computed get poweredBy() {
    return getPoweredByRequest.execute().result || {};
  }
}

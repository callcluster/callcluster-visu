import { Store } from 'vuex'
import { StoredStateInterface } from './store-module/state'
import { OtherDataState } from './otherDataModule'
declare module 'vue-property-decorator' {
  interface Vue {
    $store: Store<{
      data:StoredStateInterface
      other:OtherDataState
    }>;
  }
}

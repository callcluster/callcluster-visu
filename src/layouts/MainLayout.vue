<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-splitter
        v-model="splitterModel"
        :limits="[0, 100]"
      >
        <template v-slot:before>
          <div class="q-pa-xs">
            <file-structure/>
          </div>
        </template>

        <template v-slot:after>
          <router-view />
        </template>
      </q-splitter>
      
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import FileStructure from 'components/FileStructure.vue'

import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { EssentialLink, FileStructure }
})
export default class MainLayout extends Vue {
  splitterModel = 20;
}
</script>

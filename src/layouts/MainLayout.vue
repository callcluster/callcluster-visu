<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-splitter
        v-model="splitterModel"
        :limits="[0, 100]"
        class="fullscreen"
      >
        <template v-slot:before>
          <div class="q-pa-xs">
            <file-structure v-on:change="changeSelected"/>
          </div>
        </template>

        <template v-slot:after>
          <!-- <router-view /> -->
          <simple-graph :community="community"/>
        </template>
      </q-splitter>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import FileStructure from 'components/FileStructure.vue'
import SimpleGraph from 'components/SimpleGraph.vue'

import { Vue, Component } from 'vue-property-decorator'
import { Community } from '../Types';

@Component({
  components: { EssentialLink, FileStructure, SimpleGraph }
})
export default class MainLayout extends Vue {
  splitterModel = 20;
  community: Community|null =null;
  changeSelected(community:Community){
    this.community = community;
    console.log(community.name)
  }
}
</script>

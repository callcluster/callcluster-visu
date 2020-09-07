<template> 

  <q-img :src="src">
    <div class="absolute-full">
      <p class="absoute-center">{{description}}</p>
    </div>
  </q-img>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Todo, Meta } from './models'

@Component
export default class SelectableImageComponent extends Vue {
  @Prop({ type: String, required: true }) readonly src!: string;
  @Prop({ type: String, required: true }) readonly description!: string;
  selected = true;
  active=false;
}
</script>

<style>

</style>
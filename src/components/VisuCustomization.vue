<template>
  <p>holis soy visucustomization</p>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'

@Component
export default class ClassComponent extends Vue {
  @Model('change', {type:Object}) readonly parameters!: object;
  @Prop({ type: String, required: true }) readonly chosenType!: string;


}
</script>

<style>

</style>
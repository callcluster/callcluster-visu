<template>
  <div class="q-gutter-sm">
    <q-tree
      :nodes="structure"
      node-key="label"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex';
type Function = {

}
type Community = {
  name:string,
  communities?:Array<Community>,
  functions?:Array<Function>
}
type TreeBranch = {
  label:string,
  children?:Array<TreeBranch>
}
@Component
export default class ClassComponent extends Vue {
  get minedCommunity():Community{
    return this.$store.state.data.minedCommunity as Community
  }
  get functions():Array<Function>{
    return this.$store.state.data.functions;
  }
  private generateBranchFromCommunity(community:Community):TreeBranch {
    return {
      label:community.name,
      children:(community.communities || []).map(this.generateBranchFromCommunity)
    }
  }

  get structure(){
    let ret = [
      {
        label:"Mined hierarchy",
        children:[this.generateBranchFromCommunity(this.minedCommunity)]
      }
    ]
    console.log(ret)
    return ret;


    
    return [
        {
          label: 'Satisfied customers (with avatar)',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: 'Good food (with icon)',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service (disabled node with icon)',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings (with icon)',
              icon: 'photo',
              children: [
                {
                  label: 'Happy atmosphere (with image)',
                  img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
                },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ];
  }
}
</script>

<style>

</style>
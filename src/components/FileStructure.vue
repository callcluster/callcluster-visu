<template>
  <div class="q-pa-sm q-gutter-sm">
     <q-input ref="filter" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>
    <q-tree
      :nodes = "structure"
      node-key = "id"
      :filter = "filter"
      :selected.sync="selected"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex';
import { StringDictionary } from 'quasar';
import { Community, FunctionDefinition } from "../Types";

type TreeBranch = {
  label:string,
  children?:Array<TreeBranch>,
  id:number,
  labelid:string
}
class CommunityMapper{
  getCommunity(id: number): Community {
    return this.communitiesWithId[id];
  }
  private communitiesWithId:{ [id: number] : Community; } ={};
  constructor(private nextId:number){ }
  public mapCommunity(community:Community):TreeBranch {
    let myId = this.nextId;
    this.nextId += 1;
    this.communitiesWithId[myId] = community;
    let ret:TreeBranch = {
      label: community.name,
      id: myId,
      labelid: community.name + myId,
      children: (community.communities || []).map((c) => this.mapCommunity(c))
    };
    return ret;
  }
}

@Component
export default class ClassComponent extends Vue {
  private communityMapper:CommunityMapper=new CommunityMapper(1);
  public selected = null;
  public filter:string = '';
  selectedCommunity:Community | null = null;

  resetFilter () {
    this.filter = '';
    let filter = this.$refs["filter"];
    if((filter as any).focus){
      (filter as any).focus();
    }
  }
  get minedCommunity():Community | null{
    return this.$store.state.data.minedCommunity as (Community | null)
  }
  get functions():Array<FunctionDefinition>{
    return this.$store.state.data.functions;
  }
  get structure(){
    this.communityMapper = new CommunityMapper(1);
    if(this.minedCommunity != null){
      return [{
        label:"Mined hierarchy",
        id:0,
        children:[this.communityMapper.mapCommunity(this.minedCommunity)]
      }];
    }else{
      return [];
    }
  }
  @Watch("selected")
  changeSelected(newSelected?:number,oldSelected?:number){
    if(newSelected){
      this.$emit(
        'change', 
        this.communityMapper.getCommunity(newSelected)
      );
    }else{
      this.$emit('change', null);
    }
  }
}
</script>

<style>

</style>
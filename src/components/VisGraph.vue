<template>
  <div ref="visualization" class="fit"></div>
</template>

<script lang="ts">
import Electron, { remote } from "electron";
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Network, Options, Data } from "vis-network";
import { VisData } from 'vis-network/declarations/network/gephiParser';
type VisGraphNode = { id:number, label:string, parent:number };
type VisGraphEdge = { from:number, to:number, arrows?:string };
type VisGraphData = { nodes:Array<VisGraphNode>, edges:Array<VisGraphEdge> }

import { Edge, Node } from 'vis-network';
import { DataInterface } from 'vis-data'

interface MutableNetwork {
  body:{
    data:{
      nodes:DataInterface<Node>,
      edges:DataInterface<Edge>,
    }
  }
}

let networks:Map<symbol,Network|null>=new Map<symbol,Network|null>();

interface OpenedCommunitiesData {
  openedCommunities?:Array<number>
}

function findAddedParent(newOpenedCommunities:number[],previousOpenedCommunities:number[]):number|undefined{
  return newOpenedCommunities.find((oc)=>!previousOpenedCommunities.includes(oc))
}

class MenuOwner{
  private currentNode:string|null = null
  private currentEmitter:Vue|null = null
  menu: Electron.Menu;
  constructor(){
    this.menu = new remote.Menu()
    this.menu.append(new remote.MenuItem({
      label:"Explode (Ctrl + Right click)",
      click:()=>this.emit("explode")
    }))
    this.menu.append(new remote.MenuItem({
      label:"Open (double click)",
      click:()=>this.emit("open")
    }))
    this.menu.append(new remote.MenuItem({
      label:"Extract",
      click:()=>{
        if(this.currentEmitter==null) return
        if(this.currentNode?.includes("f")) return
        this.currentEmitter.$store.dispatch(
          'other/getDetailsForExtraction', 
          this.currentNode
        )
      }
    }))
    this.menu.append(new remote.MenuItem({
      label:"List contents",
      click:()=>this.emit("list")
    }))
  }
  private emit(type:string){
    if(this.currentEmitter==null){
      return;
    }
    if(this.currentNode==null){
      return;
    }
    if(this.currentNode?.includes("f")){
      return
    }
    this.currentEmitter.$emit(type,this.currentNode)
    this.currentEmitter = null
    this.currentNode = null
  }
  popup(currentNode:string,currentEmitter:Vue){
    this.currentNode = currentNode
    this.currentEmitter = currentEmitter
    this.menu.popup({window:remote.getCurrentWindow()})
  }
}

const menuOwner = new MenuOwner()


class SmallMenuOwner{
  private currentNode:string|null = null
  private currentEmitter:Vue|null = null
  menu: Electron.Menu;
  constructor(){
    this.menu = new remote.Menu()
    this.menu.append(new remote.MenuItem({
      label:"Extract",
      click:()=>{
        if(this.currentEmitter==null) return
        this.currentEmitter.$store.dispatch(
          'other/getDetailsForExtraction', 
          this.currentNode
        )
      }
    }))
    this.menu.append(new remote.MenuItem({
      label:"List contents",
      click:()=>this.emit("list")
    }))
  }
  private emit(type:string){
    if(this.currentEmitter==null){
      return;
    }
    if(this.currentNode==null){
      return;
    }
    this.currentEmitter.$emit(type,this.currentNode)
    this.currentEmitter = null
    this.currentNode = null
  }
  popup(currentNode:string,currentEmitter:Vue){
    this.currentNode = currentNode
    this.currentEmitter = currentEmitter
    this.menu.popup({window:remote.getCurrentWindow()})
  }
}

const smallMenuOwner = new SmallMenuOwner()

@Component
export default class VisGraph extends Vue {
  @Prop({ type: Object, required: true }) readonly visData!:VisGraphData ;
  @Prop({ type: String, required: true }) readonly currentNode!:string ;
  @Prop({ type: Object, required: false, default:()=>({}) }) readonly options!:Options ;
  readonly networkKey:symbol = Symbol();
  created(){
    networks.set(this.networkKey,null)
  }

  clickedNode (obj:any):string|null{
    if(obj?.nodes.length==0){
      return null
    }else{
      return obj?.nodes?.[0]
    }
  }

  emitClickEvent(evName:string, obj:any){
    const clicked = this.clickedNode(obj)
    if(clicked){
      this.$emit(evName, clicked)
    }
  }

  getNetwork():Network|null{
    return networks.get(this.networkKey)
  }

  mounted(){
    let visuRef = this.$refs["visualization"];
    if(visuRef instanceof HTMLElement){
      let nw = new Network(visuRef,this.visData,this.options)
      networks.set(this.networkKey,nw)
      nw.on('click',(e)=>{
        if (e.event.srcEvent.ctrlKey) {
          this.emitClickEvent('explode',e)
        }
      })
      nw.on('selectNode',(e)=>{
        if (!e.event.srcEvent.ctrlKey) {
          this.emitClickEvent('select',e)
        }
      })
      nw.on('doubleClick',(e)=>{
        this.emitClickEvent('open',e)
      })
      nw.on('oncontext',(e)=>{
        const node = (nw.getNodeAt(e.pointer.DOM) as string|undefined) ?? null
        if(node != null){
          if(!node.includes("f")){//not a function
            menuOwner.popup(node,this)
          }
        }else{
          smallMenuOwner.popup(this.currentNode,this)
        }
      })
    }else{
      throw new Error("No visualization div inside VisGraph.")
    }
  }
  get network(){
    return networks.get(this.networkKey) as any
  }
  resetGraphData(data:VisGraphData){
    this.getNetwork()?.setData(Object.assign({},data))
  }
  @Watch("visData")
  nodesChanged(newVal:VisGraphData & OpenedCommunitiesData, oldVal:VisGraphData & OpenedCommunitiesData){
    let addedParent = findAddedParent(newVal.openedCommunities??[],oldVal.openedCommunities??[])
    if (addedParent!==undefined) {
      const explodedVisNode = this.network?.body.nodes[addedParent]
      const newNodes = newVal.nodes.filter(n=>n.parent == addedParent)
      this.network?.body.data.nodes.remove([addedParent])
      this.network?.body.data.nodes.add(newNodes.map(n =>({
        ...n,
        x:explodedVisNode.x,
        y:explodedVisNode.y
      })))

      this.network?.body.data.edges.add(
        newVal.edges
        .filter(({from,to})=>{
          return newNodes.map(n=>n.id).includes(from) || newNodes.map(n=>n.id).includes(to)
        })
      )
    }else{
      this.resetGraphData(newVal)
    }
  }
  beforeDestroy(){
    this.getNetwork()?.destroy();
  }
}
</script>

<style>

</style>
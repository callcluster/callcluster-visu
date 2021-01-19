import { NetworkEvents, Network } from "vis-network";
export type NetworkLike=Network
export class LayoutCoordinator{
  private networks:NetworkLike[]
  private master:NetworkLike
  private cameraEvents:NetworkEvents[]=[
    "dragStart",
    "dragging",
    "dragEnd",
    "zoom"
  ]
  private humanEvents:NetworkEvents[]=[
    ...this.cameraEvents,
    "click",
  ]
  private physicsEvents:NetworkEvents[]=[
    "stabilized",
  ]

  startSimulation(target:NetworkLike){
    target.startSimulation()
  }

  stopSimulation(target:NetworkLike|undefined){
    if(target===undefined) return
    target.stopSimulation()
  }

  makeMaster(source:NetworkLike,params:any){
    this.master = source
    this.startSimulation(this.master)
    this.slaveNetworks.forEach(slave => this.stopSimulation.bind(this))
  }

  injectCameraPosition(source:NetworkLike,params:any){
    this.slaveNetworks.forEach(slave => this.injectCameraPositionToSlave(source,slave))
  }

  injectCameraPositionToSlave(source:NetworkLike,target:NetworkLike){
    target.moveTo({
      position:source.getViewPosition(),
      scale:source.getScale()
    })
  }

  constructor(networks:(NetworkLike|undefined)[]){
    this.networks = (networks.filter(n=>n!==undefined) as NetworkLike[])
    this.master = this.networks[0];
    
    this.hookEvents(this.humanEvents, this.makeMaster.bind(this))

    this.hookEvents([
      ...this.humanEvents,
      ...this.physicsEvents
    ], this.injectPositions.bind(this))

    this.hookEvents(this.cameraEvents,this.injectCameraPosition.bind(this))
  }

  get slaveNetworks(){
    return this.networks.filter((nw)=>nw!==this.master)
  }


  injectPositionsToSlave(source:NetworkLike,target:NetworkLike){
    let positions:ReturnType<typeof source.getPositions>={}
    try{
      positions=source.getPositions()
    }catch(e){
      console.error(e)
    }
    Object.entries(positions).forEach(([id,coords]) => {
      target.moveNode(id,coords.x,coords.y)
    });
    this.stopSimulation(target)
  }

  injectPositions(source:NetworkLike,params:any){
    if(source!==this.master){
      return
    }else{
      this.slaveNetworks.forEach((slave)=>this.injectPositionsToSlave(source,slave))
    }
  }

  hookEvents(events:NetworkEvents[],callback:(source:NetworkLike,params?:any)=>void){
    events.forEach(event=>this.hookEvent(event,callback))
  }

  hookEvent(event:NetworkEvents,callback:(source:NetworkLike,params?:any)=>void){
    this.networks.forEach((network)=>{
      network.on(event,(ev)=>callback(network,ev))
    })
  }

  destroy(){
    [...this.humanEvents,...this.physicsEvents].forEach(eventName => {
      this.networks.forEach((network)=>{
        network.off(eventName)
      })
    })
  }
}
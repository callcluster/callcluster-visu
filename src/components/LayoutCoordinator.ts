import { Network, NetworkEvents } from "vis-network";
import { Z_NO_COMPRESSION } from "zlib";
export class LayoutCoordinator{
  private networks:Network[]
  private master:Network
  private humanEvents:NetworkEvents[]=[
    "dragStart",
    "dragging",
    "dragEnd",
    "click",
    "zoom"
  ]
  private physicsEvents:NetworkEvents[]=[
    "startStabilizing",
    "stabilizationProgress",
    "stabilizationIterationsDone",
    "stabilized",
  ]

  startSimulation(target:Network){
    target.startSimulation()
  }

  stopSimulation(target:Network){
    target.stopSimulation()
  }

  makeMaster(source:Network,params:any){
    console.log("the master is",source)
    this.master = source
    this.startSimulation(this.master)
    this.slaveNetworks.forEach(slave => this.stopSimulation.bind(this))
  }

  constructor(networks:Network[]){
    this.networks = networks
    this.master = networks[0];
    
    this.hookEvents(this.humanEvents, this.makeMaster.bind(this))

    this.hookEvents([
      ...this.humanEvents,
      ...this.physicsEvents
    ], this.injectPositions.bind(this))
  }

  get slaveNetworks(){
    return this.networks.filter((nw)=>nw!==this.master)
  }

  injectPositionsToSlave(source:Network,target:Network){
    Object.entries(source.getPositions()).forEach(([id,coords]) => {
      target.moveNode(id,coords.x,coords.y)
    });
  }

  injectPositions(source:Network,params:any){
    if(source!==this.master){
      return
    }else{
      this.slaveNetworks.forEach((slave)=>this.injectPositionsToSlave(source,slave))
    }
  }

  hookEvents(events:NetworkEvents[],callback:(source:Network,params?:any)=>void){
    events.forEach(event=>this.hookEvent(event,callback))
  }

  hookEvent(event:NetworkEvents,callback:(source:Network,params?:any)=>void){
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
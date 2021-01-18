import { Network, NetworkEvents } from "vis-network";
export class LayoutCoordinator{
  private networks:Network[]
  private master:Network

  startSimulation(target:Network){
    target.setOptions({physics: {enabled:true}});
  }

  stopSimulation(target:Network){
    target.setOptions({physics: {enabled:false}});
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
    const humanEvents:NetworkEvents[]=[
      "dragStart",
      "dragging",
      "dragEnd",
      "click",
      "zoom"
    ]
    
    this.hookEvents(humanEvents, this.makeMaster.bind(this))

    this.hookEvents([
      ...humanEvents,
      "startStabilizing",
      "stabilizationProgress",
      "stabilizationIterationsDone",
      "stabilized",
    ], this.injectPositions.bind(this))

    /*
    console.log("COORDINATED NETWORKS:")
    console.log(networks)
    function injectPositionsForOne(from:Network,to:Network){
      Object.entries(from.getPositions()).forEach(([id,coords]) => {
        to.moveNode(id,coords.x,coords.y)
      });
    }
    function injectPositions(source:Network){
      networks
      .filter((nw)=>nw!==source)
      .forEach((network)=>{
        injectPositionsForOne(source,network)
      })
    }
    networks.forEach((network)=>{
      network.on('stabilized',()=>injectPositions(network))
    })
    */
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

  }
}
const otherDataModule = {
  namespaced: true,
  mutations:{
    setCreate(state:any,createdType:string) {
      if(createdType=='visualization'){
        state.viewCreateVisualization=true
      }
    },
    setCreateVisualization(state:any,value:boolean){
      state.viewCreateVisualization=value
    },
    setAvailableMetrics(state:any,value:Array<string>){
      state.availableMetrics=value;
    },
    setVisualization(state:any,visualization:any){
      state.visualization=visualization
    }
  },
  state:{
    viewCreateVisualization:false,
    availableMetrics:[],
    visualization:{}
  }
}

export default otherDataModule

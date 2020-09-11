const otherDataModule = {
  namespaced: true,
  mutations:{
    setCreate(state:any,createdType:string) {
      if(createdType=='visualization'){
        console.log("CREATEEEEEEE",state.viewCreateVisualization)
        state.viewCreateVisualization=true
      }
    },
    setCreateVisualization(state:any,value:boolean){
      state.viewCreateVisualization=value
    },
    setAvailableMetrics(state:any,value:Array<string>){
      state.availableMetrics=value;
    }
  },
  state:{
    viewCreateVisualization:false,
    availableMetrics:[]
  }
}

export default otherDataModule

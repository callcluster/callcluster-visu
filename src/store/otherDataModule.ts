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
    }
  },
  state:{
    viewCreateVisualization:false
  }
}

export default otherDataModule

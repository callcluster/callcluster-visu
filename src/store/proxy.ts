import { Store } from 'vuex'
import { ipcRenderer } from "electron"


function register(store:Store<any>){
  console.log("registered!!!")
  ipcRenderer.send("alive", "message meaning that I can listen to messages");
  ipcRenderer.on('data', function(ev,data){
    store.commit('data/setData', JSON.parse(data))
  })
  ipcRenderer.on("create",(e,createdType)=>{
    store.commit('other/setCreate', createdType)
  })
  ipcRenderer.on("availableMetrics",(e,availableMetrics)=>{
    store.commit('other/setAvailableMetrics', availableMetrics)
  })
  ipcRenderer.on("setVisualization",(e,visualization)=>{
    store.commit('other/setVisualization',visualization)
  })
}


export {register}
import { Store } from 'vuex'
import { ipcRenderer } from "electron"


function register(store:Store<any>){
  console.log("registered!!!")
  ipcRenderer.send("alive","message meaning that I can listen to messages");
  ipcRenderer.on('data',function(ev,data){
    store.commit('fullDataModule/setData', JSON.parse(data))
  })
}


export {register}
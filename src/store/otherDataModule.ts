import { ipcRenderer } from "electron"

export type OtherDataState = {
  viewCreateClustering:boolean,
  viewCreateVisualization:boolean,
  availableMetrics:Array<string>,
  visualization:Record<string, string>,
  shownDetails:Record<string, string>|null,
  deletableVisualization:number | null,
  extractionDialogVisualization:string | null,
  extractionDetails:Record<string, string>|null,
  deletableCommunity:number|null,
}
const defaultState:OtherDataState = {
  viewCreateClustering:false,
  viewCreateVisualization: false,
  availableMetrics: [],
  visualization: {},
  shownDetails: null,
  deletableVisualization: null,
  extractionDialogVisualization: null,
  extractionDetails:null,
  deletableCommunity:null
}
const otherDataModule = {
  namespaced: true,
  mutations: {
    setCreate (state:OtherDataState, createdType:string) {
      if (createdType === 'visualization') {
        state.viewCreateVisualization = true
      }
      if (createdType === 'clustering') {
        state.viewCreateClustering = true
      }
    },
    setCreateVisualization (state:OtherDataState, value:boolean) {
      state.viewCreateVisualization = value
    },
    setCreateClustering (state:OtherDataState, value:boolean) {
      state.viewCreateClustering = value
    },
    setAvailableMetrics (state:OtherDataState, value:Array<string>) {
      state.availableMetrics = value
    },
    setVisualization (state:OtherDataState, visualization:Record<string, string>) {
      state.visualization = visualization
    },
    setDetails (state:OtherDataState, details:Record<string, string>) {
      state.shownDetails = details
    },
    setDetailsForExtraction(state:OtherDataState, details:Record<string, string>) {
      state.extractionDetails = details;
    },
    setDeletableVisualization (state:OtherDataState, id:number|null) {
      state.deletableVisualization = id
    },
    setDeletableCommunity (state:OtherDataState, id:number|null) {
      state.deletableCommunity = id;
    },
    setExtractionDialogVisualization (state:OtherDataState, id:string|null) {
      state.extractionDialogVisualization = id
    }
  },
  state: defaultState,
  actions:{
    getDetailsForExtraction(_:any, id:string) {
      _.commit("setExtractionDialogVisualization",id)
      ipcRenderer.send("getDetailsForExtraction", { id })
    }
  }
}

export default otherDataModule

export type OtherDataState = {
  viewCreateVisualization:boolean,
  availableMetrics:Array<string>,
  visualization:Record<string, string>,
  shownDetails:Record<string, string>|null,
}
const defaultState:OtherDataState = {
  viewCreateVisualization: false,
  availableMetrics: [],
  visualization: {},
  shownDetails: null
}
const otherDataModule = {
  namespaced: true,
  mutations: {
    setCreate (state:OtherDataState, createdType:string) {
      if (createdType === 'visualization') {
        state.viewCreateVisualization = true
      }
    },
    setCreateVisualization (state:OtherDataState, value:boolean) {
      state.viewCreateVisualization = value
    },
    setAvailableMetrics (state:OtherDataState, value:Array<string>) {
      state.availableMetrics = value
    },
    setVisualization (state:OtherDataState, visualization:Record<string, string>) {
      state.visualization = visualization
    },
    setDetails (state:OtherDataState, details:Record<string, string>) {
      state.shownDetails = details
    }
  },
  state: defaultState
}

export default otherDataModule

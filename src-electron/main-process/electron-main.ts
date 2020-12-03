import { app, BrowserWindow, nativeTheme, Menu, MenuItem, dialog, ipcMain } from 'electron'
import fs from 'fs'
import { setAnalysisJson, getAvailableMetrics, makeVisualization, getInfoFor } from './callcluster-visu-logic'
try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow:BrowserWindow|null = null;

async function loadAnalysisJson(path:string){
  if(mainWindow==null) return;

  let buffer = await fs.promises.readFile(path,'utf-8');
  if(buffer instanceof Buffer){
    buffer = buffer.toString()
  }
  let analysisJson=JSON.parse(buffer);
  setAnalysisJson(analysisJson)
  mainWindow.webContents.send('createCommunity',{
    id:0,
    name:"Mined community"
  });
  mainWindow.webContents.send('availableMetrics',getAvailableMetrics())
}

ipcMain.on("setFilePath",async (event,path)=>{
  loadAnalysisJson(path)
})

ipcMain.on("showVisualization", (event,visualization)=>{
  if(mainWindow==null) return;
  mainWindow.webContents.send('setVisualization',makeVisualization(visualization))
})
ipcMain.on("selectObject", (event,data) => {
  if(mainWindow==null) return;
  mainWindow.webContents.send('setDetails',getInfoFor(data))
})

ipcMain.on("getDetailsForExtraction", (event,data) => {
  if(mainWindow==null) return;
  mainWindow.webContents.send('setDetailsForExtraction',getInfoFor(data))
})






function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: Boolean(process.env.QUASAR_NODE_INTEGRATION),
      nodeIntegrationInWorker: Boolean(process.env.QUASAR_NODE_INTEGRATION),

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  
  mainWindow.webContents.on('did-finish-load', () => {
    if(mainWindow==null) return;
    mainWindow.webContents.send('test','This is a test');
  })

  if(process.env.APP_URL) mainWindow.loadURL(process.env.APP_URL)
  
  /**
   * Initial menu options
   */
  const menu = Menu.buildFromTemplate([
    new MenuItem({
      label:"File",
      submenu:[
        {
          label:"Import analysis.json",
          click:async ()=>{
            let result = await dialog.showOpenDialog({ 
              properties: ['openFile'],
              filters: [
                { name: 'analysis.json file', extensions: ['json'] },
              ]
            })
            if(result.filePaths.length>=1){
              loadAnalysisJson(result.filePaths[0])
            }
          },
          accelerator:'CommandOrControl+I'
        }
      ]
    }),
    new MenuItem({
      label:"Create",
      submenu:[
        {
          label:"Visualization",
          click:async () => {
            if(mainWindow==null) return;
            mainWindow.webContents.send('create','visualization')
          },
          accelerator:'CommandOrControl+D'
        }
      ]
    })

  ])
  Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

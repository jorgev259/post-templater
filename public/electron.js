const { ipcMain, app, BrowserWindow } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')
const Store = require('electron-store')

const store = new Store({
  defaults: {
    page: '',
    templates: {}
  }
})

let mainWindow

ipcMain.handle('getStore', (event, key) => {
  return store.get(key)
})
ipcMain.handle('setStore', (event, key, value) => {
  return store.set(key, value)
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 420,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.removeMenu()
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools()
  }
  mainWindow.on('closed', () => (mainWindow = null))
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

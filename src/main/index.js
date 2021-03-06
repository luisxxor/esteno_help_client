'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import os from 'os'
import io from 'socket.io-client'
import fs from 'fs'
import getRole from '../helpers'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let auth = false

// If config.json exists read it and assign to variable config, if not, assign default values
let config = fs.existsSync('config.json')
  ? JSON.parse(fs.readFileSync('config.json'))
  : { role: getRole(), machineName: os.hostname(), api: {host: 'ts.esteno.cl', port: '8080', extra: 'client'} }

// Also, if not exists, create it with default values
if (!fs.existsSync('config.json')) {
  fs.writeFileSync('config.json', JSON.stringify(config))
}

// Connect to esteno_help_server_api
const socket = io.connect(`http://${config.api.host}:${config.api.port}/${config.api.extra}`)

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 300,
    height: 150,
    frame: true,
    transparent: false,
    show: false,
    useContentSize: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null)
  mainWindow.setResizable(true)
  mainWindow.setMinimumSize(300, 150)
  mainWindow.setMaximumSize(600, 300)

  mainWindow.on('close', (e) => {
    if (auth === false) e.preventDefault()
    if (mainWindow) mainWindow.webContents.send('needAuth')
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('readyReply', JSON.stringify(config))
  })

  ipcMain.on('toggleCall', (event, arg) => {
    socket.emit('toggleCall', arg)
  })

  ipcMain.on('sendConfig', (event, arg) => {
    let newConfig = JSON.parse(arg)
    newConfig['api'] = config['api']
    console.log(newConfig)
    fs.writeFileSync('config.json', JSON.stringify(newConfig))
    event.sender.send('changeConfig', JSON.stringify(newConfig))
  })

  socket.on('callStatusChanged', data => {
    mainWindow.webContents.send('callStatusChanged', JSON.parse(data))
  })
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', createWindow)

ipcMain.on('sendAuth', (event, arg) => {
  let password = JSON.parse(arg)
  if (password === 'h680') {
    auth = true
    mainWindow = null
    if (process.platform !== 'darwin') {
      app.quit()
    }
  } else {
    event.sender.send('authFailed')
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

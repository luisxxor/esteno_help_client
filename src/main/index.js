'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import os from 'os'
import io from 'socket.io-client'
import fs from 'fs'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow

// If config.json exists read it and assign to variable config, if not, assign default values
let config = fs.existsSync('config.json')
  ? JSON.parse(fs.readFileSync('config.json'))
  : { role: getRole(), machineName: os.hostname(), api: {host: 'localhost', port: '8000', extra: 'client'} }

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
    width: 400,
    height: 300,
    frame: true,
    transparent: false,
    show: false,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('readyReply', JSON.stringify(config))
  })

  ipcMain.on('call_support', (event, arg) => {
    event.sender.send('iscallingsupport', 'yes')
    socket.emit(
      'toggleCall',
      JSON.stringify({
        calling: true,
        role: config.role,
        machineName: config.machineName
      })
    )
  })

  ipcMain.on('clear_call', (event, arg) => {
    event.sender.send('iscallingsupport', 'no')
    socket.emit(
      'toggleCall',
      JSON.stringify({
        calling: false,
        role: config.role,
        machineName: config.machineName
      })
    )
  })

  ipcMain.on('sendAuth', (event, arg) => {
    socket.emit('sendAuth', arg)
  })

  ipcMain.on('sendConfig', (event, arg) => {
    let { machineName } = JSON.parse(arg)
    let role = getRole(machineName)
    config = { machineName: machineName, role: role }
    fs.writeFileSync('config.json', JSON.stringify(config))
    event.sender.send('changeConfig', JSON.stringify(config))
  })

  ipcMain.on('askForConfig', (event, arg) => {
    event.sender.send('responseConfig', JSON.stringify(config))
  })

  socket.on('responseAuth', data => {
    mainWindow.webContents.send('responseAuth', data)
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

function getRole (machineName = os.hostname()) {
  let digitador = /^(pcd[0-9]*)$/i
  let estenotipista = /^(pce[0-9]+)$/i
  let traduccion = /^(pctrad[0-9]+)$/i
  let cabina = /^(pccab[0-9]+)$/i
  let role = ''

  if (digitador.test(machineName)) {
    role = 'Digitador'
  } else if (estenotipista.test(machineName)) {
    role = 'Estenotipista'
  } else if (traduccion.test(machineName)) {
    role = 'Traducción'
  } else if (cabina.test(machineName)) {
    role = 'Cabina'
  }

  return role
}

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

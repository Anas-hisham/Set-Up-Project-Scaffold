import { BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { PATHS, URLS } from './constants/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow

export function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '..', PATHS.ICON),
        webPreferences: {
            preload: path.join(__dirname, PATHS.PRELOAD),
            nodeIntegration: false,
        },
    })

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(URLS.DEV);
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '..', '..', PATHS.DIST_HTML));
    }

    return mainWindow
}

export function getMainWindow() {
    return mainWindow
}

import { BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { STATIC_PATHS, URLS } from '../constants/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow

export function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 650,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '..', '..', STATIC_PATHS.ICON),
        webPreferences: {
            preload: path.join(__dirname, '..', STATIC_PATHS.PRELOAD),
            nodeIntegration: false,
        },
    })

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(URLS.DEV);
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '..', '..', '..', STATIC_PATHS.DIST_HTML));
    }

    return mainWindow
}


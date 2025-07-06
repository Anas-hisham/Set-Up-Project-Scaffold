import path from 'path';
import { app } from 'electron';

const DEFAULT_SAVE_PATH = app.getPath('userData');

export const PATHS = {
    ICON: path.join('renderer/assets/icons/icon.ico'),
    PRELOAD: path.join('preload/preload.js'),
    DIST_HTML: path.join('dist/index.html'),
    LOG_FILE_NAME: 'errors.log',
    DEFAULT_SAVE_PATH,
};

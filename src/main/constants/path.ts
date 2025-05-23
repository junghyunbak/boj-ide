import { app } from 'electron';

import path from 'path';

import { BAKEJOONHUB_EXTENSION_IDENTIFIER } from './extension';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const BAKEJOONHUB_EXTENSION_PATH = path.join(RESOURCES_PATH, 'extensions', BAKEJOONHUB_EXTENSION_IDENTIFIER);

export const PRELOAD_PATH = path.join(__dirname, 'preload.js');

export const USER_DATA_PATH = app.getPath('userData');

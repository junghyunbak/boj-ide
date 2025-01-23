import { app } from 'electron';

import path from 'path';

import { BAKEJOONHUB_EXTENSION_IDENTIFIER } from './extension';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

export const BAKEJOONHUB_EXTENSION_PATH = app.isPackaged
  ? path.join(__dirname)
  : path.join(__dirname, `../../src/main/extensions/${BAKEJOONHUB_EXTENSION_IDENTIFIER}`);

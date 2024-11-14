import { BrowserWindow, WebContentsView, app } from 'electron';

import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import * as cheerio from 'cheerio';

import { Text } from 'domhandler';

import fs from 'fs';
import path from 'path';

import { ipc } from '../types/ipc';

import { Judge } from './judge';

import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE } from '../constants';

export default class BojView {
  private view: WebContentsView;

  private mainWindow: BrowserWindow;

  private puppeteerBroswer: import('puppeteer-core').Browser;

  private problemNumber = '';

  private inputs: string[] = [];

  private outputs: string[] = [];

  private judge: Judge;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    this.view = new WebContentsView();

    this.judge = new Judge(mainWindow);
  }

  async build() {
    this.view.webContents.loadURL('https://www.acmicpc.net/problem/1000');

    this.attachView();

    this.attachEvent();

    this.puppeteerBroswer = await pie.connect(app, puppeteer);
  }

  attachView() {
    this.mainWindow.contentView.addChildView(this.view);
  }

  attachEvent() {
    this.view.webContents.on('did-navigate', async (e, url) => {
      const BOJ_DOMAIN = 'www.acmicpc.net';

      if (!(url.startsWith(`https://${BOJ_DOMAIN}`) || url.startsWith(`https://help.acmicpc.net`))) {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}`);

        return;
      }

      if (url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        const result = new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url);

        if (!result) {
          return;
        }

        /**
         * BroswerView(deprecated) -> WebContentsView
         *
         * electron-in-puppeteer 에서 업데이트 되지 않음.
         */
        // @ts-ignore
        const page = await pie.getPage(this.puppeteerBroswer, this.view);

        const content = await page.content();

        const $ = cheerio.load(content);

        const inputs = Array.from($('[id|="sample-input"]'))
          .map((v) => {
            const [child] = v.children;

            if (!(child instanceof Text)) {
              return null;
            }

            return child.data;
          })
          .filter((v) => v !== null);

        const outputs = Array.from($('[id|="sample-output"]'))
          .map((v) => {
            const [child] = v.children;

            if (!(child instanceof Text)) {
              return null;
            }

            return child.data;
          })
          .filter((v) => v !== null);

        const problemNumber = result[1];

        this.problemNumber = problemNumber;
        this.inputs = inputs;
        this.outputs = outputs;

        ipc.send(this.mainWindow.webContents, 'load-problem-data', {
          data: {
            number: problemNumber,
            testCase: {
              inputs,
              outputs,
            },
          },
        });

        return;
      }

      ipc.send(this.mainWindow.webContents, 'load-problem-data', { data: null });
    });

    ipc.on('go-back-boj-view', () => {
      this.view.webContents.goBack();
    });

    ipc.on('go-front-boj-view', () => {
      this.view.webContents.goForward();
    });

    ipc.on('change-boj-view-width', (e, { data: { x, y, width, height } }) => {
      this.view.setBounds({
        x,
        y: y + 1,
        width: width - 1,
        height: height - 1,
      });
    });

    // [ ]: 파일 생성, 채점 과정 모두에서 에러가 발생했을 때 처리 필요
    ipc.on('judge-start', async (e, { data: { code, ext } }) => {
      await this.judge.execute({
        problemNumber: this.problemNumber,
        code,
        ext,
        inputs: this.inputs,
        outputs: this.outputs,
      });
    });

    // [ ]: 공통 에러처리 핸들러로 전송
    ipc.on('save-code', (e, { data: { number, ext, code } }) => {
      const basePath = app.getPath('userData');

      const filePath = path.join(basePath, `${number}.${ext}`);

      let isSaved;

      try {
        fs.writeFileSync(filePath, code, {
          encoding: 'utf-8',
        });

        isSaved = true;
      } catch (_) {
        isSaved = false;
      }

      ipc.send(this.mainWindow.webContents, 'save-code-result', { data: { isSaved } });
    });

    ipc.on('load-code', (e, { data: { number, ext } }) => {
      const basePath = app.getPath('userData');

      const filePath = path.join(basePath, `${number}.${ext}`);

      if (!fs.existsSync(filePath)) {
        const DEFAULT_CODE_TEMPLATE = (() => {
          switch (ext) {
            case 'cpp':
              return CPP_INPUT_TEMPLATE;
            case 'js':
              return JS_INPUT_TEMPLATE;
            default:
              return '';
          }
        })();

        ipc.send(this.mainWindow.webContents, 'load-code-result', {
          data: { code: DEFAULT_CODE_TEMPLATE },
        });

        return;
      }

      const code = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });

      ipc.send(this.mainWindow.webContents, 'load-code-result', { data: { code } });
    });
  }

  get bojView() {
    return this.view;
  }
}

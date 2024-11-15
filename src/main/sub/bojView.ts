import { BrowserWindow, WebContentsView } from 'electron';

import { type Browser } from 'puppeteer-core';

import pie from 'puppeteer-in-electron';

import * as cheerio from 'cheerio';

import { Text } from 'domhandler';

import { ipc } from '../../types/ipc';

import { BOJ_DOMAIN } from '../../constants';

export class BojView {
  private view: WebContentsView;

  private mainWindow: BrowserWindow;

  private puppeteerBroswer: Browser;

  constructor(mainWindow: BrowserWindow, puppeteerBrowser: Browser) {
    this.mainWindow = mainWindow;

    this.view = new WebContentsView();
    this.view.webContents.loadURL('https://www.acmicpc.net/problem/1000');

    this.mainWindow.contentView.addChildView(this.view);

    this.puppeteerBroswer = puppeteerBrowser;
  }

  build() {
    this.view.webContents.on('did-navigate', async (e, url) => {
      if (!(url.startsWith(`https://${BOJ_DOMAIN}`) || url.startsWith(`https://help.acmicpc.net`))) {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}`);

        ipc.send(this.mainWindow.webContents, 'load-problem-data', { data: null });

        return;
      }

      if (!url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        ipc.send(this.mainWindow.webContents, 'load-problem-data', { data: null });

        return;
      }

      const [_, number] = new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url) || [];

      if (!number) {
        ipc.send(this.mainWindow.webContents, 'load-problem-data', { data: null });

        return;
      }

      /**
       * [pie 라이브러리 유지보수 이슈]
       *
       * BroswerView가 deprecated 되어 WebContentsView 타입으로 사용됨.
       */
      // @ts-expect-error
      const page = await pie.getPage(this.puppeteerBroswer, this.view);

      const content = await page.content();

      const $ = cheerio.load(content);

      const name = $('#problem_title').html() || '';

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

      ipc.send(this.mainWindow.webContents, 'load-problem-data', {
        data: {
          name,
          number,
          testCase: {
            inputs,
            outputs,
          },
        },
      });
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

    ipc.on('go-problem', (e, { data: { number } }) => {
      const distUrl = `https://${BOJ_DOMAIN}/problem/${number}`;

      if (this.view.webContents.getURL() === distUrl) {
        return;
      }

      this.view.webContents.loadURL(distUrl);
    });
  }
}
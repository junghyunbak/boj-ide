import { app, BrowserWindow, WebContentsView } from 'electron';
import { type Browser } from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { Text } from 'domhandler';
import { ipc } from '@/types/ipc';
import { BOJ_DOMAIN, BOJ_HELP_DOMAIN, SOLVED_AC_DOMAIN } from '@/constants';

const whiteListUrl = [`https://${BOJ_DOMAIN}`, `https://${BOJ_HELP_DOMAIN}`, `https://${SOLVED_AC_DOMAIN}`];

export class BojView {
  private view: WebContentsView;

  private mainWindow: BrowserWindow;

  private puppeteerBroswer: Browser;

  private hisotryUrlFilePath: string;

  constructor(mainWindow: BrowserWindow, puppeteerBrowser: Browser) {
    this.mainWindow = mainWindow;

    const basePath = app.getPath('userData');

    this.hisotryUrlFilePath = path.join(basePath, 'last-url');

    if (!fs.existsSync(this.hisotryUrlFilePath)) {
      fs.writeFileSync(this.hisotryUrlFilePath, 'https://www.acmicpc.net/problem/1000', 'utf-8');
    }

    const url = fs.readFileSync(this.hisotryUrlFilePath, { encoding: 'utf-8' });

    this.view = new WebContentsView();
    this.view.webContents.loadURL(url);

    this.mainWindow.contentView.addChildView(this.view);

    this.puppeteerBroswer = puppeteerBrowser;
  }

  loadUrl(url: string) {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }

      this.mainWindow.focus();
    }

    this.view.webContents.loadURL(url);
  }

  build() {
    const handleDidNavigate = async (e: Electron.Event, url: string) => {
      if (!whiteListUrl.some((wlUrl) => url.startsWith(wlUrl))) {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}`);

        ipc.send(this.mainWindow.webContents, 'load-problem-data', { data: null });

        return;
      }

      fs.writeFileSync(this.hisotryUrlFilePath, url, 'utf-8');

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
            return '';
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
    };

    this.view.webContents.on('did-navigate', handleDidNavigate);

    this.view.webContents.on('did-navigate-in-page', handleDidNavigate);

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

    ipc.on('go-problem', (e, { data }) => {
      if (!data) {
        this.view.webContents.loadURL('https://www.acmicpc.net/problemset');

        return;
      }

      const { number } = data;

      const distUrl = `https://${BOJ_DOMAIN}/problem/${number}`;

      if (this.view.webContents.getURL() === distUrl) {
        return;
      }

      this.view.webContents.loadURL(distUrl);
    });

    ipc.on('go-page', (e, { data }) => {
      if (data === 'baekjoon') {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}/problemset`);
      } else if (data === 'solved.ac') {
        this.view.webContents.loadURL(`https://${SOLVED_AC_DOMAIN}`);
      } else if (typeof data === 'number') {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}/problem/${data}`);
      }
    });

    ipc.on('submit-code', async (e, { data: { code, language, number } }) => {
      // @ts-expect-error
      const page = await pie.getPage(this.puppeteerBroswer, this.view);

      page.goto(`https://${BOJ_DOMAIN}/submit/${number}`);

      const isLogin = await new Promise<boolean>((resolve) => {
        page
          .waitForSelector('#login_form')
          .then(() => {
            resolve(false);

            return '';
          })
          .catch(() => {
            resolve(false);
          });

        page
          .waitForSelector('#language_chosen')
          .then(() => {
            resolve(true);

            return '';
          })
          .catch(() => {
            resolve(false);
          });
      });

      if (!isLogin) {
        throw new Error('로그인이 되어있지 않습니다.');
      }

      const $langChosen = await page.$('#language_chosen');

      if (!$langChosen) {
        throw new Error('언어 선택기를 찾을 수 없습니다.');
      }

      await $langChosen.click();

      const langElList = await page.$$('#language_chosen .chosen-results .active-result');

      let $targetLangEl = null;

      const langOfChosen = (() => {
        switch (language) {
          case 'C++14':
          case 'C++17':
          case 'node.js':
            return language;
          case 'Java11':
            return 'Java 11';
          case 'Python3':
            return 'Python 3';
          default:
            return '';
        }
      })();

      // eslint-disable-next-line no-restricted-syntax
      for (const $langEl of langElList) {
        const langName = await page.evaluate(($el) => $el.textContent, $langEl);

        if (langName === langOfChosen) {
          $targetLangEl = $langEl;

          break;
        }
      }

      if (!$targetLangEl) {
        throw new Error('선택한 언어가 존재하지 않습니다.\n\n언어 설정을 확인해주세요.');
      }

      await $targetLangEl.click();

      const $editorEl = await page.$('#submit_form > div:nth-child(5) > div > div');

      if (!$editorEl) {
        throw new Error('에디터를 찾을 수 없습니다.');
      }

      await $editorEl.click();

      // eslint-disable-next-line no-restricted-syntax
      for (const line of code.split('\n')) {
        await page.keyboard.down('Shift');
        await page.keyboard.press('Home');
        await page.keyboard.press('Delete');
        await page.keyboard.up('Shift');

        await $editorEl.type(line);

        await page.keyboard.press('Enter');
      }

      await page.keyboard.press('Enter');
      await page.keyboard.down('Shift');
      await page.keyboard.press('PageDown');
      await page.keyboard.press('Delete');
      await page.keyboard.up('Shift');

      const $submitButton = await page.$('#submit_button');

      if (!$submitButton) {
        throw new Error('제출 버튼을 찾을 수 없습니다.');
      }

      await $submitButton.click();
    });

    ipc.send(this.mainWindow.webContents, 'call-boj-view-rect');
  }
}

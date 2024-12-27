import { BrowserWindow, app } from 'electron';
import { ipc } from '@/types/ipc';
import { BOJ_DOMAIN } from '@/constants';
import pie from 'puppeteer-in-electron';
import puppeteer from 'puppeteer-core';
import { SubmitError } from '@/error';
import path from 'node:path';

export class Boj {
  private mainWindow: BrowserWindow;

  private browserWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.browserWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });
  }

  build() {
    ipc.on('submit-code', async (e, { data: { code, language, number, id } }) => {
      // @ts-ignore
      const browser = await pie.connect(app, puppeteer);

      const page = await pie.getPage(browser, this.browserWindow);

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
        throw new SubmitError('로그인이 되어있지 않습니다.', 'system', id);
      }

      const $langChosen = await page.$('#language_chosen');

      if (!$langChosen) {
        throw new SubmitError('언어 선택기를 찾을 수 없습니다.', 'system', id);
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
        throw new SubmitError('선택한 언어가 존재하지 않습니다.\n\n언어 설정을 확인해주세요.', 'system', id);
      }

      await $targetLangEl.click();

      const $editorEl = await page.$('#submit_form > div:nth-child(5) > div > div');

      if (!$editorEl) {
        throw new SubmitError('에디터를 찾을 수 없습니다.', 'system', id);
      }

      await $editorEl.click();

      const lines = code.split('\n');

      const n = lines.length;

      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < n; i += 1) {
        const line = lines[i];

        await page.keyboard.down('Shift');
        await page.keyboard.press('Home');
        await page.keyboard.press('Delete');
        await page.keyboard.up('Shift');

        await $editorEl.type(line);

        await page.keyboard.press('Enter');

        ipc.send(this.mainWindow.webContents, 'submit-code-result', {
          data: { id, gage: ((i + 1) / n) * 100, type: 'submit' },
        });
      }

      await page.keyboard.press('Enter');
      await page.keyboard.down('Shift');
      await page.keyboard.press('PageDown');
      await page.keyboard.press('Delete');
      await page.keyboard.up('Shift');

      const $submitButton = await page.$('#submit_button');

      if (!$submitButton) {
        throw new SubmitError('제출 버튼을 찾을 수 없습니다.', 'system', id);
      }

      await $submitButton.click();

      await page.waitForSelector('#status-table');

      await page.evaluate(
        ({ id }) => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              const $el = mutation.addedNodes[0];

              if ($el instanceof Text) {
                window.electron.ipcRenderer.sendMessage('pass-through-submit-result', {
                  data: { id, resultText: $el.data },
                });
              } else if ($el instanceof HTMLAnchorElement) {
                window.electron.ipcRenderer.sendMessage('pass-through-submit-result', {
                  data: { id, resultText: $el.innerText },
                });
              }
            });
          });

          const $result = document.querySelector('#status-table > tbody > tr:first-of-type > .result > span');

          if ($result) {
            observer.observe($result, { childList: true });
          }
        },
        {
          id,
        },
      );
    });

    ipc.on('pass-through-submit-result', (e, { data: { id, resultText } }) => {
      ipc.send(this.mainWindow.webContents, 'submit-code-result', {
        data: {
          type: 'judge',
          id,
          resultText,
          gage: 100,
        },
      });
    });
  }
}

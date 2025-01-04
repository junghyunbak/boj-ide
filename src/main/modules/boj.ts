import { BrowserWindow, app } from 'electron';

import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';

import { ipc } from '@/main/utils';

import { BOJ_DOMAIN } from '@/common/constants';

import { IpcError } from '@/main/error';

export class Boj {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  build() {
    ipc.on('submit-code', async (e, { data: { code, language, number } }) => {
      const browserWindow = new BrowserWindow({
        webPreferences: {},
      });

      // @ts-ignore
      const browser = await pie.connect(app, puppeteer);

      const page = await pie.getPage(browser, browserWindow);

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
        throw new IpcError('로그인이 되어있지 않습니다.', 'system');
      }

      await page.evaluate(() => {
        const $body = document.querySelector('body');

        if (!($body instanceof HTMLElement)) {
          return;
        }

        const $modal = document.createElement('div');

        $modal.innerHTML = `
          <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index:9999; display: flex; justify-content: center; align-items: center; pointer-events: none">
            <p style="font-size: 5rem; color: white; text-align: center">
              제출중입니다.
              <br/>
              <br/>
              클릭 시 문제가 발생할 수 있습니다.
            </p>
          </div>
        `;

        $body.appendChild($modal);
      });

      const $langChosen = await page.$('#language_chosen');

      if (!$langChosen) {
        throw new IpcError('언어 선택기를 찾을 수 없습니다.', 'system');
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
        throw new IpcError('선택한 언어가 존재하지 않습니다.\n\n언어 설정을 확인해주세요.', 'system');
      }

      await $targetLangEl.click();

      const $editorEl = await page.$('#submit_form > div:nth-child(5) > div > div');

      if (!$editorEl) {
        throw new IpcError('에디터를 찾을 수 없습니다.', 'system');
      }

      await $editorEl.click();

      const lines = code.split('\n');

      // eslint-disable-next-line no-restricted-syntax
      for (const line of lines) {
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
        throw new IpcError('제출 버튼을 찾을 수 없습니다.', 'system');
      }

      await $submitButton.click();
    });
  }
}

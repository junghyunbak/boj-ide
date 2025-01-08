|다운로드|메뉴얼|버그제보 및 문의|
|-|-|-|
|[링크](https://github.com/junghyunbak/boj-ide/releases)|[링크](https://boj-ide.gitbook.io/boj-ide-docs)|[링크](https://github.com/junghyunbak/boj-ide/issues)|

<img src="https://github.com/junghyunbak/boj-ide/blob/master/assets/icons/64x64.png"/>

## BOJ IDE

백준 문제 풀이에 사용되는 도구들을 한곳에 모아 제공하는 데스크톱 앱 입니다.

## 기능 요약

![Group 12](https://github.com/user-attachments/assets/e707716a-8894-424c-b34a-99d88ac83804)

1. 좌측에 있는 웹 뷰에서 백준 문제 페이지`https://acmicpc.net/problem/{문제 번호}`로 이동하면,<br/>우측에 코드 에디터가 활성화되며 자동으로 파일을 생성하고 예제 코드를 실행할 준비를 마칩니다.
2. 코드를 작성하고, 실행하여 테스트한 뒤 '제출' 버튼을 눌러 백준 페이지에 코드를 제출합니다.<br/>(단, 웹 뷰에 로그인이 되어있지 않은 경우 제출이 이루어지지 않습니다.)

## 유의 사항

* 로컬에 설치 된 컴파일러/인터프리터를 사용하므로, 앱을 사용하려면 전용 컴파일러/인터프리터가 미리 설치가 되어있어야 합니다.<br/>(언어 별 컴파일러/인터프리터는 [여기](https://boj-ide.gitbook.io/boj-ide-docs/note/cli)를 참고해주세요.)
* 코드 실행 시간은 정확하지 않으므로 참고용으로만 사용해주세요.
* 사용자의 모든 데이터는 앱 내 브라우저의 저장소와 pc내에 저장됩니다. 안심하시고 사용하셔도 됩니다.<br/>(로그인 쿠키 정보, 소스 코드, 테스트케이스 등이 해당)

## Tip

* [BOJ IDE Executor](https://chromewebstore.google.com/detail/boj-ide-executor/aegmfpcnfkmlhmlklhipladjabpncjha) 크롬 확장 프로그램을 사용하면, 외부 브라우저에서 열려있는 백준 문제 페이지에서 BOJ IDE를 곧바로 열어볼 수 있습니다.

## 프로젝트 실행 방법

```bash
npm install

npm start # 개발

npm run package # 패키징
```

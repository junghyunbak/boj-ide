```md
📢 2025.06.01 백준 제출에 Cloudflare 봇 감지가 적용되어, 제출 버튼이 자동으로 클릭되지 않고 있습니다. 직접 제출해주세요.

💁 채점 환경 설정에 어려움을 겪으시고 계시다면 jeong5728@gmail.com 메일로 편하게 연락주세요.

⚠️ Mac 사용자의 경우 .dmg 로 설치한 파일을 응용 프로그램에서 꺼낼 경우 자동 업데이트가 되지 않습니다.
```

## 소개

백준에 없는 IDE 환경을 구현한 앱 입니다.

코딩테스트와 유사한 환경에서 백준 문제를 풀이할 수 있습니다.

## 다운로드

|<a href="https://github.com/junghyunbak/boj-ide/releases/download/1.19.33/BOJ-IDE-1.19.33.dmg"><img width="70px" src="https://github.com/user-attachments/assets/b3d81a17-25cd-4862-8a4b-baacb233a3ea"/></a>|<a href="https://github.com/junghyunbak/boj-ide/releases/download/1.19.33/BOJ-IDE-setup-1.19.33.exe"><img width="70px" src="https://github.com/user-attachments/assets/31a67d43-efe4-43ba-88f1-d9288a067139"/></a>|
|-|-|

## 기능
### 1. 문제 선택

![1](https://github.com/user-attachments/assets/ad078657-b8d4-4cfa-b3a2-e4b330a07f1e)

웹 뷰에서 문제 페이지로 이동 시, 자동으로 코드 파일을 생성하고 예제를 가져옵니다.

### 2. 코드 실행

![2](https://github.com/user-attachments/assets/4f20058d-e0cf-4036-a2ba-8ca3c92856c4)

알고리즘을 작성한 후 코드 실행 버튼을 누르면, 자동으로 코드를 컴파일한 후 테스트케이스의 개수만큼 프로세스를 실행합니다.

### 3. 테스트케이스 추가

![3](https://github.com/user-attachments/assets/b4f061b7-36e3-4752-8831-29d2a2dcdc46)

사용자 테스트케이스를 생성할 수 있습니다. 수정과 삭제는 사용자 테스트케이스만 가능합니다.

### 4. ~~백준 코드 제출~~

![4](https://github.com/user-attachments/assets/126b81ca-1ac6-4d5b-a1ab-5d18069b188c)

~~백준에 코드를 자동으로 제출합니다. 단, 웹 뷰를 통해 백준에 로그인 한 후 사용 가능합니다.~~

(백준 제출 페이지에 cloudflare 봇 감지 기능이 활성화되어 현재 사용할 수 없습니다.)

### 5. 테마 변경

![5](https://github.com/user-attachments/assets/481d58d3-33e7-477c-b339-82ab2685d85c)

- baekjoon
- programmers

두 가지 테마를 지원합니다. 우측 상단 select 버튼을 통해 변경할 수 있습니다.

### 6. AI 표준 입력 생성

![6](https://github.com/user-attachments/assets/6eabddbe-40db-4746-8f0f-697c76b2bd4a)

표준 입력을 위한 코드를 AI가 생성합니다.

문제의 표준 입력 설명, 예제와 미리 작성해둔 프롬프트를 합쳐 질의합니다.

### 7. 일일 문제 추천

![7](https://github.com/user-attachments/assets/ae5c8e70-899d-475f-a59a-1bd275982726)

매일 6개의 문제를 랜덤으로 제공합니다. 점선 형태의 탭으로 제공되며 일반 탭과는 다르게 드래그 할 수 없습니다.

기능은 우측 메뉴에서 비활성화할 수 있습니다.

### 8. 랜덤 문제 생성

![Mar-27-2025 13-41-46](https://github.com/user-attachments/assets/b7feae03-0dbe-4c30-ac41-58f480920a9d)

원하는 난이도 구간의 문제를 랜덤으로 생성합니다.

백준 ID를 추가로 입력하여 이미 풀이한 문제를 제외할 수 있습니다.

## 유의 사항

* 앱을 사용하려면 전용 [컴파일러/인터프리터](https://boj-ide.gitbook.io/boj-ide-docs/note/cli)가 미리 설치되어 있어야 합니다.
* Mac C++의 경우 바이너리 파일 실행 시, 라이브러리를 [동적으로 링크](https://boj-ide.gitbook.io/boj-ide-docs/note/language#c)하기 때문에 코드 실행 시간이 느리게 측정됩니다.
* 사용자의 모든 데이터는 서버가 아닌 pc내에 저장됩니다.
* windows(.exe)의 경우 서명이 되어있지 않아 보안 설정에 의해 차단될 수 있습니다.<img src="https://github.com/user-attachments/assets/842c6fd3-9c1e-4dc2-8df3-0c4408164205"/><img src="https://github.com/user-attachments/assets/b8382fb1-47fa-4f9f-bcd7-e05c7fe5b12b"/>

## 프로젝트 실행 방법

```bash
npm install

npm start # 개발

npm run package # 패키징
```

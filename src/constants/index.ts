export const BOJ_DOMAIN = 'www.acmicpc.net';

export const JS_INPUT_TEMPLATE = `const fs = require('fs');

const stdin = fs.readFileSync(process.platform === 'linux' ? 0 : 'input', 'utf-8').split('\\n');

const input = (() => {
  let i = -1;

  return () => stdin[++i];
})();

/*
[javascript input template]

input 함수를 사용하면 표준 입력을 한줄씩 읽어올 수 있습니다.

예제 - A+B (https://www.acmicpc.net/problem/1000)
*/

const [a, b] = input().split(' ').map(Number);

console.log(a + b);
`;

export const CPP_INPUT_TEMPLATE = `#include <bits/stdc++.h>

using namespace std;

int main() {
  ios::sync_with_stdio(false);

  int a, b;

  cin >> a >> b;

  cout << a+b << endl;

  return 0;
}
`;

export const PY_INPUT_TEMPLATE = `a, b = map(int, input().split())
print(a+b)
`;

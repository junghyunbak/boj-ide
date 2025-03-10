export const JS_INPUT_TEMPLATE = `const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const stdin = [];

const input = (() => {
  let i = -1;

  return () => stdin[++i];
})();

rl.on('line', (line) => {
  stdin.push(line.trim());
});

rl.on('close', () => {
  const [a, b] = input().split(' ').map(Number);

  console.log(a + b);

  /*
  default.js 파일이 존재하지 않을 경우 출력되는 기본 코드입니다.

  기본 코드는 '기본 코드 설정' 버튼을 눌러 변경할 수 있습니다.

  node.js의 경우 fs 모듈을 사용한 입력은 불가합니다. readline을 이용해주세요.
  https://boj-ide.gitbook.io/boj-ide-docs/note/language#node.js
  */
})
`;

export const CPP_INPUT_TEMPLATE = `#include <bits/stdc++.h>

using namespace std;

int main() {
  ios::sync_with_stdio(false);

  int a, b;

  cin >> a >> b;

  cout << a+b << endl;

  /*
  default.cpp 파일이 존재하지 않을 경우 출력되는 기본 코드입니다.

  기본 코드는 '기본 코드 설정' 버튼을 눌러 변경할 수 있습니다.
  */

  return 0;
}
`;

export const PY_INPUT_TEMPLATE = `import sys

a, b = map(int, sys.stdin.readline().split())

print(a+b)

'''
default.py 파일이 존재하지 않을 경우 출력되는 기본 코드입니다.

기본 코드는 '기본 코드 설정' 버튼을 눌러 변경할 수 있습니다.
'''
`;

export const JAVA_CODE_TEMPLATE = `import java.util.*;

public class Main{
  public static void main(String args[]){
    Scanner sc = new Scanner(System.in);

    int a, b;

    a = sc.nextInt();
    b = sc.nextInt();

    System.out.println(a + b);

    /*
    default.java 파일이 존재하지 않을 경우 출력되는 기본 코드입니다.

    기본 코드는 '기본 코드 설정' 버튼을 눌러 변경할 수 있습니다.
    */
  }
}
`;

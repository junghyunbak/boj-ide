export const MAX_BUFFER_SIZE = 1024 * 10;

export const MAX_LINE_LENGTH = 200;

export const LANGAUGES: Language[] = ['C++14', 'C++17', 'C++17 (Clang)', 'Java11', 'Python3', 'node.js'];

export const BOJ_DOMAIN = 'www.acmicpc.net';

export const BOJ_HELP_DOMAIN = 'help.acmicpc.net';

export const SOLVED_AC_DOMAIN = 'solved.ac';

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
})
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

export const JAVA_CODE_TEMPLATE = `import java.util.*;
public class Main{
	public static void main(String args[]){
		Scanner sc = new Scanner(System.in);
		int a, b;
		a = sc.nextInt();
		b = sc.nextInt();
		System.out.println(a + b);
	}
}
`;

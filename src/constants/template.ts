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

export const PY_INPUT_TEMPLATE = `import sys

a, b = map(int, sys.stdin.readline().split())
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

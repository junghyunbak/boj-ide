type MessageTemplate<T> = {
  data: T;
};

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type MyPick<T, U extends T> = T extends U ? T : never;

type MyExclude<T, U extends T> = T extends U ? never : T;

type ExtractParams<T> = T extends (...params: infer P) => any ? P : never;

type MessageTemplate<T> = {
  data: T;
};

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type ExtractParams<T> = T extends (...params: infer P) => any ? P : never;

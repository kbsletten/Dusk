export type Patch<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? Patch<U>[]
    : T[P] extends object
    ? Patch<T[P]>
    : T[P];
};

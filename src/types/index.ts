// Definition.
export type Result<T, E> = {
  readonly ok: Array<T>;
  readonly err: Array<E>;
};

type PascalCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Uppercase<P2>}${PascalCase<P3>}`
    : S;

type PascalizeObject<T, S = false> = {
  [K in keyof T as Capitalize<PascalCase<string & K>>]:
    T[K] extends Date ? T[K] :
      T[K] extends RegExp ? T[K] :
        T[K] extends Array<infer U>
          ? U extends ({} | undefined)
            ? Array<PascalizeObject<U>>
            : T[K]
          : T[K] extends ({} | undefined)
          ? S extends true
            ? T[K]
            : PascalizeObject<T[K]>
          : T[K]
};

export type Pascalize<T, S = false> =
  T extends Array<(infer U)>
    ? Array<PascalizeObject<U, S>>
    : PascalizeObject<T, S>;

function pascalCase(str: string) {
  return str.replace(/(?:[ \t]|^|[a-z0-9])(^.|[A-Z])/g, function (full, x) {
      return full.replace(x, x.toUpperCase());
  });
}

function walk(obj, shallow = false): any {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj)) return obj.map(v => {
    if (!shallow) { return walk(v) }
    if (typeof v === 'object') return walk(v, shallow)
    return v
  })

  return Object.keys(obj).reduce((res, key) => {
    const pascal = pascalCase (key);
    res[pascal] = shallow ? obj[key] : walk(obj[key]);
    return res;
  }, {});
}

export default function pascalize<T, S extends boolean = false>(
  /**
   * Value to be pascalized
   */
  obj: T,

  /**
   * If true, only the top level keys of the obj will be pascal cased
   */
  shallow?: S
): T extends String ? string : Pascalize<T, S> {
  return typeof obj === "string" ? pascalize(obj) : walk(obj, shallow);
}
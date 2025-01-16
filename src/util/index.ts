export function isValidObject(
  obj: unknown,
): obj is Record<PropertyKey, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function isValidObjectKey<TKey extends PropertyKey>(
  obj: unknown,
  key: TKey,
): obj is Record<TKey, unknown> {
  return isValidObject(obj) && key in obj;
}

export function assertUnreachable(_?: never): never {
  throw new Error('Unreachable code assertion failed');
}

import { assertUnreachable, isValidObject, isValidObjectKey } from '.';

describe('util', () => {
  it('isValidObject', () => {
    expect(isValidObject({ foo: 'bar' })).toBe(true);
    expect(isValidObject(null)).toBe(false);
    expect(isValidObject('foo')).toBe(false);
    expect(isValidObject(['foo'])).toBe(false);
  });

  it('isValidObjectKey', () => {
    expect(isValidObjectKey({ foo: 'bar' }, 'foo')).toBe(true);
    expect(isValidObjectKey({ foo: 'bar' }, 'bar')).toBe(false);
    expect(isValidObjectKey(null, 'foo')).toBe(false);
    expect(isValidObjectKey('foo', 'foo')).toBe(false);
    expect(isValidObjectKey(['foo'], 'foo')).toBe(false);
  });

  it('assertUnreachable', () => {
    expect(() => assertUnreachable()).toThrow('Unreachable code assertion failed');
    // @ts-expect-error
    expect(() => assertUnreachable('foo')).toThrow('Unreachable code assertion failed');
  });
});

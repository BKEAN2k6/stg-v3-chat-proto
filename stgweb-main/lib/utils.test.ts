import {omitKeys, groupArray} from './utils';

describe('utils', () => {
  describe('omitKeys', () => {
    it('should omit keys', () => {
      const object = {
        a: 1,
        b: 2,
        c: 3,
      };

      const result = omitKeys(object, ['a', 'b']);

      expect(result).toEqual({c: 3});
    });
  });

  describe('groupArray', () => {
    it('should group an array', () => {
      const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const result = groupArray(array, 3);

      expect(result).toEqual([
        {items: ['a', 'b', 'c']},
        {items: ['d', 'e', 'f']},
        {items: ['g']},
      ]);
    });
  });
});

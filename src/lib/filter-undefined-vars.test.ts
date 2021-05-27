import { filterUndefinedVars } from './filter-undefined-vars';

test('should filter only undefined variables', () => {
  let var1;
  const var2 = null;
  const var3 = 0;
  const var4 = '';
  const var5 = false;
  const var6 = undefined;
  const var7: [] = [];
  const var8 = {};
  const result = filterUndefinedVars({
    var1,
    var2,
    var3,
    var4,
    var5,
    var6,
    var7,
    var8
  });
  expect(result).toStrictEqual(['var1', 'var6']);
});

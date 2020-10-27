import babel from '@babel/core';
import plugin from '../babel.js';

import style9 from '../index.mjs';

export { style9 };

const btoa = (str) => Buffer.from(str.toString(), 'binary').toString('base64');

export const compile = (input, opts = {}) => {
  const { code, ast, metadata: { style9: styles } } =
    babel.transformSync(input, { plugins: [[plugin, opts]] });

  return { code, ast, styles };
};

const STYLE9_URL = (new URL('../index.mjs', import.meta.url)).toString();

export const getModule = async (code) => {
  const input = code.replace("'style9'", `'${STYLE9_URL}'`);
  return await import(`data:text/javascript;base64,${btoa(input)}`);
};

export const normalizeClasses = classes => {
  const norm = classes.trim().split(' ').filter(Boolean);
  norm.sort();
  return norm;
};

export const assertSameClasses = (t, actual, expected, message) => {
  t.deepEqual(normalizeClasses(actual), normalizeClasses(expected), message);
}
// code for testing using data url es module
//export const getClasses = (a) => styles(a ? 'red' : 'default');
//export const test2 = (a) => style9(a ? styles.red : styles.default);
//  const { code } = compile(input);
//  console.log(code);
//  const module = await getModule(code);
//  console.log(module.test1(true));
//  console.log(module.test1(false));
//  console.log(module.test2(true));
//  console.log(module.test2(false));
//  t.snapshot(code);
//  t.snapshot(module.style9s);
//  t.snapshot(module.klasses);

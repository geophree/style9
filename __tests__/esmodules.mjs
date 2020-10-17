import test from 'ava';
import { compile, getModule, assertSameClasses, style9 } from './_helpers.mjs';

test('ternary compiled styles() matches external style9()', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  base: {
    color: 'yellow',
    opacity: 1
  },
  red: { color: 'red' }
});

export const red = styles.red;
export const base = styles.base;
export const actual = a => styles(a ? 'red' : 'base');
  `;

  const { code } = compile(input);
  const { actual, red, base } = await getModule(code);
  const expected = a => style9(a ? red : base);
  assertSameClasses(t, actual(false), expected(false));
  assertSameClasses(t, actual(true), expected(true));
});

test('dupe style different `&&` styles() same as style9()', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  base: {
    color: 'yellow',
    opacity: 1
  },
  red: { color: 'red' }
});

export const red = styles.red;
export const base = styles.base;
export const actual = (a, b) => styles('base', a && 'red', b && 'red');
  `;

  const { code } = compile(input);
  const { actual, red, base } = await getModule(code);
  const expected = (a, b) => style9(base, a && red, b && red);
  assertSameClasses(t, actual(false, false), expected(false, false), 'false false');
  assertSameClasses(t, actual(false, true), expected(false, true), 'false true');
  assertSameClasses(t, actual(true, false), expected(true, false), 'true false');
  assertSameClasses(t, actual(true, true), expected(true, true), 'true true');
});

test('dupe style same `&&` interleaved styles() same as style9()', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  base: {
    color: 'yellow',
    opacity: 1
  },
  blue: { color: 'blue' },
  hide: { display: 'none' },
  red: { color: 'red' }
});

export const base = styles.base;
export const blue = styles.blue;
export const hide = styles.hide;
export const red = styles.red;
export const actual1 = (a, b) => styles('base', a && 'red', b && 'blue', a && 'red');
export const actual2 = (a, b) => styles('base', a && 'red', b && 'hide', a && 'red');
  `;

  const { code } = compile(input);
  const { actual1, actual2, base, blue, hide, red } = await getModule(code);
  const expected1 = (a, b) => style9(base, a && red, b && blue, a && red);
  const expected2 = (a, b) => style9(base, a && red, b && hide, a && red);
  assertSameClasses(t, actual1(false, false), expected1(false, false), '1: false false');
  assertSameClasses(t, actual1(false, true), expected1(false, true), '1: false true');
  assertSameClasses(t, actual1(true, false), expected1(true, false), '1: true false');
  assertSameClasses(t, actual1(true, true), expected1(true, true), '1: true true');
  assertSameClasses(t, actual2(false, false), expected2(false, false), '2: false false');
  assertSameClasses(t, actual2(false, true), expected2(false, true), '2: false true');
  assertSameClasses(t, actual2(true, false), expected2(true, false), '2: true false');
  assertSameClasses(t, actual2(true, true), expected2(true, true), '2: true true');
});

test.skip('xxx', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  base: {
    color: 'yellow',
    opacity: 1
  },
  blue: { color: 'blue', opacity: .5 },
  hide: { display: 'none' },
  red: { color: 'red' }
});

export const base = styles.base;
export const blue = styles.blue;
export const hide = styles.hide;
export const red = styles.red;
export const x = (a, b) => styles('base', !a && 'red', b && 'blue', a && 'red');
export const y = (a, b) => styles('base', a && 'red', b && 'blue', !a && 'red');
export const y2 = (a, b) => styles('base', b && 'blue', a && 'red', !a && 'red');
export const z = (a, b) => styles('base', a ? 'red' : 'blue');
export const actual1 = (a, b) => styles('base', !a && 'blue', !a && 'red');
export const actual2 = (a, b) => styles('base', a && 'red', b && 'hide', a && 'red');
  `;

  const { code } = compile(input);
  t.log(code);
  t.fail();
  const { actual1, actual2, base, blue, hide, red } = await getModule(code);
  const expected1 = (a, b) => style9(base, a && red, b && blue, a && red);
  const expected2 = (a, b) => style9(base, a && red, b && hide, a && red);
  assertSameClasses(t, actual1(false, false), expected1(false, false), '1: false false');
  assertSameClasses(t, actual1(false, true), expected1(false, true), '1: false true');
  assertSameClasses(t, actual1(true, false), expected1(true, false), '1: true false');
  assertSameClasses(t, actual1(true, true), expected1(true, true), '1: true true');
  assertSameClasses(t, actual2(false, false), expected2(false, false), '2: false false');
  assertSameClasses(t, actual2(false, true), expected2(false, true), '2: false true');
  assertSameClasses(t, actual2(true, false), expected2(true, false), '2: true false');
  assertSameClasses(t, actual2(true, true), expected2(true, true), '2: true true');
});

test('ternary compiled style9() matches external style9()', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  base: {
    color: 'yellow',
    opacity: 1
  },
  red: { color: 'red' }
});

export const red = styles.red;
export const base = styles.base;
export const actual = a => style9(a ? red : base);
  `;

  const { code } = compile(input);
  const { actual, red, base } = await getModule(code);
  const expected = a => style9(a ? red : base);
  assertSameClasses(t, actual(false), expected(false));
  assertSameClasses(t, actual(true), expected(true));
});

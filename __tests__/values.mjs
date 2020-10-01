import test from 'ava';
import { compile } from './_helpers.mjs';

test('compiles', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles('default');
  `;
  const { code } = compile(input);
  t.notDeepEqual(code, input);
});

test('converts to pixels', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    paddingLeft: 2
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('does not converts to pixels', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('expands shorthand', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    padding: '1rem'
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('does not override longhand', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    padding: '1rem',
    paddingLeft: '2rem'
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('converts fontSize pixels', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    fontSize: 14
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('accepts an array', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    textDecorationLine: ['underline', 'overline']
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('supports constants', t => {
  const input = `
import style9 from 'style9';
const BLUE = 'blue';
const styles = style9.create({
  default: {
    color: BLUE
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('removes unused styles', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports static bracket access', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles['default']
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports dynamic bracket access', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles[blue]
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports arrow function', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
const get = state => styles(state && 'default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('does not work without declaration', t => {
  const input = `
import style9 from 'style9';
style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  t.throws(() => compile(input));
});

test('only supports Member- and CallExpression on styles', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
foo(styles);
  `;
  t.throws(() => compile(input));
});

test('throws on non-existing property', t => {
  const input = `
import style9 from 'style9';
style9.foo;
  `;
  t.throws(() => compile(input));
});

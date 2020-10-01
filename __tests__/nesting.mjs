import test from 'ava';
import { compile } from './_helpers.mjs';

test('supports nesting', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports at rules', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      opacity: 1
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports deep nesting', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      ':hover': {
        '::before': {
          opacity: 1
        }
      }
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('generates correct class names', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  },
  hidden: {
    '::before': {
      opacity: 0
    }
  }
});
styles('default', 'hidden');
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('translates old pseudo element', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    ':before': { opacity: 1 },
    ':after': { opacity: 1 },
    ':first-letter': { opacity: 1 },
    ':first-line': { opacity: 1 }
  }
});
styles.default
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('throws in invalid nesting', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    foo: {
      opacity: 1
    }
  }
});
  `;
  t.throws(() => compile(input));
});

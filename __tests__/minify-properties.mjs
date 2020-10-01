import test from 'ava';
import { compile } from './_helpers.mjs';

test('does not minify by default', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles.default
  `;
  const { code } = compile(input);

  t.snapshot(code);
});

test('does not minify styles', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles.default
  `;
  const { styles } = compile(input);

  t.snapshot(styles);
});

test('minifies known properties', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles.default
  `;
  const { code } = compile(input, { minifyProperties: true });

  t.snapshot(code);
});

test('hashes unknown properties', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    foo: 'bar'
  }
});
styles.default
  `;
  const { code } = compile(input, { minifyProperties: true });

  t.snapshot(code);
});

test('minifies nested properties', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      '::before': {
        opacity: 1
      }
    }
  }
});
styles.default
  `;
  const { code } = compile(input, { minifyProperties: true });

  t.snapshot(code);
});

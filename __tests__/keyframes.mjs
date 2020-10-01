import test from 'ava';
import { compile } from './_helpers.mjs';

test('supports keyframes', t => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  '0%': {
    color: 'blue'
  },
  '100%': {
  }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('converts from', t => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  from: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('converts to', t => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  to: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports complex styles and times', t => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  '0%': { top: 0, left: 0 },
  '30%': { top: '50px', marginBottom: 1, margin: 0 },
  '68%, 72%': { left: '50px', marginBottom: 5 },
  '100%': { top: '100px', left: '100%' }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports settings animationName directly', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    animationName: style9.keyframes({
      '0%': {
        opacity: 0
      }
    })
  }
});
styles.default
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

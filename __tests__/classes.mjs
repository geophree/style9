import test from 'ava';
import { compile } from './_helpers.mjs';

test('string literals', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles('default', 'red');
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('moves test', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles(foo() && 'default');
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('and', async t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles('default', foo && 'red');
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('ternary', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles(foo ? 'red' : 'default');
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('object', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles({
  default: foo,
  red: bar
});
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('mixed', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles({
  default: foo
}, 'red');
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('property access', t => {
  const input = `
import style9 from 'style9';
const styles1 = style9.create({
  default: {
    color: 'blue'
  }
});
const styles2 = style9.create({
  red: {
    color: 'red'
  }
});
style9(styles1.default, styles2.red)
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('hoists function call', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles({
  default: foo()
})
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('supports destructuring assignment', t => {
  const input = `
import style9 from 'style9';
const { blue } = style9.create({
  blue: {
    color: 'blue'
  }
});
console.log(blue)
  `;
  const { code } = compile(input);
  t.snapshot(code);
});

test('supports member expression access', t => {
  const input = `
import style9 from 'style9';
const blue = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
}).blue;
console.log(blue)
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports static bracket access', t => {
  const input = `
import style9 from 'style9';
const blue = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
})['blue'];
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
})[blue];
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports spread assignment', t => {
  const input = `
import style9 from 'style9';
const { ...styles } = style9.create({
  blue: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

test('supports spread use', t => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  blue: {
    color: 'blue'
  }
});
console.log({ ...styles });
  `;
  const { code, styles } = compile(input);

  t.snapshot(code);
  t.snapshot(styles);
});

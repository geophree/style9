import test from 'ava';
import style9 from '../index.mjs';

test('combines different properties', t => {
  const input = {
    a: {
      foo: 'foo'
    },
    b: {
      bar: 'bar'
    }
  };
  t.deepEqual(style9(input.a, input.b), 'foo bar');
});

test('merges from right to left', t => {
  const input = {
    a: {
      foo: 'foo'
    },
    b: {
      foo: 'bar'
    }
  };
  t.deepEqual(style9(input.a, input.b), 'bar');
});

test('ignores falsy values', t => {
  const input = {
    a: {
      foo: 'foo'
    }
  };
  t.deepEqual(style9(input.a, false, undefined, null), 'foo');
});

test('handles nested objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz'
      }
    },
    b: {
      foo: 'bar'
    }
  };
  t.deepEqual(style9(input.a, input.b), 'bar baz');
});

test('merges nested objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz'
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz'
      }
    }
  };
  t.deepEqual(style9(input.a, input.b), 'bar biz');
});

test('handles deeply nested objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar'
    }
  };
  t.deepEqual(style9(input.a, input.b), 'bar baz bop');
});

test('merges deeply nested objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    }
  };
  t.deepEqual(style9(input.a, input.b), 'bar biz bip');
});

test('merges several deeply nested objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    },
    c: {
      foo: 'bup',
      first: {
        foo: 'bap'
      }
    }
  };
  t.deepEqual(style9(input.a, input.b, input.c), 'bup bap bip');
});

test('does not modify objects', t => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    }
  };
  const clone = JSON.parse(JSON.stringify(input))
  style9(input.a, input.b);
  t.deepEqual(input, clone);
});

const t = require('@babel/types');

/*

pass in Map that maps `test`s to a Map that says which `test`s they are
equivalent to (share by equivalent `test`s), and also opposite of.
Keep list of unique `test`s (omit opposites) to test against
Track number of `!`s to tack oppositeness.
use t.isNodesEquivalent(node1, node2)

We can:
remove subsequent args with same `test`
if we've seen `test` or `!test`, the other becomes no-test.

After generating all ternaries, we can:
combine ones with the same `test`, and concat string literals

TODO(geophree): do we need to clone the `test`s?
Maybe when we generate conditionals?
*/

const isNegation = (node) => t.isUnaryExpression(node) && node.operator === '!' && node.prefix;

const reduceNegations = (node) => {
  while (1) {
    if (!isNegation(node)) return { node, negation: null };
    if (!isNegation(node.argument)) return { node, negation: node.argument };
    node = node.argument.argument;
  }
};

const createTestNormalizer = () => {
  const normalizedTests = new Map();

  return function normalize(test, force) {
    if (force) {
      normalizedTests.set(test, force);
      return force;
    }

    let value = normalizedTests.get(test);
    if (!value) {
      const newValue = reduceNegations(test);
      value = normalizedTests.get(newValue.node);
      if (!value) value = newValue;
      normalizedTests.set(test, value);
    }
    return value;
  };
};

const compareValues = (a, b) => {
  if (!a.negation === !b.negation) {
    return { equal: t.isNodesEquivalent(a.node, b.node), negated: false };
  }
  if (a.negation) [b, a] = [a, b];
  return {
    equal: t.isNodesEquivalent(a.node, b.node),
    negated: t.isNodesEquivalent(a.node, b.negation)
  };
};

const checkSeen = (normalize, seenTests, test) => {
  const value = normalize(test);
  if (seenTests.get(value.node)) return { seen: true, seenNegated: false, value };
  for (let seenValue of seenTests.values()) {
    const { equal, negated } = compareValues(value, seenValue);
    if (equal) {
      normalize(test, seenValue);
      return { seen: true, seenNegated: false, value: seenValue };
    }
    if (negated) return { seen: false, seenNegated: true, value };
  }
  seenTests.set(value.node, value);
  return { seen: false, seenNegated: false, value };
};


function getConditionalArgs(args, { classes, normalize }) {
  const newArgs = [];
  const seenTests = new Map();

  // Iterate over args backwards until the end or no-test arg is found
  for (let n = args.length - 1; n >= 0; n--) {
    const { test, value } = args[n];
    const cls = classes[value];

    // Style doesn't have this property
    // TODO(geophree): throw a babel error if this happens?
    if (!cls) continue;

    if (test) {
      const { seen, seenNegated, value } = checkSeen(normalize, seenTests, test);
      // Don't add an arg with a test we've seen
      // if we make it there it'll never be true.
      if (seen) continue;
      // Treat an arg with a test we've seen negated as no-test
      // if we make it there it'll never be false.
      if (!seenNegated) {
        newArgs.push({ test: value.node, value: cls });
        continue;
      }
    }

    // when the last arg is no-test, remove all ending tests that result in
    // the same class
    while (newArgs.length) {
      if (newArgs[newArgs.length - 1].value !== cls) break;
      newArgs.pop();
    }

    newArgs.push({ value: cls });
    return newArgs;
  }

  if (newArgs.length) newArgs.push({ value: '' });

  return newArgs;
}

function generateExpression(args, classObj) {
  const usedProps = Object.values(classObj)
    .flatMap(obj => Object.keys(obj))
    // Remove duplicates
    .filter((prop, index, array) => array.indexOf(prop) === index);

  const stringLiteralArgs = [];
  const normalize = createTestNormalizer();
  const conditionals = usedProps.map(prop => {
    const classes = Object.fromEntries(
      Object.entries(classObj).map(([key, val]) => [key, val[prop]])
    );

    const conditionalArgs = getConditionalArgs(args, { classes, normalize });
    if (!conditionalArgs.length) return;
    const { value: lastArg } = conditionalArgs.pop();
    if (conditionalArgs.length == 0) {
      stringLiteralArgs.push(lastArg);
      return;
    }

    return conditionalArgs.reduceRight(
      (acc, {test, value}) => t.conditionalExpression(
        test,
        t.stringLiteral(value + ' '),
        acc
      ),
      t.stringLiteral(lastArg ? lastArg + ' ' : '')
    );
  }).filter(Boolean);

  if (stringLiteralArgs.length) {
    conditionals.push(t.stringLiteral(stringLiteralArgs.join(' ') + ' '));
  }

  const additions = conditionals.reduceRight((acc, expr) => {
    return t.binaryExpression('+', expr, acc)
  });

  return t.expressionStatement(additions);
}

module.exports = generateExpression;

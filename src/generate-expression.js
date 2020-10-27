const t = require('@babel/types');

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

function newClassExpressionData() {
  return { literals: [], conditionals: new Map()};
}

function findOrCreateConditional(currentCed, test, normalize) {
  const { conditionals } = currentCed;
  let conditional = conditionals.get(test);
  if (conditional) return conditional;

  for (let [key, value] of conditionals) {
    if (t.isNodesEquivalent(test, key)) {
      normalize(test, { node: key });
      return value;
    }
  }

  conditional = {
    consequent: newClassExpressionData(),
    alternate: newClassExpressionData()
  };
  conditionals.set(test, conditional);

  return conditional;
}

function buildClassExpressionData(args, classObj) {
  const usedProps = Object.values(classObj)
    .flatMap(obj => Object.keys(obj))
    // Remove duplicates
    .filter((prop, index, array) => array.indexOf(prop) === index);

  const normalize = createTestNormalizer();
  const classExpressionData = newClassExpressionData();
  for (const prop of usedProps) {
    const classes = Object.fromEntries(
      Object.entries(classObj).map(([key, val]) => [key, val[prop]])
    );

    const conditionalArgs = getConditionalArgs(args, { classes, normalize });
    let currentCed = classExpressionData;
    for (let { test, value } of conditionalArgs) {
      let target = currentCed;
      if (test) {
        const normalized = normalize(test);
        test = normalized.node;
        const negation = normalized.negation;
        if (negation) test = negation;
        const conditional =
          findOrCreateConditional(currentCed, test, normalize);
        target = conditional.consequent;
        currentCed = conditional.alternate;
        if (negation) [target, currentCed] = [currentCed, target];
      }
      // TODO(geophree): count uses of each class so we can minimize them
      if (value) target.literals.push(value);
    }
  }

  return classExpressionData;
}

function buildClassExpression({ literals, conditionals }, usedTests) {
  const initial = []
  if (literals.length) {
    initial.push(t.stringLiteral(literals.join(' ') + ' '));
  } else if (!conditionals.size) {
    initial.push(t.stringLiteral(''));
  }

  return Array.from(conditionals.entries()).map(
    ([test, branches]) => buildConditionalExpression(test, branches, usedTests)
  ).reduce(
    (exp1, exp2) => t.binaryExpression('+', exp1, exp2),
    ...initial
  );
}

function buildConditionalExpression(test, branches, usedTests) {
  const { consequent, alternate } = branches;
  const needsClone = usedTests.get(test);
  const maybeClonedTest = needsClone ? t.cloneNode(test) : test;
  if (needsClone) usedTests.set(test, true);
  return t.conditionalExpression(
    maybeClonedTest,
    buildClassExpression(consequent, usedTests),
    buildClassExpression(alternate, usedTests)
  );
}

function generateExpression(args, classObj) {
  const classExpressionData = buildClassExpressionData(args, classObj);
  return buildClassExpression(classExpressionData, new Map());
}

module.exports = generateExpression;

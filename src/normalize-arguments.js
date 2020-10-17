const t = require('@babel/types');
// const { extractNode } = require('./utils.js');

/**
 * Map arguments to strings and logical ANDs
 * TODO(geophree): extract tests using extractNode when they involve function calls.
 */
function normalizeArguments(use) {
  return use.parentPath.get('arguments').flatMap(argPath => {
    const arg = argPath.node;
    if (t.isStringLiteral(arg)) {
      return { value: arg.value };
    } else if (t.isLogicalExpression(arg, { operator: '&&' })) {
      t.assertStringLiteral(arg.right);

      return {
        test: arg.left,
        value: arg.right.value
      };
    } else if (t.isObjectExpression(arg)) {
      return arg.properties.map(({ key, value }) => {
        t.assertIdentifier(key);

        return {
          test: value,
          value: key.name
        };
      });
    } else if (t.isConditionalExpression(arg)) {
      t.assertStringLiteral(arg.consequent);
      t.assertStringLiteral(arg.alternate);

      const { test } = arg;
      let notTest;
      if (t.isUnaryExpression(test) && test.operator === '!' && test.prefix) {
        notTest = test.argument;
      } else {
        notTest = t.unaryExpression('!', test);
      }

      return [
        {
          test: notTest,
          value: arg.alternate.value
        },
        {
          test,
          value: arg.consequent.value
        }
      ];
    }
    throw argPath.buildCodeFrameError(`Unsupported type ${arg.type}`);
  });
}

module.exports = normalizeArguments;

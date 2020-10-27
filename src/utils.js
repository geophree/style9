const t = require('@babel/types');
const { UNITLESS_NUMBERS, SHORTHAND_EXPANSIONS } = require('./constants.js');
const hash = require('murmurhash-js');
const cssProperties = require('known-css-properties').all;

/**
 * Values can be arrays
 */
function isNestedStyles(item) {
  return typeof item === 'object' && !Array.isArray(item);
}

const BASE_FONT_SIZE_PX = 16;

function camelToHyphen(string) {
  return string.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

function normalizeProp(prop) {
  // leave custom properties alone
  if (prop.startsWith('--')) return prop;
  return camelToHyphen(prop);
}

function normalizeValue(prop, value) {
  // leave custom properties alone
  if (value && typeof value === 'number' && !prop.startsWith('--')) {
    if (prop === 'fontSize') return `${value / BASE_FONT_SIZE_PX}rem`;
    if (!UNITLESS_NUMBERS.includes(prop)) return `${value}px`;
  } else if (Array.isArray(value)) {
    return value.slice().join(' ');
  }

  return value;
}

// Avoid vowels (aeiouy) so we don't make words.
const VOWEL_MAP = {a: 'w', e: 'x', i: 'z', o: '_', u: '-'};

function base32NoVowels(num) {
  return num.toString(32).replace(/[aeiou]/g, m => VOWEL_MAP[m[0]]);
}

// Class can't start with number
const CLASS_PREFIX = 'c';

function getClass(...args) {
  return CLASS_PREFIX + base32NoVowels(hash(JSON.stringify(args)));
}

/**
 * Resolve the value of a node path
 */
function resolvePathValue(path) {
  const { value, confident, deopt } = path.evaluate();
  if (confident) return value;
  throw deopt.buildCodeFrameError('Could not evaluate value');
}

function formatCssRule(prop, value) {
  return `${normalizeProp(prop)}:${normalizeValue(prop, value)}`;
}

function expandProperty(prop) {
  return SHORTHAND_EXPANSIONS[prop] || [prop];
}

function expandProperties(obj) {
  const expanded = {};

  for (const key in obj) {
    const value = obj[key];

    if (isNestedStyles(value)) {
      expanded[key] = expandProperties(value);
    } else {
      for (const prop of expandProperty(key)) {
        // Longhand takes precedent
        if (prop in obj && prop !== key) continue;

        expanded[prop] = value;
      }
    }
  }

  return expanded;
}

function getDeclaration({ name, value, atRules, pseudoSelectors }) {
  const cls = getClass({ name, value, atRules, pseudoSelectors });

  return [
    ...atRules.flatMap(rule => [rule, '{']),
    '.',
    cls,
    ...pseudoSelectors,
    '{',
    formatCssRule(name, value),
    '}',
    ...atRules.map(() => '}')
  ].join('');
}

function normalizeTime(time) {
  if (time === 'from') return '0%';
  if (time === 'to') return '100%';
  return time;
}

function stringifyKeyframes(frames) {
  return Object.entries(frames).flatMap(([time, styles]) => [
    normalizeTime(time),
    '{',
    Object.entries(expandProperties(styles)).map(
      ([prop, value]) => formatCssRule(prop, value)
    ).join(';'),
    '}',
  ]).join('');
}

function getKeyframes(rules) {
  const rulesString = stringifyKeyframes(rules);
  const name = getClass(rulesString);
  const declaration = `@keyframes ${name}{${rulesString}}`;
  return { name, declaration };
}

/**
 * Move node to a constant and return an identifier
 */
function extractNode(path, node) {
  if (t.isIdentifier(node)) return node;

  const name = path.scope.generateUidBasedOnNode(node);

  if (path.scope.path.type !== 'Program') {
    path.scope.path.ensureBlock();
  }

  path.getStatementParent().insertBefore(
    t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier(name), node)
    ])
  );

  return t.identifier(name);
}


const LEGACY_PSEUDO_ELEMENTS = [
  ':before',
  ':after',
  ':first-letter',
  ':first-line'
];

function normalizePseudoElements(string) {
  if (LEGACY_PSEUDO_ELEMENTS.includes(string)) {
    return ':' + string;
  }

  return string;
}

function minifyProperty(name) {
  const hyphenName = normalizeProp(name);
  if (cssProperties.includes(hyphenName)) {
    return base32NoVowels(cssProperties.indexOf(hyphenName));
  }

  return base32NoVowels(hash(hyphenName));
}

module.exports = {
  expandProperties,
  resolvePathValue,
  getClass,
  getDeclaration,
  extractNode,
  getKeyframes,
  isNestedStyles,
  normalizePseudoElements,
  minifyProperty
};

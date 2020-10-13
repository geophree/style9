# Snapshot report for `__tests__/keyframes.mjs`

The actual snapshot is saved in `keyframes.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## converts from

> Snapshot 1

    `import style9 from 'style9';␊
    "c16dvzh5";`

> Snapshot 2

    '@keyframes c16dvzh5{0%{color:blue}}'

## converts to

> Snapshot 1

    `import style9 from 'style9';␊
    "c3-r_3zf";`

> Snapshot 2

    '@keyframes c3-r_3zf{100%{color:blue}}'

## supports complex styles and times

> Snapshot 1

    `import style9 from 'style9';␊
    "cwcgdwf";`

> Snapshot 2

    '@keyframes cwcgdwf{0%{top:0;left:0}30%{top:50px;margin-bottom:1px;margin-top:0;margin-right:0;margin-left:0}68%, 72%{left:50px;margin-bottom:5px}100%{top:100px;left:100%}}'

## supports keyframes

> Snapshot 1

    `import style9 from 'style9';␊
    "c36qpblr";`

> Snapshot 2

    '@keyframes c36qpblr{0%{color:blue}100%{}}'

## supports settings animationName directly

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        animationName: "cd7n9ql"␊
      }␊
    };␊
    styles.default;`

> Snapshot 2

    '@keyframes c3fzj0b_{0%{opacity:0}}.cd7n9ql{animation-name:c3fzj0b_}'
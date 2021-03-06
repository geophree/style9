# Snapshot report for `__tests__/classes.mjs`

The actual snapshot is saved in `classes.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## and

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        color: "c3hvvfmt",␊
        opacity: "c1m62mnn"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    "c1m62mnn " + (foo ? "c1-vpbjq " : "c3hvvfmt ");`

## mixed

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        color: "c3hvvfmt",␊
        opacity: "c1m62mnn"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    "c1-vpbjq " + (foo ? "c1m62mnn " : "");`

## object

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        color: "c3hvvfmt",␊
        opacity: "c1m62mnn"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    (bar ? "c1-vpbjq " : foo ? "c3hvvfmt " : "") + (foo ? "c1m62mnn " : "");`

## property access

> Snapshot 1

    `import style9 from 'style9';␊
    const styles1 = {␊
      default: {␊
        color: "c3hvvfmt"␊
      }␊
    };␊
    const styles2 = {␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    style9(styles1.default, styles2.red);`

## string literals

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        color: "c3hvvfmt",␊
        opacity: "c1m62mnn"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    "c1-vpbjq c1m62mnn ";`

## supports destructuring assignment

> Snapshot 1

    `import style9 from 'style9';␊
    const {␊
      blue␊
    } = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      }␊
    };␊
    console.log(blue);`

## supports dynamic bracket access

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    }[blue];`

> Snapshot 2

    '.c3hvvfmt{color:blue}.c1-vpbjq{color:red}'

## supports member expression access

> Snapshot 1

    `import style9 from 'style9';␊
    const blue = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      }␊
    }.blue;␊
    console.log(blue);`

> Snapshot 2

    '.c3hvvfmt{color:blue}'

## supports spread assignment

> Snapshot 1

    `import style9 from 'style9';␊
    const { ...styles␊
    } = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      }␊
    };`

> Snapshot 2

    '.c3hvvfmt{color:blue}'

## supports spread use

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      }␊
    };␊
    console.log({ ...styles␊
    });`

> Snapshot 2

    '.c3hvvfmt{color:blue}'

## supports static bracket access

> Snapshot 1

    `import style9 from 'style9';␊
    const blue = {␊
      blue: {␊
        color: "c3hvvfmt"␊
      }␊
    }['blue'];`

> Snapshot 2

    '.c3hvvfmt{color:blue}'

## ternary

> Snapshot 1

    `import style9 from 'style9';␊
    const styles = {␊
      default: {␊
        color: "c3hvvfmt",␊
        opacity: "c1m62mnn"␊
      },␊
      red: {␊
        color: "c1-vpbjq"␊
      }␊
    };␊
    foo ? "c1-vpbjq " : "c3hvvfmt c1m62mnn ";`

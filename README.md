# GFM TOC Generator
Demo: [https://gfmtoc.relevant.space](https://gfmtoc.relevant.space)

* [What is this?](#what_is_this)
* [What does it do?](#what_does_it_do)
* [Known issues](#known_issues)
* [API](#use_api)

## <a name="what_is_this">What is this?</a>
A very specific use-case table of content generator for github flavoured markdown. It only supports unclosed atx-style headings at the moment.

## <a name="what_does_it_do">What does it do?</a>
GFMTOC uses [regex](https://xkcd.com/208/) to parse atx-style markdown headings in text. It skips h1 level headings, and looks for any anchor tags with name attribute to generate the links from. Markdown links/anchor tags without name tags will be rendered as text only instead of links. You can choose to hide any unlinked headings when generating the TOC.

## <a name="known_issues">Known issues</a>
- GFMTOC can't yet detect codeblocks, so any headers/hash comments inside codeblocks will be parsed as a heading and added to the TOC if they are placed in the beginning of the line.
- GFMTOC doesn't render heading inside lists in the table of content.

## <a name="use_api">Usage from API</a>

```js
const { generateGfmToc } = require('@not-dalia/gfm-toc');

const inText = '### <a name="foo">bar</a>';
const toc = generateGfmToc(inText, {includeUnlinked, createLinks});
// toc = array of toc lines:
// ['* [bar](#foo)']
console.log(toc.join('\n')); // join lines
```


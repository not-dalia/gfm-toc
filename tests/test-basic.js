const t = require('tap');
const expect = require('chai').expect;
const { generateGfmToc } = require('../generate');

t.test('Basic Test', t => {
    const out = generateGfmToc('### <a name="foo">bar</a>');

    expect(out).to.deep.equal([
        '* [bar](#foo)'
    ]);

    t.end();
});

t.test('Escaping Test', t => {
    const out = generateGfmToc('### <a name="foo">bar `baz`</a>');

    expect(out).to.deep.equal([
        '* [bar `baz`](#foo)'
    ]);

    t.end();
});

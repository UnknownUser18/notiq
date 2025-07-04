import { TestBed } from '@angular/core/testing';

import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service : MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const markdown = [
    '# Sybau',
    '### Blah',
    '####### Not a heading',
    ' # This is not a heading',
    'This is a paragraph with **bold** text, *italic* text, and ~~strikethrough~~ text.',
    'This is a paragraph with __underlined__ text and ==highlighted== text.',
    'This is a paragraph with `inline code`',
    '`<>i am not a inline code`',
    'This is a paragraph with `**inline** *code*`',
    '> This is a blockquote',
    '> This is a blockquote with **bold** text',
    `> This is a blockquote with
> multiple lines
>> and a nested blockquote`,
    `> This is another test of blockquotes
>> with multiple lines and a nested blockquote
>> ... you know, just to be sure
> And another line
>>> and another nested blockquote.`,
    `- This is an unordered list item`,
    `1. This is an ordered list item`,
    `- This is an unordered list item with a line break
- Another item in the same list`,
    `1. This is an ordered list item with a line break,
1. Another item in the same list`,
    `- This is an test of an unordered list,
- That has some line breaks
 + And a nested list`,
    `1. This is an test of an ordered list,
1. That has some line breaks
  1. And a nested list`,

    `+ This is an complicated list,
 + Yap Yap yap
- And a nested list
 1. With a nested ordered list
 2. and a dih
- And a nested ordered list`,

    `1. This is an complicated list,
1. Yap Yap yap
1. And a nested list
 1. With a nested ordered list
 1. And a dih`,
    `Some text...
+ This is an unordered list item
+ Another item in the same list
Blah blah blah
> This is a blockquote`,
  ]

  it('should convert h1 markdown to HTML', () => {
    const html = service.convertToHTML(markdown[0]);
    expect(html).toEqual(['<h1>Sybau</h1>']);
  });

  it('should convert h3 markdown to HTML', () => {
    const html = service.convertToHTML(markdown[1]);
    expect(html).toEqual(['<h3>Blah</h3>']);
  });

  it('should convert h7 markdown to HTML as paragraph', () => {
    const html = service.convertToHTML(markdown[2]);
    expect(html).toEqual(['<p>####### Not a heading</p>']);
  });

  it('should not convert non-heading markdown to HTML', () => {
    const html = service.convertToHTML(markdown[3]);
    expect(html).toEqual(['<p> # This is not a heading</p>']);
  });

  it('should convert paragraph with bold, italic, and strikethrough text to HTML', () => {
    const html = service.convertToHTML(markdown[4]);
    expect(html).toEqual(['<p>This is a paragraph with <b>bold</b> text, <i>italic</i> text, and <del>strikethrough</del> text.</p>']);
  });

  it('should convert paragraph with underlined and highlighted text to HTML', () => {
    const html = service.convertToHTML(markdown[5]);
    expect(html).toEqual(['<p>This is a paragraph with <u>underlined</u> text and <mark>highlighted</mark> text.</p>']);
  });

  it('should convert paragraph with inline code to HTML', () => {
    const html = service.convertToHTML(markdown[6]);
    expect(html).toEqual(['<p>This is a paragraph with <code>inline code</code></p>']);
  });

  it('should ignore non-markdown inline code', () => {
    const html = service.convertToHTML(markdown[7]);
    expect(html).toEqual(['<p>`<>i am not a inline code`</p>']);
  })

  it('should convert paragraph with inline code containing markdown to HTML', () => {
    const html = service.convertToHTML(markdown[8]);
    expect(html).toEqual(['<p>This is a paragraph with <code>**inline** *code*</code></p>']);
  });

  it('should convert blockquote to HTML', () => {
    const html = service.convertToHTML(markdown[9]);
    expect(html).toEqual(['<blockquote><p>This is a blockquote</p></blockquote>']);
  });

  it('should convert blockquote with bold text to HTML', () => {
    const html = service.convertToHTML(markdown[10]);
    expect(html).toEqual(['<blockquote><p>This is a blockquote with <b>bold</b> text</p></blockquote>']);
  });

  it('should convert nested blockquote with inline code to HTML', () => {
    const html = service.convertToHTML(markdown[11]);
    expect(html).toEqual([
      '<blockquote><p>This is a blockquote with</p>',
      '<p>multiple lines</p>',
      '<blockquote><p>and a nested blockquote</p></blockquote></blockquote>'
    ]);
  });

  it('should convert complex nested blockquotes to HTML', () => {
    const html = service.convertToHTML(markdown[12]);
    expect(html).toEqual([
      '<blockquote><p>This is another test of blockquotes</p>',
      '<blockquote><p>with multiple lines and a nested blockquote</p>',
      '<p>... you know, just to be sure</p></blockquote>',
      '<p>And another line</p>',
      '<blockquote><blockquote><p>and another nested blockquote.</p></blockquote></blockquote></blockquote>'
    ]);
  });

  it('should convert unordered list item to HTML', () => {
    const html = service.convertToHTML(markdown[13]);
    expect(html).toEqual(['<ul><li>This is an unordered list item</li></ul>']);
  });

  it('should convert ordered list item to HTML', () => {
    const html = service.convertToHTML(markdown[14]);
    expect(html).toEqual(['<ol><li>This is an ordered list item</li></ol>']);
  });

  it('should convert unordered list with line break to HTML', () => {
    const html = service.convertToHTML(markdown[15]);
    expect(html).toEqual([
      '<ul><li>This is an unordered list item with a line break</li>',
      '<li>Another item in the same list</li></ul>'
    ]);
  });

  it('should convert ordered list with line break to HTML', () => {
    const html = service.convertToHTML(markdown[16]);
    expect(html).toEqual([
      '<ol><li>This is an ordered list item with a line break,</li>',
      '<li>Another item in the same list</li></ol>'
    ]);
  });

  it('should convert unordered list with nested list to HTML', () => {
    const html = service.convertToHTML(markdown[17]);
    expect(html).toEqual([
      '<ul><li>This is an test of an unordered list,</li>',
      '<li>That has some line breaks',
      '<ul><li>And a nested list</li></ul></li></ul>'
    ]);
  });

  it('should convert ordered list with nested list to HTML', () => {
    const html = service.convertToHTML(markdown[19]);
    expect(html).toEqual([
      '<ul><li>This is an complicated list,',
      '<ul><li>Yap Yap yap</li></ul>',
      '<li>And a nested list',
      '<ol><li>With a nested ordered list</li>',
      '<li>and a dih</li></ol></li>',
      '<li>And a nested ordered list</li></ul>',
    ]);
  });

  it('should convert ordered list with nested list to HTML', () => {
    const html = service.convertToHTML(markdown[20]);
    expect(html).toEqual([
      '<ol><li>This is an complicated list,</li>',
      '<li>Yap Yap yap</li>',
      '<li>And a nested list',
      '<ol><li>With a nested ordered list</li>',
      '<li>And a dih</li></ol></li></ol>'
    ]);
  });

  it('should handle mixed content', () => {
    const html = service.convertToHTML(markdown[21]);
    console.log(html)
    expect(html).toEqual([
      '<p>Some text...</p>',
      '<ul><li>This is an unordered list item</li>',
      '<li>Another item in the same list</li></ul>',
      '<p>Blah blah blah</p>',
      '<blockquote><p>This is a blockquote</p></blockquote>'
    ]);
  })
});

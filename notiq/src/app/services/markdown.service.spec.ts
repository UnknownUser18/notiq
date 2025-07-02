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
  })
});

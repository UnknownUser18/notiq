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
    'This is a paragraph with `inline code`'
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
});

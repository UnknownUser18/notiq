import { TestBed } from '@angular/core/testing';

import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  let markdown = '**Code**: `console.**log**("Hello, World!")`';
  it('should convert markdown to HTML', () => {
    const html = service.convertToHTML(markdown);
    expect(html).toEqual(['<p><b>Code</b>: <code>console.**log**("Hello, World!")</code></p>']);
  })
});

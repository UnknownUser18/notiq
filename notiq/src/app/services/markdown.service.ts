import { Injectable } from '@angular/core';

type markdownLinetype = 'blockquote' | 'unordered-list' | 'ordered-list';


@Injectable({
  providedIn : 'root'
})
export class MarkdownService {

  // This array will hold the HTML elements to be returned, with the correct nesting level
  private list : Array<[markdownLinetype, number]> = [];

  constructor() {
  }

  private getLineType(line : string) : markdownLinetype | undefined {
    if (line.startsWith('>')) return 'blockquote';
    if (line.match(/^\s*[-*+]\s+/)) return 'unordered-list';
    if (line.match(/^\s*\d+\.\s+/)) return 'ordered-list';
    return undefined;
  }

  private convertLineToHTML(line : string) : string {
    const codeBlocks : string[] = [];
    let htmlLine = line.replace(/`\\?[^<>`]+`/, (match) => {
      codeBlocks.push(match.replace(/`/g, ''));
      return `||CODE_BLOCK_${ codeBlocks.length - 1 }||`;
    });

    htmlLine = htmlLine.replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
    htmlLine = htmlLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    htmlLine = htmlLine.replace(/\*(.*?)\*/g, '<i>$1</i>');
    htmlLine = htmlLine.replace(/~~(.*?)~~/g, '<del>$1</del>');
    htmlLine = htmlLine.replace(/__(.*?)__/g, '<u>$1</u>');
    htmlLine = htmlLine.replace(/==(.*?)==/g, '<mark>$1</mark>');
    htmlLine = htmlLine.replace(/^\s*>\s*(.*)/g, '<blockquote>$1</blockquote>');
    htmlLine = htmlLine.replace(/!\[(.*?)]\((.*?)\)/g, '<img alt="$1" src="$2">');
    htmlLine = htmlLine.replace(/\[(.*?)]\((.*?)\)/g, '<a href="$2">$1</a>');

    htmlLine = htmlLine.replace(/\|\|CODE_BLOCK_(\d+)\|\|/g, (_match, idx) => {
      return `<code>${ codeBlocks[Number(idx)] }</code>`;
    });
    return `<p>${ htmlLine.trimEnd() }</p>`;
  }

  private typeToHTML(line : string, type : markdownLinetype, previousLine? : string, nextLine? : string) : string {

    // Function to replace <p\> tags with <li\> tags for unordered and ordered lists
    function replaceParagraphTags(html : string) : string {
      return html.replace('<p>', '<li>').replace('</p>', '</li>');
    }

    const map : { [key in markdownLinetype] : [RegExp, RegExp, string] } = {
      'blockquote' : [/^>+/, /^>.*?\s/, 'blockquote'],
      'unordered-list' : [/^\s*[-*+]\s+/, /^\s*[-*+]\s+/, 'ul'],
      'ordered-list' : [/^\s*\d+\.\s+/, /^\s*\d+\.\s+/, 'ol']
    }


    const [, contentRegex, HTMLElement] = map[type] ?? (() => {
      throw new Error(`Unknown markdown type: ${ type }`);
    });

    const contentReplaced = this.convertLineToHTML(line.replace(contentRegex, ''));
    const content = type === 'blockquote' ? contentReplaced : replaceParagraphTags(contentReplaced);
    // First we check if the next line is also a desired type
    if (nextLine) {
      if (type === 'blockquote') {
        const next = nextLine.match(/^>+/)?.[0].length || 0;
        const curr = line.match(/^>+/)?.[0].length || 0;
        const prev = previousLine?.match(/^>+/)?.[0].length || 0;

        /*
        If the current line is deeper nested than the previous line, we must open a new element
        If the current line is the same nesting level as the next line, we can continue the element normally.
        If the current line is deeper nested than the next line, we must close the element
         */

        if (curr > prev) return `<${ HTMLElement }>${ content }`;
        if (curr === next || curr < next) return content;
        if (curr > next) return `${ content }</${ HTMLElement }>`;

        throw new Error(`No matches found for ${ HTMLElement } at nesting level ${ curr }`);
      }

      const next = nextLine.match(/^\s*/)![0].length + 1 || 0
      const curr = line.match(/^\s*/)![0].length + 1 || 0;
      const prev = previousLine ? previousLine.match(/^\s*/)![0].length + 1 : undefined; // Undefined if no previous line

      if (!nextLine.match('^\\s*[-*+]|^\\s*\\d+\\.')) {
        const last = this.list.pop();
        let endTags;
        if (!last) {
          endTags = `</${ HTMLElement }>`.repeat(curr);
        } else {
          const last = this.list.pop()!;
          const element = map[last[0]][2];
          const elements = `</${ element }></li>`.repeat(last[1]);
          endTags = `${ elements }</${ HTMLElement }>`;
        }
        return `${ content }${ endTags }`;
      }

      if (prev === undefined || !previousLine?.match('^\\s*[-*+]|^\\s*\\d+\\.')) {
        // If there is no previous line (first line), we return with the start tag and potentially without the end tag
        if (curr === next) return `<${ HTMLElement }>${ content }`;
        if (curr < next) return `<${ HTMLElement }>${ content.replace('</li>', '') }` // No end tag needed, because next line is deeper nested

        throw new Error(`No matches found for ${ HTMLElement } at nesting level ${ curr }`);
      }

      if (curr > prev) {
        if (curr === next)
          return `<${ HTMLElement }>${ content }`;
        else if (curr > next)
          return `<${ HTMLElement }>${ content }</${ HTMLElement }>`; // This scenario is only possible, when there's only one item in the sublist

        throw new Error(`No matches found for ${ HTMLElement } at nesting level ${ curr }`);
      }

      if (curr === next) return content;

      if (curr < next) {
        // This means that the next line is deeper nested than the current line
        // So we must store the information about the line, that it hasn't been closed yet
        // And later add back the end tag when the next line is shallower nested

        this.list.push([this.getLineType(nextLine)!, curr]);
        return content.replace('</li>', '');
      }

      if (curr > next) {
        // This means that the next line is shallower nested than the current line
        // So we must close the element and return the content

        const last = this.list.pop();
        if (!last) throw new Error(`No previous list item found for ${ HTMLElement } at nesting level ${ curr }`);

        const element = map[last[0]][2];
        const elements = `</${ element }></li>`.repeat(last[1]);

        return `${ content }${ elements }`;
      }

      throw new Error(`No matches found for ${ HTMLElement } at nesting level ${ curr }`);
    }

    let prev : number, curr : number;

    if (type === 'blockquote') {
      prev = previousLine?.match(/^>+/)?.[0]?.length || 0;
      curr = line.match(/^>+/)?.[0]?.length || 0;
    } else {
      // +1 to account for the leading space in lists
      prev = previousLine ? previousLine.match(/^\s*/)![0].length + 1 : 0;
      curr = line ? line.match(/^\s*/)![0].length + 1 : 0;
    }

    const startTags = `<${ HTMLElement }>`.repeat(Math.max(curr - prev, 0));
    let endTags;
    if (type === 'blockquote' || this.list.length === 0)
      endTags = `</${ HTMLElement }>`.repeat(curr);
    else {
      const last = this.list.pop()!;
      const element = map[last[0]][2];
      const elements = `</${ element }></li>`.repeat(last[1]);
      endTags = `${ elements }</${ HTMLElement }>`;
    }

    return `${ startTags }${ content }${ endTags }`;
  }


  public convertToHTML(markdown : string) : string[] {
    const lines = markdown.split('\n');
    const result = lines.map((line, index) => {
      const nextLine = lines[index + 1];
      const previousLine = lines[index - 1];

      if (line.startsWith('#')) {
        const headingLevel = line.match(/^#+/)![0].length;

        if (headingLevel > 6)
          return this.convertLineToHTML(line);

        return `<h${ headingLevel }>${ line.slice(headingLevel).trim() }</h${ headingLevel }>`;

      } else if (line.startsWith('>')) {
        return this.typeToHTML(line, 'blockquote', previousLine, nextLine);

      } else if (line.match(/^\s*[-*+]\s+/)) {
        return this.typeToHTML(line, 'unordered-list', previousLine, nextLine);

      } else if (line.match(/^\s*\d+\.\s+/)) {
        return this.typeToHTML(line, 'ordered-list', previousLine, nextLine);

      }

      return this.convertLineToHTML(line);
    });

    this.list = []; // Reset the list after processing all lines
    return result;
  }
}

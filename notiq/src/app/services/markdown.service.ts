import { Injectable } from '@angular/core';

@Injectable({
  providedIn : 'root'
})
export class MarkdownService {

  constructor() {
  }

  private convertLineToHTML(line : string) : string {
    const codeBlocks : string[] = [];
    let htmlLine = line.replace(/`\\?[^<>`]+`/, (match) => {
      codeBlocks.push(match.replace(/`/g, ''));
      return `[[CODE_BLOCK_${ codeBlocks.length - 1 }]]`;
    });

    htmlLine = htmlLine.replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
    htmlLine = htmlLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    htmlLine = htmlLine.replace(/\*(.*?)\*/g, '<i>$1</i>');
    htmlLine = htmlLine.replace(/~~(.*?)~~/g, '<del>$1</del>');
    htmlLine = htmlLine.replace(/__(.*?)__/g, '<u>$1</u>');
    htmlLine = htmlLine.replace(/==(.*?)==/g, '<mark>$1</mark>');
    htmlLine = htmlLine.replace(/^\s*>\s*(.*)/g, '<blockquote>$1</blockquote>');

    htmlLine = htmlLine.replace(/\[\[CODE_BLOCK_(\d+)]]/g, (_match, idx) => {
      return `<code>${ codeBlocks[Number(idx)] }</code>`;
    });
    return `<p>${ htmlLine.trimEnd() }</p>`;
  }

  private blockquoteToHTML(line : string, previousLine? : string, nextLine? : string) : string {
    const blockquoteContent = line.replace(/^>.*?\s/, '');

    // First we check if the next line is also a blockquote
    if (nextLine && nextLine.startsWith('>')) {

      // Then we check if the previous line is also a blockquote
      if (previousLine && previousLine.startsWith('>')) {

        // Now we must determine the nesting level of the blockquote
        const nextNested = nextLine.match(/^>+/)?.[0].length || 0;
        const currentNested = line.match(/^>+/)?.[0].length || 0;
        const previousNested = previousLine.match(/^>+/)?.[0].length || 0;

        // If the current line is deeper nested than the previous line, we must open a new blockquote
        if (currentNested > previousNested) {
          return `<blockquote>${ this.convertLineToHTML(blockquoteContent) }`;
        }

        // If the current line is the same nesting level as the next line, we can continue the blockquote normally.
        if (currentNested === nextNested || currentNested < nextNested) {
          return this.convertLineToHTML(blockquoteContent);

        } else if (currentNested > nextNested) { // If the current line is deeper nested than the next line, we must close the blockquote
          return `${ this.convertLineToHTML(blockquoteContent) }</blockquote>`;
        }
      } else {
        // If the previous line is not a blockquote, it means we are starting a new blockquote
        return `<blockquote>${ this.convertLineToHTML(blockquoteContent) }`;
      }
    } else if (previousLine && previousLine.startsWith('>')) { // If the next line is not a blockquote, we must check if the previous line is a blockquote
      const prev = (previousLine.match(/^>+/) || [''])[0].length;
      const curr = (line.match(/^>+/) || [''])[0].length;
      const startTags = '<blockquote>'.repeat(curr - prev);
      const endTags = '</blockquote>'.repeat(curr);
      return `${ startTags }${ this.convertLineToHTML(blockquoteContent) }${ endTags }`;
    }

    // If the previous line is not a blockquote, it means it's only a single blockquote line
    return `<blockquote>${ this.convertLineToHTML(blockquoteContent) }</blockquote>`;
  }


  public convertToHTML(markdown : string) : string[] {
    const lines = markdown.split('\n');
    return lines.map((line, index) => {
      const nextLine = lines[index + 1];
      const previousLine = lines[index - 1];

      if (line.startsWith('#')) {
        const headingLevel = line.match(/^#+/)![0].length;

        if (headingLevel > 6)
          return this.convertLineToHTML(line);

        return `<h${ headingLevel }>${ line.slice(headingLevel).trim() }</h${ headingLevel }>`;
      } else if (line.startsWith('>')) {
        return this.blockquoteToHTML(line, previousLine, nextLine);
      }

      return this.convertLineToHTML(line);
    });
  }
}

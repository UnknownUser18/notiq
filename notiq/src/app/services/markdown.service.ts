import { Injectable } from '@angular/core';

@Injectable({
  providedIn : 'root'
})
export class MarkdownService {

  constructor() {
  }


  public convertToHTML(markdown : string) : string[] {
    const lines = markdown.split('\n');
    return lines.map(line => {
      if (line.startsWith('#')) {
        const headingLevel = line.match(/^#+/)!;

        if (headingLevel[0].length > 6)
          return `<p>${ line.trimEnd() }</p>`;

        return `<h${ headingLevel[0].length }>${ line.slice(headingLevel[0].length).trim() }</h${ headingLevel[0].length }>`;
      }

      const codeBlocks: string[] = [];
      let htmlLine = line.replace(/`([^`]+)`/g, (match, p1) => {
        codeBlocks.push(p1);
        return `__CODE_BLOCK_${ codeBlocks.length - 1 }__`;
      });

      htmlLine = htmlLine.replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
      htmlLine = htmlLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      htmlLine = htmlLine.replace(/\*(.*?)\*/g, '<i>$1</i>');
      htmlLine = htmlLine.replace(/~~(.*?)~~/g, '<del>$1</del>');

      htmlLine = htmlLine.replace(/__CODE_BLOCK_(\d+)__/g, (match, idx) => {
        return `<code>${ codeBlocks[ Number(idx) ] }</code>`;
      });

      return `<p>${ htmlLine.trimEnd() }</p>`;
    });
  }
}

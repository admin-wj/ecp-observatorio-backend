import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  ImageRun,
  Packer,
  AlignmentType,
  convertInchesToTwip,
  ITableBordersOptions,
} from 'docx';
import { JSDOM } from 'jsdom';

type Element =
  | HTMLElement
  | HTMLBodyElement
  | HTMLDivElement
  | HTMLBRElement
  | HTMLHeadingElement;

export const generateWord = async (htmlContent: string) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 24,
            color: '000000',
          },
          paragraph: {
            spacing: { after: 200, line: 276 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 48,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 32,
            bold: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 28,
            bold: true,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: await processElements(document.body),
      },
    ],
  });

  return await Packer.toBuffer(doc);
};

async function processElements(parent: Element): Promise<any[]> {
  const elements: any[] = [];

  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === 3 && node.textContent?.trim()) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: node.textContent.trim() })],
        }),
      );
      continue;
    } else if (node.nodeType === 8) {
      continue;
    }

    const element = node as Element;
    if (!element?.getAttribute) {
      continue;
    }
    const style = element?.getAttribute('style') || '';
    const backgroundColor = style.match(
      /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
    )?.[1];
    const color = style.match(
      /(?:^|;)\s*color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
    )?.[1];
    const padding = style.match(/padding:\s*(\d+)px/)?.[1];
    const textAlign = style.match(/text-align:\s*([a-zA-Z]+)/)?.[1];

    switch (element?.tagName?.toLowerCase()) {
      case 'h1':
        elements.push(
          new Paragraph({
            style: 'Heading1',
            children: [
              new TextRun({
                text: element?.textContent || '',
                color: convertColor(color || ''),
              }),
            ],
          }),
        );
        break;

      case 'h2':
        elements.push(
          new Paragraph({
            style: 'Heading2',
            children: [
              new TextRun({
                text: element?.textContent || '',
                color: convertColor(color || ''),
              }),
            ],
          }),
        );
        break;

      case 'h3':
        elements.push(
          new Paragraph({
            style: 'Heading3',
            children: [
              new TextRun({
                text: element?.textContent || '',
                color: convertColor(color || ''),
              }),
            ],
          }),
        );
        break;

      case 'p':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: element?.textContent || '',
                bold:
                  element?.hasAttribute('bold') ||
                  style.includes('font-weight: bold'),
                italics:
                  element?.hasAttribute('italic') ||
                  style.includes('font-style: italic'),
                color: convertColor(color || ''),
              }),
            ],
            alignment: getAlignment(textAlign),
          }),
        );
        break;

      case 'table':
        const rows = Array.from(element?.querySelectorAll('tr'));
        const tableElement = new Table({
          width: { size: 100, type: 'pct' },
          borders: getBorders(),
          rows: rows.map((row) => {
            const rowStyle = row.getAttribute('style') || '';
            const rowBgColor = rowStyle.match(
              /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
            )?.[1];
            const rowColor = rowStyle.match(
              /(?:^|;)\s*color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
            )?.[1];

            const cells = Array.from(row.querySelectorAll('td, th'));
            return new TableRow({
              children: cells.map((cell) => {
                const cellStyle = cell.getAttribute('style') || '';
                const cellBgColor =
                  cellStyle.match(
                    /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                  )?.[1] || rowBgColor;
                const cellColor =
                  cellStyle.match(
                    /(?:^|;)\s*color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                  )?.[1] || rowColor;
                const cellPadding = cellStyle.match(/padding:\s*(\d+)/)?.[1];
                const textAlign = cellStyle.match(
                  /text-align:\s*([a-zA-Z]+)/,
                )?.[1];

                const cellChildren = Array.from(cell.children);

                if (
                  cellChildren.length &&
                  cellChildren[0].tagName &&
                  cellChildren[0].tagName.toLowerCase() === 'div' &&
                  cellChildren[0]
                    .getAttribute('style')
                    ?.includes('border:1px solid #ccc') // Detect progress bar "outer" div
                ) {
                  const barDivs = Array.from(cellChildren[0].children);
                  let percentText = '';
                  let bgColor = '';
                  // Find correct inner divs
                  for (const div of barDivs as HTMLElement[]) {
                    const style = div.getAttribute('style') || '';
                    if (style.includes('position:absolute')) {
                      percentText = div.textContent?.trim() || '';
                    } else if (style.includes('background-color')) {
                      // Will look like ...backgroundColor: barColor,
                      bgColor =
                        style.match(
                          /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                        )?.[1] || '';
                    }
                  }

                  return new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: percentText,
                            bold: true,
                            color: '000000',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        shading: bgColor
                          ? { fill: convertColor(bgColor) }
                          : undefined,
                      }),
                    ],
                    shading: bgColor
                      ? { fill: convertColor(bgColor) }
                      : undefined,
                    verticalAlign: 'center',
                  });
                }

                if (
                  Array.from(cell.children).length === 1 &&
                  (cell.children[0] as HTMLElement)
                    ?.getAttribute('style')
                    ?.includes('flex')
                ) {
                  const flexDiv = cell.children[0];
                  const sentimentDivs = Array.from(flexDiv.children);

                  // Render the colored boxes side by side
                  return new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          ...sentimentDivs.map((div, idx) => {
                            const txt = div.textContent || '';
                            const divStyle = div.getAttribute('style') || '';
                            const bgColor = divStyle.match(
                              /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                            )?.[1];
                            const fColor = divStyle.match(
                              /(?:^|;)\s*color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                            )?.[1];

                            return new TextRun({
                              text: (idx > 0 ? '   ' : '') + txt, // separate with space
                              color: convertColor(fColor || ''),
                              bold: true,
                              shading: bgColor
                                ? { fill: convertColor(bgColor) }
                                : undefined,
                            });
                          }),
                        ],
                        alignment: getAlignment(textAlign) ?? 'center',
                      }),
                    ],
                    shading: cellBgColor
                      ? { fill: convertColor(cellBgColor) }
                      : undefined,
                    verticalAlign: 'center',
                    margins: cellPadding
                      ? {
                          top: parseInt(cellPadding, 10) * 10,
                          bottom: parseInt(cellPadding, 10) * 10,
                          left: parseInt(cellPadding, 10) * 10,
                          right: parseInt(cellPadding, 10) * 10,
                        }
                      : undefined,
                  });
                }

                // Otherwise, default cell handling
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cell.textContent || '',
                          bold: cell.tagName.toLowerCase() === 'th',
                          color: convertColor(cellColor || ''),
                        }),
                      ],
                      alignment: getAlignment(textAlign),
                      shading: cellBgColor
                        ? { fill: convertColor(cellBgColor) }
                        : undefined,
                    }),
                  ],
                  verticalAlign: 'center',
                  margins: cellPadding
                    ? {
                        top: parseInt(cellPadding, 10) * 10,
                        bottom: parseInt(cellPadding, 10) * 10,
                        left: parseInt(cellPadding, 10) * 10,
                        right: parseInt(cellPadding, 10) * 10,
                      }
                    : undefined,
                  shading: cellBgColor
                    ? { fill: convertColor(cellBgColor) }
                    : undefined,
                });
              }),
            });
          }),
        });
        elements.push(tableElement);
        break;

      case 'img':
        try {
          const src = element?.getAttribute('src');
          if (src?.startsWith('data:image')) {
            const base64Data = src.split(',')[1];
            elements.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: Buffer.from(base64Data, 'base64'),
                    type: 'png',
                    transformation: {
                      width: 600,
                      height: 300,
                    },
                  }),
                ],
                alignment: getAlignment(textAlign),
              }),
            );
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
        break;

      case 'div':
        // Detect flex row layout
        if (
          style.includes('display:flex') &&
          style.includes('flex-direction:row')
        ) {
          // Treat children as columns in a table row
          const childrenDivs = Array.from(element?.children);
          const tableRow = new TableRow({
            children: await Promise.all(
              childrenDivs.map(async (child) => {
                const childStyle = child.getAttribute('style') || '';
                const cellBgColor = childStyle.match(
                  /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
                )?.[1];
                const cellPadding = childStyle.match(/padding:\s*(\d+)/)?.[1];
                return new TableCell({
                  children: await processElements(child as Element),
                  shading: cellBgColor
                    ? { fill: convertColor(cellBgColor) }
                    : undefined,
                  margins: cellPadding
                    ? {
                        top: parseInt(cellPadding, 10) * 10,
                        bottom: parseInt(cellPadding, 10) * 10,
                        left: parseInt(cellPadding, 10) * 10,
                        right: parseInt(cellPadding, 10) * 10,
                      }
                    : undefined,
                });
              }),
            ),
          });
          elements.push(
            new Table({
              rows: [tableRow],
              width: { size: 100, type: 'pct' },
              borders: getBorders(),
            }),
          );
        } else {
          const childElements = !!element?.getAttribute
            ? await processElements(element)
            : [];
          if (backgroundColor || padding) {
            elements.push(
              new Paragraph({
                children: [new TextRun({ text: '' })],
                spacing: {
                  before: padding ? parseInt(padding, 10) * 10 : 120,
                  after: padding ? parseInt(padding, 10) * 10 : 120,
                },
                shading: backgroundColor
                  ? { fill: convertColor(backgroundColor) }
                  : undefined,
              }),
            );
          }
          elements.push(...childElements);
        }
        break;

      case 'b':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: element?.textContent || '',
                bold: true,
                color: convertColor(color || ''),
                size: style.match(/font-size:\s*(\d+)px/)?.[1]
                  ? parseInt(style.match(/font-size:\s*(\d+)px/)![1], 10) * 2
                  : undefined,
              }),
            ],
          }),
        );
        break;

      case 'h4':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: element?.textContent || '',
                bold: true,
                size: 28,
              }),
            ],
          }),
        );
        break;

      case 'header':
        // Get header background color
        const headerBgColor =
          style.match(
            /background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/,
          )?.[1] || '#a492da';

        // Find all <img> elements inside the header
        const imgElements = Array.from(element.querySelectorAll('img'));
        let ecoLogoRun: ImageRun | null = null;
        let oceanaLogoRun: ImageRun | null = null;
        if (imgElements.length >= 2) {
          const ecoImg = imgElements[0];
          const oceanaImg = imgElements[1];
          const ecoSrc = ecoImg.getAttribute('src');
          const oceanaSrc = oceanaImg.getAttribute('src');
          if (ecoSrc?.startsWith('data:image')) {
            ecoLogoRun = new ImageRun({
              data: Buffer.from(ecoSrc.split(',')[1], 'base64'),
              type: 'png',
              transformation: { width: 128, height: 48 },
            });
          }
          if (oceanaSrc?.startsWith('data:image')) {
            oceanaLogoRun = new ImageRun({
              data: Buffer.from(oceanaSrc.split(',')[1], 'base64'),
              type: 'png',
              transformation: { width: 176, height: 48 },
            });
          }
        }

        // Table row for header
        elements.push(
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Observatorio Corporativo',
                            bold: true,
                            color: 'FFFFFF',
                            size: 45,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: 'center',
                    shading: { fill: convertColor(headerBgColor) },
                    width: { size: 30, type: 'pct' },
                    borders: {
                      right: {
                        style: BorderStyle.SINGLE,
                        color: convertColor(headerBgColor),
                      },
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: ecoLogoRun ? [ecoLogoRun] : [],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: 'center',
                    shading: { fill: convertColor(headerBgColor) },
                    width: { size: 35, type: 'pct' },
                    borders: {
                      left: {
                        style: BorderStyle.SINGLE,
                        color: convertColor(headerBgColor),
                      },
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: oceanaLogoRun ? [oceanaLogoRun] : [],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: 'center',
                    shading: { fill: convertColor(headerBgColor) },
                    width: { size: 35, type: 'pct' },
                  }),
                ],
              }),
            ],
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
          }),
        );
        break;

      default:
        if ('children' in node && (node as any).children.length > 0) {
          elements.push(...(await processElements(node as Element)));
        }
        break;
    }
  }

  return elements;
}

function getAlignment(textAlign?: string) {
  switch (textAlign) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}

function getBorders(): ITableBordersOptions {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  };
}

function convertColor(color: string): string {
  if (color.startsWith('#')) {
    return color.substring(1);
  }
  // Mapa de colores comunes
  const colorMap: Record<string, string> = {
    whitesmoke: 'F5F5F5',
    white: 'FFFFFF',
    black: '000000',
  };
  return colorMap[color.toLowerCase()] || '000000';
}

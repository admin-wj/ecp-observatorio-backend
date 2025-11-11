import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent: string) => {
  const browser =
    await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
    args: [
      "--no-sandbox",
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();

  const styledHtmlContent = `
    <style>
      body {
        background-color: #FFFFFF;
        margin: 0;
        padding: 0;
        font-family: sans-serif;
      }
      @media print {
        table {
          width: 100%;
          table-layout: auto;
        }
      }
    </style>
    ${htmlContent}
  `;

  await page.setContent(styledHtmlContent, { waitUntil: 'networkidle0' });

  const { width, height } = await page.evaluate(() => {
    const body = document.body;
    return {
      width: Math.max(
        body.scrollWidth,
        body.offsetWidth,
        body.clientWidth,
        body.clientWidth,
      ),
      height: 11,
    };
  });

  const pdfBuffer = await page.pdf({
    width: `${width + 50}px`,
    height: `${height}in`,
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in',
    },
  });
  await browser.close();
  return Buffer.from(pdfBuffer);
};

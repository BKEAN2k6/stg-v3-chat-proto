import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {type Request, type Response} from 'express';
import PDFDocument from 'pdfkit';
import svgToPdf from 'svg-to-pdfkit';
import {type StrengthSlug} from '../../client/ApiTypes.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDirectory = path.join(dirname, '../../../assets');

type PaperSize = 'A4' | 'Letter';

type GenerateDiplomaRequest = {
  studentName: string;
  date: string;
  selectedStrengths: Array<{
    slug: StrengthSlug;
    title: string;
    color: string;
    borderColor: string;
  }>;
  translations: {
    strengthDiploma: string;
    diplomaAwardedTo: string;
    forUsingStrengths: string;
    signature: string;
    date: string;
  };
  paperSize: PaperSize;
  signatureName?: string;
  dateFormat?: 'DMY' | 'MDY' | 'YMD';
};

const formatDateForDisplay = (
  value: string,
  formatOption: 'DMY' | 'MDY' | 'YMD',
): string => {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return value;
  }

  const dateValue = new Date(year, month - 1, day);
  if (Number.isNaN(dateValue.getTime())) return value;

  const displayDay = String(dateValue.getDate()).padStart(2, '0');
  const displayMonth = String(dateValue.getMonth() + 1).padStart(2, '0');
  const displayYear = String(dateValue.getFullYear());

  switch (formatOption) {
    case 'DMY': {
      return `${displayDay}.${displayMonth}.${displayYear}`;
    }

    case 'MDY': {
      return `${displayMonth}/${displayDay}/${displayYear}`;
    }

    case 'YMD': {
      return `${displayYear}-${displayMonth}-${displayDay}`;
    }
  }
};

export const generateStrengthDiploma = async (
  request: Request<unknown, unknown, GenerateDiplomaRequest>,
  response: Response,
) => {
  const {
    studentName,
    date,
    selectedStrengths,
    translations,
    paperSize,
    signatureName,
    dateFormat = 'DMY',
  } = request.body;

  const isA4 = paperSize === 'A4';
  const width = isA4 ? 841.89 : 792;
  const height = isA4 ? 595.28 : 612;

  const formattedDate = formatDateForDisplay(date, dateFormat);

  const document = new PDFDocument({
    size: [width, height], // Landscape
    margin: 0,
    autoFirstPage: true,
    info: {
      Producer: 'See The Good!',
      Creator: 'See The Good!',
    },
  });

  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="strength-diploma.pdf"`,
  );

  document.pipe(response);

  const fontPath = path.join(assetsDirectory, 'fonts/LuckiestGuy-Regular.ttf');
  document.registerFont('LuckiestGuy', fontPath);

  const purpleColor = '#7c5cdb';
  const textColor = '#333333';
  const mutedTextColor = '#4a4a4a';

  const pageMargin = 20;
  const drawWidth = width - pageMargin * 2;
  const drawHeight = height - pageMargin * 2;
  const drawX = pageMargin;
  const drawY = pageMargin;
  const borderWidth = width * 0.028;
  const outerRadius = width * 0.024;

  document
    .roundedRect(drawX, drawY, drawWidth, drawHeight, outerRadius)
    .fill(purpleColor);

  const innerX = drawX + borderWidth;
  const innerY = drawY + borderWidth;
  const innerWidth = drawWidth - borderWidth * 2;
  const innerHeight = drawHeight - borderWidth * 2;
  const innerRadius = width * 0.006;

  document
    .roundedRect(innerX, innerY, innerWidth, innerHeight, innerRadius)
    .fill('white');

  const strengthColors = [
    '#ef7570',
    '#fdd662',
    '#4d97b5',
    '#3ab5a1',
    '#a5d7d5',
  ];

  const drawBubbleShape = (drawFunction: () => void, color: string) => {
    document.save();
    document.lineWidth(1);
    document.strokeColor(color);
    document.fillColor(color);
    document.fillOpacity(0.2);

    drawFunction();

    document.fillAndStroke();
    document.restore();
  };

  const drawStar = ({
    cx,
    cy,
    spikes,
    outerRadius,
    innerRadius,
    color,
  }: {
    cx: number;
    cy: number;
    spikes: number;
    outerRadius: number;
    innerRadius: number;
    color: string;
  }) => {
    drawBubbleShape(() => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      document.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        document.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        document.lineTo(x, y);
        rot += step;
      }

      document.lineTo(cx, cy - outerRadius);
      document.closePath();
    }, color);
  };

  const drawCircle = (
    cx: number,
    cy: number,
    radius: number,
    color: string,
  ) => {
    drawBubbleShape(() => {
      document.circle(cx, cy, radius);
    }, color);
  };

  type Bubble = {
    x: number;
    y: number;
    size: number;
    color: string;
    type: 'star' | 'circle';
  };

  const bottomBubbles: Bubble[] = [];
  const sideBubbles: Bubble[] = [];

  const addBubble = (x: number, y: number, size: number, color: string) => {
    const type = Math.random() > 0.7 ? 'star' : 'circle';
    const bubble: Bubble = {x, y, size, color, type};

    if (y > innerY + innerHeight * 0.8) {
      bottomBubbles.push(bubble);
    } else {
      sideBubbles.push(bubble);
    }
  };

  const bubbleCount = 55;

  for (let i = 0; i < bubbleCount; i++) {
    const side = Math.random();
    const isLeft = side < 0.5;

    const relativeY = Math.random() ** 0.4;
    const y = innerY + relativeY * innerHeight;
    const power = 2.5;
    const maxReach = innerWidth * 0.3;
    const xDistribution = maxReach * Math.random() ** power;

    const x = isLeft
      ? innerX + xDistribution
      : innerX + innerWidth - xDistribution;

    const color =
      strengthColors[Math.floor(Math.random() * strengthColors.length)];
    const size = 7 + Math.random() * 12;

    addBubble(x, y, size, color);
  }

  for (let i = 0; i < 8; i++) {
    const y = innerY + Math.random() * (innerHeight * 0.3);
    const rightBandWidth = 60;
    const xOffset = Math.random() * rightBandWidth;
    const x = innerX + innerWidth - 5 - xOffset;

    const color =
      strengthColors[Math.floor(Math.random() * strengthColors.length)];
    const size = 6 + Math.random() * 10;

    addBubble(x, y, size, color);
  }

  for (let i = 0; i < 3; i++) {
    const y = innerY + Math.random() * (innerHeight * 0.3);
    const leftBandWidth = 60;
    const xOffset = Math.random() * leftBandWidth;
    const x = innerX + 5 + xOffset;

    const color =
      strengthColors[Math.floor(Math.random() * strengthColors.length)];
    const size = 6 + Math.random() * 10;

    addBubble(x, y, size, color);
  }

  const drawBubbles = (bubbles: Bubble[]) => {
    for (const b of bubbles) {
      if (b.type === 'star') {
        drawStar({
          cx: b.x,
          cy: b.y,
          spikes: 5,
          outerRadius: b.size,
          innerRadius: b.size / 2.2,
          color: b.color,
        });
      } else {
        drawCircle(b.x, b.y, b.size, b.color);
      }
    }
  };

  document.save();
  document.roundedRect(innerX, innerY, innerWidth, innerHeight, innerRadius);
  document.clip();
  drawBubbles(bottomBubbles);
  document.restore();

  drawBubbles(sideBubbles);

  const contentY = innerY + 30;

  const isFinnish = translations.strengthDiploma === 'VAHVUUSDIPLOMI';
  const logoFilename = isFinnish ? 'fi.svg' : 'en.svg';
  const logoPath = path.join(assetsDirectory, `images/logo/${logoFilename}`);

  if (fs.existsSync(logoPath)) {
    const logoSvg = fs.readFileSync(logoPath, 'utf8');
    const logoWidth = 220;
    const logoAspectRatio = 340 / 80;
    const logoHeight = logoWidth / logoAspectRatio;

    svgToPdf(document, logoSvg, (width - logoWidth) / 2, contentY - 15, {
      width: logoWidth,
      height: logoHeight,
      preserveAspectRatio: 'xMidYMin meet',
    });
  }

  let currentY = contentY + 60;
  document.font('LuckiestGuy').fontSize(48);

  document
    .fillColor('black')
    .text(translations.strengthDiploma, 2, currentY + 2, {
      width,
      align: 'center',
    });
  document.fillColor('white').text(translations.strengthDiploma, 0, currentY, {
    width,
    align: 'center',
    fill: true,
    stroke: false,
  });
  document
    .lineWidth(1)
    .strokeColor('black')
    .text(translations.strengthDiploma, 0, currentY, {
      width,
      align: 'center',
      stroke: true,
      fill: false,
    });

  currentY += 80;

  document.font('Helvetica').fontSize(14).fillColor(textColor);
  document.text(translations.diplomaAwardedTo, 0, currentY, {
    width,
    align: 'center',
  });

  currentY += 40;

  document.fontSize(36).font('LuckiestGuy').fillColor(purpleColor);
  document.text(studentName, 0, currentY - 5, {
    width,
    align: 'center',
  });

  document.lineWidth(2).strokeColor(purpleColor);
  document
    .moveTo(width * 0.2, currentY + 35)
    .lineTo(width * 0.8, currentY + 35)
    .stroke();

  currentY += 65;

  document.font('Helvetica').fontSize(14).fillColor(mutedTextColor);
  document.text(translations.forUsingStrengths, 0, currentY, {
    width,
    align: 'center',
  });

  currentY += 40;

  const strengthGap = 40;
  const strengthSize = 90;
  const totalStrengthsWidth =
    selectedStrengths.length * strengthSize +
    (selectedStrengths.length - 1) * strengthGap;
  let strengthX = (width - totalStrengthsWidth) / 2;

  for (const strength of selectedStrengths) {
    const circleX = strengthX + strengthSize / 2;
    const circleY = currentY + strengthSize / 2;
    const radius = strengthSize / 2;

    document
      .circle(circleX, circleY, radius)
      .fillAndStroke(strength.color, strength.borderColor);

    // Icon
    const iconPath = path.join(
      assetsDirectory,
      `images/strengths/${strength.slug}.png`,
    );
    if (fs.existsSync(iconPath)) {
      document.save();
      document.circle(circleX, circleY, radius).clip();
      document.image(iconPath, strengthX, currentY, {
        width: strengthSize,
        height: strengthSize,
        fit: [strengthSize, strengthSize],
        align: 'center',
        valign: 'center',
      });
      document.restore();
    }

    const isSingleWord = !strength.title.trim().includes(' ');
    const textWidth = isSingleWord ? 200 : strengthSize + 20;
    const textX = isSingleWord ? circleX - textWidth / 2 : strengthX - 10;

    document.font('Helvetica').fontSize(12).fillColor('black');
    document.text(strength.title, textX, currentY + strengthSize + 10, {
      width: textWidth,
      align: 'center',
    });

    strengthX += strengthSize + strengthGap;
  }

  const footerY = height - pageMargin - borderWidth - 35;
  const footerMargin = width * 0.15;
  const footerWidth = (width - footerMargin * 2 - 40) / 2;

  document.lineWidth(1).strokeColor(purpleColor);
  document
    .moveTo(footerMargin, footerY)
    .lineTo(footerMargin + footerWidth, footerY)
    .stroke();
  document.font('Helvetica').fontSize(10).fillColor(textColor);
  document.text(translations.signature, footerMargin, footerY + 5, {
    width: footerWidth,
    align: 'center',
  });

  if (signatureName) {
    document.font('LuckiestGuy').fontSize(16).fillColor(purpleColor);
    document.text(signatureName, footerMargin, footerY - 19, {
      width: footerWidth,
      align: 'center',
    });
  }

  document
    .moveTo(width - footerMargin - footerWidth, footerY)
    .lineTo(width - footerMargin, footerY)
    .stroke();
  document.font('Helvetica').fontSize(14).fillColor(textColor);
  document.text(
    formattedDate,
    width - footerMargin - footerWidth,
    footerY - 20,
    {
      width: footerWidth,
      align: 'center',
    },
  );

  document.font('Helvetica').fontSize(10).fillColor(textColor);
  document.text(
    translations.date,
    width - footerMargin - footerWidth,
    footerY + 5,
    {
      width: footerWidth,
      align: 'center',
    },
  );

  document.end();
};

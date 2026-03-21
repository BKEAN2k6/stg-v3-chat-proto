import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {type Request, type Response} from 'express';
import PDFDocument from 'pdfkit';
import svgToPdf from 'svg-to-pdfkit';
import {
  type GenerateGroupStrengthDiplomaParameters,
  type GenerateGroupStrengthDiplomaRequest,
} from '../../client/ApiTypes.js';
import {Group} from '../../../models/index.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDirectory = path.join(dirname, '../../../assets');

// Trophy Paths from Trophy.tsx
// Note: SVG viewBox was 243 240. We need to scale this to our desired trophy size.

const cupPath =
  'M86.197 8.552C99.217 5.101 113.053 2 121.333 2c8.28 0 22.116 3.1 35.136 6.552 13.32 3.51 26.748 7.664 34.644 10.18a18.503 18.503 0 0 1 8.444 5.624 17.798 17.798 0 0 1 4.084 9.141 184.352 184.352 0 0 1 1.453 15.304h13.624c12.49 0 22.615 9.872 22.615 22.05 0 30.627-23.593 55.881-54.024 59.426a146.082 146.082 0 0 1-13.248 20.106 139.721 139.721 0 0 1-30.204 28.701 86.132 86.132 0 0 1-4.523 2.962l-.001.211c0 16.454 6 16.454 6 16.454h-.187c7.473 1.608 9.787 2.194 12.187 6.581l12 21.938c0 4.847-21.49 8.776-48 8.776s-48-3.929-48-8.776l12-21.938c2.4-4.387 4.714-4.973 12.188-6.581h-.188s6 0 6-16.454v-.211a86.026 86.026 0 0 1-4.524-2.962 139.75 139.75 0 0 1-30.204-28.701 146.117 146.117 0 0 1-13.247-20.106c-30.432-3.545-54.025-28.799-54.025-59.425 0-12.179 10.126-22.05 22.616-22.05h13.623c.26-4.967.738-10.068 1.453-15.305a17.8 17.8 0 0 1 4.084-9.141 18.502 18.502 0 0 1 8.444-5.625A763.956 763.956 0 0 1 86.197 8.552Zm143.136 62.3c0-5.717-4.752-10.35-10.615-10.35h-13.406c-.343 21.665-4.867 40.525-11.656 56.622 20.606-5.793 35.677-24.316 35.677-46.272Zm-216 0c0-5.717 4.753-10.35 10.616-10.35h13.405c.343 21.665 4.867 40.525 11.657 56.622-20.606-5.793-35.678-24.316-35.678-46.272Z';

const baseDetailPath =
  'M121.333 236.006c26.51 0 48-3.929 48-8.776l-.959-1.755-11.041-20.183c7.2 13.163-79.2 13.163-72 0l-11.04 20.183-.96 1.755c0 4.847 21.49 8.776 48 8.776Z';

const strokePath =
  'M103.333 182.257c0 16.454-6 16.454-6 16.454h.188c-7.474 1.608-9.788 2.194-12.188 6.581m18-23.035v-.211m0 .211v-.211m36 .211c0 16.454 6 16.454 6 16.454h-.187c7.473 1.608 9.787 2.194 12.187 6.581m-18-23.035.001-.211m-.001.211.001-.211m-54 23.246-12 21.938m12-21.938-11.04 20.183-.96 1.755m12-21.938c-7.2 13.163 79.199 13.163 71.999 0m0 0 12 21.938m-12-21.938 11.041 20.183.959 1.755m0 0c0 4.847-21.49 8.776-48 8.776s-48-3.929-48-8.776m30-45.184a86.026 86.026 0 0 1-4.524-2.962 139.75 139.75 0 0 1-30.204-28.701 146.117 146.117 0 0 1-13.247-20.106c-30.432-3.545-54.025-28.799-54.025-59.425 0-12.179 10.126-22.05 22.616-22.05h13.623c.26-4.967.738-10.068 1.453-15.305a17.8 17.8 0 0 1 4.084-9.141 18.502 18.502 0 0 1 8.444-5.625A763.956 763.956 0 0 1 86.197 8.552C99.217 5.101 113.053 2 121.333 2c8.28 0 22.116 3.1 35.136 6.552 13.32 3.51 26.748 7.664 34.644 10.18a18.503 18.503 0 0 1 8.444 5.624 17.798 17.798 0 0 1 4.084 9.141 184.352 184.352 0 0 1 1.453 15.304h13.624c12.49 0 22.615 9.872 22.615 22.05 0 30.627-23.593 55.881-54.024 59.426a146.082 146.082 0 0 1-13.248 20.106 139.721 139.721 0 0 1-30.204 28.701 86.132 86.132 0 0 1-4.523 2.962m79.384-121.545c5.863 0 10.615 4.634 10.615 10.35 0 21.957-15.071 40.48-35.677 46.273 6.789-16.097 11.313-34.957 11.656-56.623h13.406Zm-194.77 0c-5.862 0-10.615 4.634-10.615 10.35 0 21.957 15.072 40.48 35.678 46.273-6.79-16.097-11.314-34.957-11.657-56.623H23.95Z';

const badgePath =
  'M92.65 19.553c10.629-2.924 21.924-5.55 28.683-5.55s18.054 2.626 28.683 5.55c10.873 2.973 21.835 6.491 28.28 8.622 2.695.9 5.085 2.552 6.894 4.765a15.35 15.35 0 0 1 3.333 7.743c5.839 44.37-7.709 77.254-24.147 99.009a115.958 115.958 0 0 1-24.656 24.311 70 70 0 0 1-10.266 6.194c-2.743 1.308-5.691 2.379-8.121 2.379-2.429 0-5.368-1.071-8.121-2.379a70 70 0 0 1-10.266-6.194 116.015 116.015 0 0 1-24.656-24.311c-16.438-21.755-29.985-54.639-24.147-99.01a15.352 15.352 0 0 1 3.334-7.742 15.082 15.082 0 0 1 6.893-4.765 606.43 606.43 0 0 1 28.28-8.622Z';

export const generateGroupStrengthDiploma = async (
  request: Request,
  response: Response,
) => {
  const {id} = request.params as GenerateGroupStrengthDiplomaParameters;

  if (!id) {
    response.status(400).json({error: 'Group ID is required'});
    return;
  }

  const {
    signerName,
    date,
    strength,
    translations,
    paperSize,
    strengthColor,
    strengthBadgeColor,
  } = request.body as GenerateGroupStrengthDiplomaRequest;

  const group = await Group.findById(id);

  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const groupName = group.name;

  const isA4 = paperSize === 'A4';
  const width = isA4 ? 841.89 : 792;
  const height = isA4 ? 595.28 : 612;

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

  // Register Font
  const fontPath = path.join(assetsDirectory, 'fonts/LuckiestGuy-Regular.ttf');
  document.registerFont('LuckiestGuy', fontPath);

  // Colors
  const purpleColor = '#7c5cdb';
  const textColor = '#333333';

  // --- Draw Border ---
  const pageMargin = 20;
  const drawWidth = width - pageMargin * 2;
  const drawHeight = height - pageMargin * 2;
  const drawX = pageMargin;
  const drawY = pageMargin;

  // Background
  document.rect(0, 0, width, height).fill('white'); // Ensure white background

  const borderWidth = width * 0.028;
  const outerRadius = width * 0.024;

  // Draw the background (The "Frame")
  document
    .roundedRect(drawX, drawY, drawWidth, drawHeight, outerRadius)
    .fill(strengthBadgeColor);

  // Inner white box
  const innerX = drawX + borderWidth;
  const innerY = drawY + borderWidth;
  const innerWidth = drawWidth - borderWidth * 2;
  const innerHeight = drawHeight - borderWidth * 2;
  const innerRadius = width * 0.006;

  document
    .roundedRect(innerX, innerY, innerWidth, innerHeight, innerRadius)
    .fill('white');

  // --- Decorations (Bubbles/Stars) ---
  const strengthColors = [
    '#ef7570', // Kindness (Red/Pink)
    '#fdd662', // Self-regulation (Yellow/Orange)
    '#4d97b5', // Creativity (Blue)
    '#3ab5a1', // Hope (Teal/Green)
    '#a5d7d5', // Perseverance (Light Cyan)
  ];

  const drawBubbleShape = (drawFunction: () => void, color: string) => {
    document.save();
    document.lineWidth(1);
    document.strokeColor(color);
    document.fillColor(color);
    document.fillOpacity(0.2); // Bubble transparency

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
    const baseWidth = 30 + 100 * relativeY;
    const currentBandWidth = baseWidth * (0.6 + 0.8 * Math.random());
    const edgeOffset = 5;
    const xOffset = Math.random() * currentBandWidth;
    const x = isLeft
      ? innerX + edgeOffset + xOffset
      : innerX + innerWidth - edgeOffset - xOffset;

    const color =
      strengthColors[Math.floor(Math.random() * strengthColors.length)];
    const size = 7 + Math.random() * 12;

    addBubble(x, y, size, color);
  }

  // Extra bubbles (top corners)
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

  // --- Content Area ---
  const contentY = innerY + 30;

  // 1. Logo

  // Fallback logic, skipping actual logo for now as in previous code

  // 2. Main Title: "{STRENGTH NAME} \n DIPLOMA"
  let currentY = contentY + 20; // Reduced top margin

  const titleLines = [
    {
      text: translations.strengthTitle.toUpperCase(),
      size: 56,
      height: 65,
      shadowOffset: 3,
      strokeWidth: 1.5,
    },
    {
      text: translations.diploma,
      size: 38,
      height: 45,
      shadowOffset: 2,
      strokeWidth: 1,
    },
  ];

  for (const line of titleLines) {
    document.font('LuckiestGuy').fontSize(line.size);

    // Drop shadow
    document
      .fillColor('black')
      .text(line.text, 2, currentY + line.shadowOffset, {
        width,
        align: 'center',
      });

    // Main text fill
    document.fillColor('white').text(line.text, 0, currentY, {
      width,
      align: 'center',
      fill: true,
      stroke: false,
    });

    // Main text outline
    document
      .lineWidth(line.strokeWidth)
      .strokeColor('black')
      .text(line.text, 0, currentY, {
        width,
        align: 'center',
        stroke: true,
        fill: false,
      });

    currentY += line.height;
  }

  currentY += 15; // Adjusted spacing after title

  // 3. "This diploma is awarded to"
  document.font('Helvetica').fontSize(14).fillColor(textColor);
  document.text(translations.diplomaAwardedTo, 0, currentY, {
    width,
    align: 'center',
  });

  currentY += 40;

  // 4. Group Name
  document.fontSize(36).font('LuckiestGuy').fillColor(purpleColor);
  document.text(groupName.toUpperCase(), 0, currentY - 5, {
    width,
    align: 'center',
  });

  // Decorative line under name
  document.lineWidth(2).strokeColor(strengthColor);
  document
    .moveTo(width * 0.2, currentY + 35)
    .lineTo(width * 0.8, currentY + 35)
    .stroke();

  currentY += 60; // Reduced spacing

  currentY -= 5; // Adjusted trophy position (up slightly)

  // 6. Trophy Drawing
  // Resizing trophy to be smaller and fit better
  const trophySize = 220; // Adjusted size
  const trophyX = (width - trophySize) / 2;
  const trophyY = currentY;

  // Construct simplified SVG without filters/masks (unsupported by svg-to-pdfkit)
  // We draw the base elements, then manually simulate the inner shadow effect
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243 240" width="243" height="240" fill="none">
      <ellipse cx="121.333" cy="229.993" fill="#282C34" opacity=".2" rx="60" ry="12"/>
      <path fill="${strengthColor}" fill-rule="evenodd" d="${cupPath}" clip-rule="evenodd"/>
      <path fill="#FDD662" d="${baseDetailPath}"/>
      <path stroke="#282C34" stroke-width="2.575" d="${strokePath}"/>
      <path fill="${strengthBadgeColor}" d="${badgePath}"/>
      <path stroke="#282C34" stroke-width="2.575" d="${badgePath}"/>
    </svg>
  `;

  svgToPdf(document, svgString, trophyX, trophyY, {
    width: trophySize,
    height: trophySize,
    preserveAspectRatio: 'xMidYMid meet',
  });

  // Manual Inner Shadow Overlay to simulate the SVG filter effect from Trophy.tsx
  // The frontend uses feOffset with dx="5.15" dy="5.15" for white highlight (20% opacity)
  // and dx="-5.15" dy="-5.15" for dark shadow (16% opacity)
  document.save();
  document.translate(trophyX, trophyY);
  const scale = trophySize / 243;
  document.scale(scale);

  // Clip to badge shape for inner shadow/highlight
  document.path(badgePath).clip();

  // Inner highlight (top-left edge) - white at 20% opacity
  // We draw a rectangle and subtract the offset badge shape to get just the edge
  document.save();
  document.fillColor('white');
  document.fillOpacity(0.2);
  // Draw bounding rect, then the offset badge path (even-odd will create the difference)
  document.rect(0, 0, 243, 240);
  document.translate(5.15, 5.15);
  document.path(badgePath);
  document.fill('even-odd');
  document.restore();

  // Inner shadow (bottom-right edge) - black at 16% opacity
  document.save();
  document.fillColor('black');
  document.fillOpacity(0.16);
  // Draw bounding rect, then the offset badge path
  document.rect(0, 0, 243, 240);
  document.translate(-3, -3);
  document.path(badgePath);
  document.fill('even-odd');
  document.restore();

  document.restore();

  // 7. Strength Icon Overlay
  // Need to place the PNG icon there.
  // Reuse scale from above
  const iconSizeUnscaled = 110; // Adjust as needed
  const iconSize = iconSizeUnscaled * scale;
  const iconX = trophyX + 121.333 * scale - iconSize / 2;
  const iconY = trophyY + 95 * scale - iconSize / 2; // Adjusted down

  const iconPath = path.join(
    assetsDirectory,
    `images/strengths/${strength}.png`,
  );
  if (fs.existsSync(iconPath)) {
    document.image(iconPath, iconX, iconY, {
      width: iconSize,
      height: iconSize,
    });
  }

  // 8. Footer (Signature and Date)
  const footerY = height - 80;
  const leftX = width * 0.2;
  const rightX = width * 0.8;

  document.lineWidth(1).strokeColor(textColor);

  // Date Line
  document
    .moveTo(leftX, footerY)
    .lineTo(leftX + 150, footerY)
    .stroke();
  document.fontSize(12).font('Helvetica').fillColor(textColor);
  document.text(date, leftX, footerY - 15, {width: 150, align: 'center'});
  document.text(translations.date, leftX, footerY + 5, {
    width: 150,
    align: 'center',
  });

  // Signature Line
  document
    .moveTo(rightX - 150, footerY)
    .lineTo(rightX, footerY)
    .stroke();

  // Signature text (Strength Grow / translation) - smaller than group name (36)
  document.font('LuckiestGuy').fontSize(14).fillColor(purpleColor);
  document.text(signerName.toUpperCase(), rightX - 150, footerY - 15, {
    width: 150,
    align: 'center',
  });

  document.font('Helvetica').fontSize(12).fillColor(textColor);
  document.text(translations.signature, rightX - 150, footerY + 5, {
    width: 150,
    align: 'center',
  });

  document.end();
};

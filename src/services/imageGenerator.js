import { createCanvas, loadImage, registerFont } from 'canvas';
import { PATHS, CANVAS_BOX } from '../config/constants.js';
import { fitTextInBox, drawJustifiedLine } from '../utils/canvasHelper.js';

registerFont(PATHS.fontPath, { family: 'Amiri' });

export async function generateContentCard({ text, metaText, bgImagePath }) {
  const imagePath = bgImagePath || PATHS.defaultImage;
  const background = await loadImage(imagePath);

  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.textBaseline = 'middle';

  const { lines, fontSize, totalHeight } = fitTextInBox(ctx, text.trim(), CANVAS_BOX.width, CANVAS_BOX.height, 32);

  ctx.font = `bold ${fontSize}px "Amiri"`;
  ctx.fillStyle = '#f7e7c4';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 5;

  const lineHeight = fontSize * 1.7;
  let startY = CANVAS_BOX.y + (CANVAS_BOX.height - totalHeight) / 2 + lineHeight / 2;
  const centerX = background.width / 2;

  lines.forEach((line, index) => {
    const isLastLine = index === lines.length - 1;
    drawJustifiedLine(ctx, line, CANVAS_BOX.x, startY, CANVAS_BOX.width, isLastLine);
    startY += lineHeight;
  });

  // رسم الخط الفاصل
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 120, startY + 15);
  ctx.lineTo(centerX + 120, startY + 15);
  ctx.stroke();

  // طباعة الـ Meta Data (اسم السورة، اسم المحدث، الدعاء...)
  if (metaText) {
    ctx.font = `normal 22px "Amiri"`;
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.fillText(metaText, centerX, startY + 50);
  }

  return canvas.toBuffer('image/png');
}
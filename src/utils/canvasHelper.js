export function getLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLineWords = [];

  for (let word of words) {
    let testLineWords = [...currentLineWords, word];
    let testLine = testLineWords.join(' ');
    let metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLineWords.length > 0) {
      lines.push(currentLineWords.join(' '));
      currentLineWords = [word];
    } else {
      currentLineWords = testLineWords;
    }
  }

  if (currentLineWords.length > 0) {
    lines.push(currentLineWords.join(' '));
  }
  return lines;
}

export function fitTextInBox(ctx, text, boxWidth, boxHeight, startFontSize) {
  let fontSize = startFontSize;
  let lines = [];
  let totalHeight = 0;

  do {
    ctx.font = `bold ${fontSize}px "Amiri"`;
    lines = getLines(ctx, text, boxWidth);
    totalHeight = lines.length * (fontSize * 1.7);
    fontSize -= 1;
  } while (totalHeight > boxHeight - 60 && fontSize > 14);

  return { lines, fontSize, totalHeight };
}

export function drawJustifiedLine(ctx, lineText, startX, startY, maxWidth, isLastLine) {
  if (isLastLine) {
    ctx.textAlign = 'center';
    ctx.fillText(lineText, startX + maxWidth / 2, startY);
    return;
  }

  const words = lineText.split(' ');
  if (words.length <= 1) {
    ctx.textAlign = 'center';
    ctx.fillText(lineText, startX + maxWidth / 2, startY);
    return;
  }

  let totalWordsWidth = words.reduce((acc, word) => acc + ctx.measureText(word).width, 0);
  const spaceWidth = (maxWidth - totalWordsWidth) / (words.length - 1);

  let currentX = startX + maxWidth;
  ctx.textAlign = 'right';

  words.forEach((word) => {
    ctx.fillText(word, currentX, startY);
    currentX -= ctx.measureText(word).width + spaceWidth;
  });
}
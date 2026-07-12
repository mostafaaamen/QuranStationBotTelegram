import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PATHS = {
  fontPath: path.join(__dirname, '../../fonts/Amiri-Regular.ttf'),
  defaultImage: path.join(__dirname, '../../img/photo.png'),
  hadithImage: path.join(__dirname, '../../img/hadith.png'),
};
export const CANVAS_BOX = {
  x: 180,
  y: 160,
  width: 840,
  height: 520,
};
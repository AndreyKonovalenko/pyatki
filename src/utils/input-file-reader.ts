import fs from 'fs';

export function inputFileReader(path: string): string[] {
  const content = fs.readFileSync(path, 'utf8');
  return content
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

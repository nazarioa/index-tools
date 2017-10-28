import * as path from 'path';

export function filterFunc(item: any) {
  const basename = path.basename(item);
  return (basename === '.' || basename[0] !== '.');
};

export function count(largerString: string, targetSubString: string) {
  return (largerString.match(new RegExp(targetSubString, 'g')) || []).length;
};

export function replaceAll(target: string, search: string, replacement: string) {
  return target.split(search).join(replacement);
};

export function filenameFromPath(filePath: string) {
  return filePath.split('/').reverse()[0];
}

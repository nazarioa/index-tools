// Import filesystem walk
// const klaw = require('klaw');
import * as klaw from 'klaw';
import * as path from 'path';
import * as fs from 'fs';

const filterFunc = (item: any) => {
  const basename = path.basename(item);
  return (basename === '.' || basename[0] !== '.');
};

const count = (largerString: string, targetSubString: string) => {
  return (largerString.match(new RegExp(targetSubString, 'g')) || []).length;
};

const replaceAll = (target: string, search: string, replacement: string) => {
  return target.split(search).join(replacement);
};


function findOldMultis(cb: (filesWithMultis: [string, number][]) => void) {
  const multiFiles: [string, number][] = [];
  klaw('/Users/elliotplant/source/temp/bamboo/modules', { filter: filterFunc })
    .on('data', (item: any) => {
      if (!item.stats.isDirectory()) {
        if (item.path.endsWith('component.html')) {
          const oldFileData = fs.readFileSync(item.path).toString();
          const multiCount = count(oldFileData, 'multi');
          if (multiCount > 0) {
            multiFiles.push([item.path, multiCount]);
          }
        }
      }
    })
    .on('end', () => {
      cb(multiFiles);
    });

}

function findNewMultis(filesWithMultis: [string, number][]) {
  filesWithMultis.forEach(([path, oldMultiCount]) => {
    const newFileData = fs.readFileSync(path).toString();
    const newMultiCount = count(newFileData, 'multi');
    // if (newMultiCount !== oldMultiCount) {
      console.log('Mismatched Count:');
      console.log(path.split('/').reverse()[0], oldMultiCount, newMultiCount);
      console.log();
    // }
  });
}
findOldMultis(findNewMultis);
// console.log(count('hey thisr this is elliot', 'is'));

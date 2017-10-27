// Import filesystem walk
// const klaw = require('klaw');
import * as klaw from 'klaw';
import * as path from 'path';
import * as fs from 'fs';

const filterFunc = (item: any) => {
  const basename = path.basename(item);
  return (basename === '.' || basename[0] !== '.');
};

const replaceAll = (target: string, search: string, replacement: string) => {
  return target.split(search).join(replacement);
};

const fileMap: { [key: string]: string } = {};

klaw('/Users/elliotplant/source/bamboo/modules', { filter: filterFunc })
  .on('data', (item: any) => {
    if (!item.stats.isDirectory()) {
      if (item.path.endsWith('component.ts')) {
        fileMap[item.path] = item.path.replace('/app/', '/test/').replace('.component.ts', '.component.spec.ts');
      }
    }
  })
  .on('end', () => {
    console.log('Composite control tests missing controls:');
    Object.keys(fileMap).forEach(appFilePath => {
      const testFilePath = fileMap[appFilePath];
      const tsFileName = appFilePath.split('/').reverse()[0];
      const testFileName = testFilePath.split('/').reverse()[0];
      const appFiledata = fs.readFileSync(appFilePath, 'utf-8');
      if (appFiledata.includes('extends IndexCompositeControl')) {
        if (fs.existsSync(testFilePath)) {
          const testFiledata = fs.readFileSync(testFilePath, 'utf-8');
          if (!testFiledata.includes('fixture.addControlToComponent')) {
            console.log(testFileName);
          }
        }
      }
    });
  });

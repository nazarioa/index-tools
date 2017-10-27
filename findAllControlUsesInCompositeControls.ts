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
        fileMap[item.path] = item.path.replace('/app/', '/test/');
      }
    }
  })
  .on('end', () => {
    console.log('Files with deprecated inputs:');
    Object.keys(fileMap).forEach(appFilePath => {
      const testFilePath = fileMap[appFilePath];
      const tsFileName = appFilePath.split('/').reverse()[0];
      const testFileName = testFilePath.split('/').reverse()[0];
      const tsFiledata = fs.readFileSync(appFilePath, 'utf-8');
      if (tsFiledata.includes('extends IndexCompositeControl')) {
        console.log(testFileName);
        if (tsFiledata.includes('this.control')) {
          console.log(tsFileName);
          fs.writeFileSync(appFilePath, replaceAll(tsFiledata, 'this.control', 'this.viewControl'));
        }
        const htmlFiledata = fs.readFileSync(testFilePath, 'utf-8');
        if (htmlFiledata.search(/[\"\s]control/) > -1) {
          // fs.writeFileSync(testFilePath, replaceAll(htmlFiledata, '"control', '"viewControl'));
        }
      }
    });
  });

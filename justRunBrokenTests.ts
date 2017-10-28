// Import filesystem walk
// const klaw = require('klaw');
import * as klaw from 'klaw';
import * as path from 'path';
import * as fs from 'fs';
import * as utils from './utils';

const brokenTestText = [
  'a locked field on Feature Config',
  'Payment Processor" and "Unknown',
  '/Invalid items in dropdown lists',
  'Should save bin entry for Debit',
  'invalid (start > end)',
  'Should save bin entry for Credit',
  'Entries Should handle multiple bin entries',
  'Section Trace Level Should be locked',
  'Section Trace Level Should save changes',
  'to "Do Not Restart"',
  'Section Restart Strategy Should save changes',
  'a locked field on Interface Config',
  'feature Configs with the same name',
  'a locked field on Feature Config',
  'options for tips section and save',
  'section and hide when turned off',
  'Payment Processor" and "Unknown',
  '/Invalid items in dropdown lists',
  'Should save bin entry for Debit',
  'invalid (start > end)',
  'Should save bin entry for Credit',
  'Entries Should handle multiple bin entries',
  'be ON and locked by default',
  'Section Trace Level Should be locked',
  'Section Trace Level Should save changes',
  'to "Do Not Restart"',
  'Section Restart Strategy Should save changes',
  'store with all fields filled out',
  'to edit a store payment processor',
  'when creating store group without stores',
  'be able to reveal API key',
  'reset API key by following prompts',
  'and cancel a send later campaign',
  'terminate a signup in store campaign',
  'create a group pool customer group',
  'create and edit a Product Label',
  'to create a ProductLabel after error',
  'a full product recommendation promo pool',
  'create a full product recommendation promo',
  'to create a product discount coupon',
  'a buy X get Y coupon',
  'be able to load the page',
  'fields and start a compliance test',
  'turn green after running a transaction',
  'and make sure it saves.',
  'the default ReleaseConfig for the merchant',
  'Should upload a product rec header',
  'as a store manager without freezing',
  'show a list of invited users',
  'to default when re-locked',
  'a new email list customer group',
  'a buy X get X coupon'
];

function findBadTests() {
  const badFiles: [string, number][] = [];
  klaw('/Users/elliotplant/source/bamboo', { filter: utils.filterFunc })
    .on('data', (item: any) => {
      if (!item.stats.isDirectory()) {
        if (item.path.includes('.e2e-spec.')) {
          const fileData = fs.readFileSync(item.path).toString();
          const includesBrokenTest = brokenTestText.some(needleText => fileData.includes(needleText));
          if (includesBrokenTest) {
            console.log(utils.filenameFromPath(item.path));
            const fitFileData = utils.replaceAll(fileData, ' it(', ' fit(');
            fs.writeFileSync(item.path, fitFileData);
          }
        }
      }
    })
}

findBadTests();

import fs from 'fs';
import csv from 'fast-csv';
import ObjectsToCsv from 'objects-to-csv';
import Worker from './Worker';

const PATH = './src/data/';

const GROUP = [
  { name: 'TEST1', group: 'A' },
  { name: 'TEST2', group: 'B' },
];
const OUTPUTS1 = [], OUTPUTS2 = [], OUTPUTS3 = [];

GROUP.forEach(({ name, group }, index) => {
  const stream = fs.createReadStream(`${PATH}/${name}/HRV.csv`);
  const CSVDATAS = [];
  const csvStream = csv()
    .on('data', (data) => CSVDATAS.push(data))
    .on('end', async () => {

      // const output1 = new Worker(group, name, CSVDATAS).caculate1();
      // OUTPUTS1.push(...output1);

      // const output2 = new Worker(group, name, CSVDATAS).caculate2();
      // OUTPUTS2.push(...output2);

      const output3 = new Worker(group, name, CSVDATAS).caculate3();
      OUTPUTS3.push(...output3);

      // 儲存檔案
      if (index === GROUP.length - 1) {
        // fileSave(OUTPUTS1, 'Analysis1');
        // fileSave(OUTPUTS2, 'Analysis2');
        fileSave(OUTPUTS3, 'Analysis3');
      }
    });
  stream.pipe(csvStream);
});


async function fileSave(data, filename) {
  let csv = undefined, src = '';
  csv = new ObjectsToCsv(data);
  src = './out/' + filename + '.csv';
  if (fs.existsSync(src)) fs.unlinkSync(src);
  await csv.toDisk(src, { bom: true });
}
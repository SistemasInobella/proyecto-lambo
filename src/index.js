const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { transformData } = require('./transformer');
const { generateCSV } = require('./csvGenerator');

const parser = new xml2js.Parser();

async function main() {
  const folderPath = './input_xml';
  const files = fs.readdirSync(folderPath);

  const results = [];

  for (const file of files) {
    if (!file.endsWith('.xml')) continue;

    const xmlData = fs.readFileSync(path.join(folderPath, file), 'utf8');
    const json = await parser.parseStringPromise(xmlData);

    const transformed = transformData(json);
    results.push(...transformed);
  }

  generateCSV(results);
}

main();
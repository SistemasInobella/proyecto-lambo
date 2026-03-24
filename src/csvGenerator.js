const { Parser } = require('json2csv');
const fs = require('fs');

function generateCSV(data) {
  const fields = ['vendor', 'total', 'fecha'];

  const parser = new Parser({ fields });
  const csv = parser.parse(data);

  fs.writeFileSync('./output_csv/output.csv', csv);

  console.log(" CSV generado correctamente");
}

module.exports = { generateCSV };
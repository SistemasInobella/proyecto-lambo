const { Parser } = require('json2csv');
const fs = require('fs');

function generateCSV(data) {
  const fields = [
    'idExterno',
    'nºreferencia',
    'proveedor',
    'nota',
    'moneda',
    'fecha',
    'solicita',
    'autoriza',
    'elaboro',
    'descripcion',
    'tarifa',
    'departamento',
    'clase',
    'codigoImpuesto',
    'formaPago',
    'metodoPago',
    'fechaEmision',
    'uuidReceived',
    'cuenta',
    'canalVenta',
    'estado'
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(data);

  fs.writeFileSync('./output_csv/output.csv', csv);

  console.log(" CSV generado correctamente");
}

module.exports = { generateCSV };
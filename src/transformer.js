function transformData(json) {
  const comprobante = json['cfdi:Comprobante'];
  
  const vendor = comprobante['cfdi:Emisor'][0]['$'].Nombre;
  const fecha = comprobante['$'].Fecha;

  const conceptos = comprobante['cfdi:Conceptos'][0]['cfdi:Concepto'];

  const linea = conceptos.map(c => {
    return {
      vendor: vendor,
      fecha: fecha,
      articulo: c['$'].Descripcion,
      cantidad: c['$'].Cantidad,
      importe: c['$'].Importe
    };
  });

  return linea
}

module.exports = { transformData };
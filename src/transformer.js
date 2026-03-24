function transformData(json) {
  const comprobante = json['cfdi:Comprobante'];

  return {
    vendor: comprobante['cfdi:Emisor'][0]['$'].Nombre,
    total: comprobante['$'].Total,
    fecha: comprobante['$'].Fecha
  };
}

module.exports = { transformData };
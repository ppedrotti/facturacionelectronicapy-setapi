const { test } = require("node:test");
const assert = require("node:assert/strict");
const axios = require("axios");
const JSZip = require("jszip");
const setapi = require("../dist").default;
const pkcs12 = require("../dist/PKCS12").default;

test("un lote conserva su identidad TLS al consultar otro contribuyente durante el ZIP", async (contexto) => {
  let contribuyente;
  contexto.mock.method(pkcs12, "openFile", (ruta) => {
    contribuyente = ruta;
  });
  contexto.mock.method(pkcs12, "getCertificate", () => `CERT_${contribuyente}`);
  contexto.mock.method(pkcs12, "getPrivateKey", () => `KEY_${contribuyente}`);

  const solicitudes = [];
  contexto.mock.method(axios, "post", async (url, soap, opciones) => {
    solicitudes.push({
      id: Number(soap.match(/<dId>(\d+)<\/dId>/)[1]),
      soap,
      certificado: opciones.httpsAgent.options.cert.toString(),
      clave: opciones.httpsAgent.options.key.toString(),
    });
    return {
      status: 200,
      data: '<?xml version="1.0"?><env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"><env:Body><rRes><dCodRes>0300</dCodRes><dMsgRes>Respuesta sintética</dMsgRes><dProtConsLote>123456</dProtConsLote></rRes></env:Body></env:Envelope>',
    };
  });

  const xml = '<rDE><DE Id="documento-sintetico"/></rDE>';
  const envio = setapi.recibeLote(
    1,
    [`<?xml version="1.0"?>\n${xml}`],
    "prod",
    "A",
    "clave-sintetica"
  );
  assert.equal(solicitudes.length, 0);
  const consulta = setapi.consultaRUC(2, "80012345", "prod", "B", "clave-sintetica");
  const [respuesta] = await Promise.all([envio, consulta]);

  assert.equal(solicitudes.length, 2);
  const lote = solicitudes.find((solicitud) => solicitud.id === 1);
  const ruc = solicitudes.find((solicitud) => solicitud.id === 2);
  assert.equal(lote.certificado, "CERT_A");
  assert.equal(lote.clave, "KEY_A");
  assert.equal(ruc.certificado, "CERT_B");
  assert.equal(ruc.clave, "KEY_B");
  assert.equal(respuesta.rRes.dProtConsLote, "123456");
  const comprimido = lote.soap.match(/<xDE>([^<]+)<\/xDE>/)[1];
  const zip = await JSZip.loadAsync(comprimido, { base64: true });
  const contenido = await zip.file("xml_file.xml").async("string");
  assert.ok(contenido.includes(xml));
});

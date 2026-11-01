# Facturación Electrónica - Api SET

## Corrección TLS del fork Krae.OS

La rama `corregir-aislamiento-tls-1.0.34` conserva la base 1.0.34 y captura
el certificado y la clave del lote antes de esperar la compresión ZIP.
Esto evita que otra comunicación cambie su identidad TLS durante esa espera.

`dist/` se versiona para consumir el archivo de GitHub de un commit exacto
sin compilar durante la instalación. Antes de confirmar cambios de fuente,
ejecutar `npm test` y agregar también los archivos compilados resultantes.
Para preparar este código histórico desde cero, instalar con
`npm ci --legacy-peer-deps` y ejecutar `npm test` (Node.js 22 o posterior).

El consumidor debe fijar el SHA completo en la URL
`https://github.com/ppedrotti/facturacionelectronicapy-setapi/archive/<SHA>.tar.gz`.
No usar una URL de rama para instalaciones de producción.
API de comunicación con SIFEN - Subsecretaría de estado de Tributación, para envío de los documentos electrónicos y consultas de datos de Facturas electrónicas.

## Instalación

```
$ npm install facturacionelectronicapy-setapi
```

## Envio de Documento de forma Síncrona

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';

setApi
.recibe(id, xmlSigned, env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```

## Envio de Documento de forma Asíncrona, por lotes

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';

setApi
.recibeLote(id, xmlSigned[], env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```
## Envio de evento a SIFEN

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';

setApi
.evento(id, xmlSigned, env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```
## Consulta de Documentos electrónicos desde SIFEN

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';

setApi
.consulta(id, cdc, env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```
## Consulta de RUC

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';

setApi
.consultaRuc(id, ruc, env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```
## Consulta de Lote

TypeScript:
```typescript
import setApi from 'facturacionelectronicapy-setapi';
 
setApi
.consultaLote(id, numeroLote, env = "test" | "prod", cert_path, key)
.then(xml => console.log("XML con QR", xml));

```


=======
Para saber como generar el Archivo XML visita éste proyecto de Git visitar: 
https://github.com/marcosjara/facturacionelectronicapy-xmlgen


## Todos los proyectos
[Generación de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlgen)<br/>
[Firma de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlsign)<br/>
[Generación de QR](https://www.npmjs.com/package/facturacionelectronicapy-qrgen)<br/>
[API de SIFEN](https://www.npmjs.com/package/facturacionelectronicapy-setapi)<br/>
[Generación KUDE](https://www.npmjs.com/package/facturacionelectronicapy-kude)<br/>

## Empresas que utilizan éstos proyectos
[JHF Ingeniería Informática](https://jhf.com.py/)<br/>
[JR Ingeniería y Servicios](https://jringenieriayservicios.com/)<br/>
[FacturaSend](https://www.facturasend.com.py/)<br/>


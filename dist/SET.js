"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = __importDefault(require("jszip"));
const PKCS12_1 = __importDefault(require("./PKCS12"));
const xml2js_1 = __importDefault(require("xml2js"));
const fs_1 = __importDefault(require("fs"));
const https = require("https");
const axios = require("axios");
class SET {
    /**
     * Crea los certificados para authenticarse a SIFEN.
     * @param certificado
     * @param passphase
     * /
    /*auth(env: "test" | "prod", certificado: any, passphase: string) {
      pkcs12.openFile(certificado, passphase);
      this.env = env;
      this.cert = pkcs12.getCertificate();
      this.key = pkcs12.getPrivateKey();
    }
    */
    abrir(certificado, passphase) {
        PKCS12_1.default.openFile(certificado, passphase);
        this.cert = PKCS12_1.default.getCertificate();
        this.key = PKCS12_1.default.getPrivateKey();
    }
    /**
     * Consulta un Documento Electronico por CDC
     *
     * @param cdc
     * @returns
     */
    consulta(id, cdc, env, certificado, passphase, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                };
                defaultConfig = Object.assign(defaultConfig, config);
                this.abrir(certificado, passphase);
                let url = "https://sifen.set.gov.py/de/ws/consultas/consulta.wsdl";
                if (env == "test") {
                    url = "https://sifen-test.set.gov.py/de/ws/consultas/consulta.wsdl";
                }
                //console.log("URL invocado...", url);
                if (!this.cert) {
                    reject("Antes debe Autenticarse");
                }
                if (!this.key) {
                    reject("Antes debe autenticarse");
                }
                const httpsAgent = new https.Agent({
                    cert: Buffer.from(this.cert, "utf8"),
                    key: Buffer.from(this.key, "utf8"),
                });
                let soapXMLData = `<?xml version="1.0" encoding="UTF-8"?>\n\
                        <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                            <env:Header/>\n\
                            <env:Body>\n\
                                <rEnviConsDeRequest xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                  <dId>${id}</dId>\n\
                                  <dCDC>${cdc}</dCDC>\n\
                                </rEnviConsDeRequest>\n\
                            </env:Body>\n\
                        </env:Envelope>\n`;
                soapXMLData = this.normalizeXML(soapXMLData);
                if (defaultConfig.debug === true) {
                    console.log("url", url, "consultaCDC. soapXMLData", soapXMLData);
                }
                if (defaultConfig.saveRequestFile) {
                    const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                }
                axios
                    .post(`${url}`, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                    .then((respuestaSuccess) => {
                    var parser = new xml2js_1.default.Parser({ explicitArray: false });
                    //console.log("statuscode", respuestaSuccess);
                    //console.log(respuestaSuccess.status);
                    if (respuestaSuccess.status == 200) {
                        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                            parser
                                .parseStringPromise(respuestaSuccess.data)
                                .then(function (result) {
                                const resultData = result["env:Envelope"]["env:Body"];
                                //delete resultData.$;
                                resultData.id = id;
                                resolve(resultData);
                            });
                        }
                        else {
                            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaCDC. response", respuestaSuccess.data);
                                }
                                reject(new Error("Error SIFEN BIG-IP logout page"));
                            }
                            else {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaCDC. response", respuestaSuccess.data);
                                }
                                reject(new Error(respuestaSuccess.data + ""));
                            }
                        }
                    }
                    else {
                        reject(new Error("Error de conexión con SIFEN"));
                    }
                })
                    .catch((err) => {
                    if (err && err.response && err.response.data) {
                        var xmlResponse = err.response.data;
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(xmlResponse)
                            .then(function (result) {
                            const resultData = result["env:Envelope"]["env:Body"];
                            resultData.id = id;
                            resolve(resultData);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Consulta un lote en SIFEN
     * @param id
     * @param numeroProtocolo
     * @returns
     */
    /*consultaLote2222(
      id: number,
      numeroProtocolo: number,
      env: "test" | "prod",
      certificado: any,
      passphase: any,
      config?: SetApiConfig
    ): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let defaultConfig: SetApiConfig = {
            debug: false,
            timeout: 90000,
          };
  
          //console.log("El config del params viene ", config);
  
          defaultConfig = Object.assign(defaultConfig, config);
  
          let url = "https://sifen.set.gov.py/de/ws/consultas/consulta-lote.wsdl";
          if (env == "test") {
            url =
              "https://sifen-test.set.gov.py/de/ws/consultas/consulta-lote.wsdl";
          }
  
          /*this.abrir(certificado, passphase);
  
          if (!this.cert) {
            reject("Antes debe Autenticarse");
          }
  
          if (!this.key) {
            reject("Antes debe autenticarse");
          }*/
    /*const httpsAgent = new https.Agent({
            cert: Buffer.from(this.cert, "utf8"),
            key: Buffer.from(this.key, "utf8"),
          });* /
  
          let soapXMLData = `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                              <env:Header/>\n\
                              <env:Body>\n\
                                  <rEnviConsLoteDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                      <dId>${id}</dId>\n\
                                      <dProtConsLote>${numeroProtocolo}</dProtConsLote>\n\
                                  </rEnviConsLoteDe>\n\
                              </env:Body>\n\
                          </env:Envelope>\n`;
  
          soapXMLData = this.normalizeXML(soapXMLData);
  
          if (defaultConfig.debug === true) {
            console.log("soapXMLData", soapXMLData);
          }
  
          if (defaultConfig.saveRequestFile) {
            const json = fs.writeFileSync(
              defaultConfig.saveRequestFile,
              soapXMLData
            );
          }
  
          console.log("soapXMLData", {
            url,
            soapXMLData,
            id,
            certificado,
            passphase,
            timeout: defaultConfig.timeout,
  
            path: "./workerConsultaSET.ts",
          });
  
          const runService = (WorkerData: any) => {
            return new Promise((resolve, reject) => {
              const worker = new Worker("./workerConsultaLote", {
                workerData: {
                  url,
                  soapXMLData,
                  certificado,
                  passphase,
                  id,
                  timeout: defaultConfig.timeout,
  
                  path: "./workerConsultaLote.ts",
                },
              });
  
              worker.on("message", resolve);
  
              worker.on("error", reject);
  
              worker.on("exit", (code) => {
                if (code !== 0)
                  reject(new Error(`stopped with  ${code} exit code`));
              });
            });
          };
  
          const run = async () => {
            const result = await runService("hello node.js");
  
            console.log(result);
          };
  
          run().catch((err) => console.error(err));
  
          /*
          axios
            .post(`${url}`, soapXMLData, {
              headers: {
                "User-Agent": "facturaSend",
                "Content-Type": "application/xml; charset=utf-8",
              },
              httpsAgent,
              timeout: defaultConfig.timeout,
            })
            .then((respuestaSuccess: any) => {
              var parser = new xml2js.Parser({ explicitArray: false });
  
              if (respuestaSuccess.status == 200) {
                if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                  parser
                    .parseStringPromise(respuestaSuccess.data)
                    .then(function (result) {
                      const resultData = JSON.parse(
                        JSON.stringify(result["env:Envelope"]["env:Body"])
                      );
                      resultData.id = id;
  
                      resolve(resultData);
                    });
                } else {
                  if ((respuestaSuccess.data + "").startsWith("<html>")) {
                    reject(new Error("Error SIFEN BIG-IP logout page"));
                  } else {
                    reject(new Error(respuestaSuccess.data + ""));
                  }
                }
              } else {
                reject(new Error("Error de conexión con SIFEN"));
              }
            })
            .catch((err: any) => {
              console.log("CAtch en error 1111", err);
              if (err && err.response && err.response.data) {
                var xmlResponse = err.response.data;
                var parser = new xml2js.Parser({ explicitArray: false });
  
                parser
                  .parseStringPromise(xmlResponse)
                  .then(function (result) {
                    resolve(result["env:Envelope"]["env:Body"]);
                  })
                  .catch(function (err) {
                    reject(err);
                  });
              } else {
                reject(err);
              }
            });
  
  
            * /
        } catch (error) {
          console.log("CAtch en error 2222", error);
          reject(error);
        }
      });
    }*/
    /**
     * Consulta un lote en SIFEN
     * @param id
     * @param numeroProtocolo
     * @returns
     */
    consultaLote(id, numeroProtocolo, env, certificado, passphase, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                };
                //console.log("El config del params viene ", config);
                defaultConfig = Object.assign(defaultConfig, config);
                this.abrir(certificado, passphase);
                let url = "https://sifen.set.gov.py/de/ws/consultas/consulta-lote.wsdl";
                if (env == "test") {
                    url =
                        "https://sifen-test.set.gov.py/de/ws/consultas/consulta-lote.wsdl";
                }
                if (!this.cert) {
                    reject("Antes debe Autenticarse");
                }
                if (!this.key) {
                    reject("Antes debe autenticarse");
                }
                const httpsAgent = new https.Agent({
                    cert: Buffer.from(this.cert, "utf8"),
                    key: Buffer.from(this.key, "utf8"),
                });
                let soapXMLData = `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                            <env:Header/>\n\
                            <env:Body>\n\
                                <rEnviConsLoteDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                    <dId>${id}</dId>\n\
                                    <dProtConsLote>${numeroProtocolo}</dProtConsLote>\n\
                                </rEnviConsLoteDe>\n\
                            </env:Body>\n\
                        </env:Envelope>\n`;
                soapXMLData = this.normalizeXML(soapXMLData);
                if (defaultConfig.debug === true) {
                    console.log("url", url, "consultaLote. soapXMLData", soapXMLData);
                }
                if (defaultConfig.saveRequestFile) {
                    const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                }
                axios
                    .post(`${url}`, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                    .then((respuestaSuccess) => {
                    var parser = new xml2js_1.default.Parser({ explicitArray: false });
                    if (respuestaSuccess.status == 200) {
                        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                            parser
                                .parseStringPromise(respuestaSuccess.data)
                                .then(function (result) {
                                const resultData = JSON.parse(JSON.stringify(result["env:Envelope"]["env:Body"]));
                                resultData.id = id;
                                resolve(resultData);
                            });
                        }
                        else {
                            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaLote. response", respuestaSuccess.data);
                                }
                                reject(new Error("Error SIFEN BIG-IP logout page"));
                            }
                            else {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaLote. response", respuestaSuccess.data);
                                }
                                reject(new Error(respuestaSuccess.data + ""));
                            }
                        }
                    }
                    else {
                        reject(new Error("Error de conexión con SIFEN"));
                    }
                })
                    .catch((err) => {
                    console.log("CAtch en error 1111", err);
                    if (err && err.response && err.response.data) {
                        var xmlResponse = err.response.data;
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(xmlResponse)
                            .then(function (result) {
                            resolve(result["env:Envelope"]["env:Body"]);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log("CAtch en error 2222", error);
                reject(error);
            }
        }));
    }
    /**
     *
     * @param xml
     * @returns
     */
    consultaRUC(id, ruc, env, certificado, passphase, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                };
                defaultConfig = Object.assign(defaultConfig, config);
                this.abrir(certificado, passphase);
                let url = "https://sifen.set.gov.py/de/ws/consultas/consulta-ruc.wsdl";
                if (env == "test") {
                    url =
                        "https://sifen-test.set.gov.py/de/ws/consultas/consulta-ruc.wsdl";
                }
                if (!this.cert) {
                    reject("Antes debe Autenticarse");
                }
                if (!this.key) {
                    reject("Antes debe autenticarse");
                }
                const httpsAgent = new https.Agent({
                    cert: Buffer.from(this.cert, "utf8"),
                    key: Buffer.from(this.key, "utf8"),
                });
                let soapXMLData = `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                            <env:Header/>\n\
                            <env:Body>\n\
                                <rEnviConsRUC xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                    <dId>${id}</dId>\n\
                                    <dRUCCons>${ruc}</dRUCCons>\n\
                                </rEnviConsRUC>\n\
                            </env:Body>\n\
                        </env:Envelope>\n`;
                soapXMLData = this.normalizeXML(soapXMLData);
                if (defaultConfig.debug === true) {
                    console.log("url", url, "consultaRUC. request", soapXMLData);
                }
                if (defaultConfig.saveRequestFile) {
                    const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                }
                axios
                    .post(`${url}`, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                    .then((respuestaSuccess) => {
                    var parser = new xml2js_1.default.Parser({ explicitArray: false });
                    //console.log("respuestaSuccess.data", respuestaSuccess.data);
                    //console.log("statuscode", respuestaSuccess.status);
                    ////console.log(respuestaSuccess.statusCode);
                    if (respuestaSuccess.status == 200) {
                        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                            parser
                                .parseStringPromise(respuestaSuccess.data)
                                .then(function (result) {
                                const resultData = result["env:Envelope"]["env:Body"];
                                resultData.id = id;
                                resolve(resultData);
                            });
                        }
                        else {
                            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaRUC. response", respuestaSuccess.data);
                                }
                                reject(new Error("Error SIFEN BIG-IP logout page"));
                            }
                            else {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("consultaRUC. response", respuestaSuccess.data);
                                }
                                reject(new Error(respuestaSuccess.data + ""));
                            }
                        }
                    }
                    else {
                        //reject(new Error("Error en la respuesta de comunicación con SIFEN " + respuestaSuccess.data));
                        reject(new Error("Error de conexión con SIFEN"));
                    }
                })
                    .catch((err) => {
                    if (err && err.response && err.response.data) {
                        var xmlResponse = err.response.data;
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(xmlResponse)
                            .then(function (result) {
                            const resultData = result["env:Envelope"]["env:Body"];
                            resultData.id = id;
                            resolve(resultData);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Envia el Documento electronico a SIFEN
     * https://sifen.set.gov.py/de/ws/sync/recibe.wsdl
     * @param xml
     * @returns
     */
    recibe(id, xml, env, certificado, passphase, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                };
                defaultConfig = Object.assign(defaultConfig, config);
                this.abrir(certificado, passphase);
                let url = "https://sifen.set.gov.py/de/ws/sync/recibe.wsdl";
                if (env == "test") {
                    url = "https://sifen-test.set.gov.py/de/ws/sync/recibe.wsdl";
                }
                if (!this.cert) {
                    reject("Antes debe Autenticarse");
                }
                if (!this.key) {
                    reject("Antes debe autenticarse");
                }
                const httpsAgent = new https.Agent({
                    cert: Buffer.from(this.cert, "utf8"),
                    key: Buffer.from(this.key, "utf8"),
                });
                xml = xml.split("\n").slice(1).join("\n"); //Retirar <xml>
                let soapXMLData = `<?xml version="1.0" encoding="UTF-8"?>\n\
                        <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                            <env:Header/>\n\
                            <env:Body>\n\
                                <rEnviDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                    <dId>${id}</dId>\n\
                                    <xDE>${xml}</xDE>\n\
                                </rEnviDe>\n\
                            </env:Body>\n\
                        </env:Envelope>\n`;
                soapXMLData = this.normalizeXML(soapXMLData);
                if (defaultConfig.debug === true) {
                    console.log("url", url, "recibe - soapXMLData", soapXMLData);
                }
                if (defaultConfig.saveRequestFile) {
                    const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                }
                axios
                    .post(`${url}`, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                    .then((respuestaSuccess) => {
                    var parser = new xml2js_1.default.Parser({ explicitArray: false });
                    if (respuestaSuccess.status == 200) {
                        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                            parser
                                .parseStringPromise(respuestaSuccess.data)
                                .then(function (result) {
                                //resolve(result['env:Envelope']['env:Body']);
                                const resultData = 
                                //result["env:Envelope"]["env:Body"]["ns2:rRetEnviDe"];
                                result["env:Envelope"]["env:Body"];
                                //delete resultData.$;
                                resultData["id"] = id;
                                resolve(resultData);
                            });
                        }
                        else {
                            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                //console.log("setApi - recibe " + respuestaSuccess.data);
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("recibe. response", respuestaSuccess.data);
                                }
                                reject(new Error("Error SIFEN BIG-IP logout page"));
                            }
                            else {
                                //imprimir log solo si hay posible error
                                if (defaultConfig.debug === true) {
                                    console.log("recibe. response", respuestaSuccess.data);
                                }
                                reject(new Error(respuestaSuccess.data + ""));
                            }
                        }
                    }
                    else {
                        //reject(new Error("Error en la respuesta de comunicación con SIFEN " + respuestaSuccess.data));
                        reject(new Error("Error de conexión con SIFEN"));
                    }
                })
                    .catch((err) => {
                    if (err && err.response && err.response.data) {
                        var xmlResponse = err.response.data;
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(xmlResponse)
                            .then(function (result) {
                            const resultData = result["env:Envelope"]["env:Body"];
                            resultData["id"] = id;
                            resolve(resultData);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Envia el Documento electronico por lote a SIFEN
     * https://sifen.set.gov.py/de/ws/async/recibe-lote.wsdl
     * @param xmls
     * @returns
     */
    recibeLote(id, xmls, env, certificado, passphase, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                };
                defaultConfig = Object.assign(defaultConfig, config);
                this.abrir(certificado, passphase);
                if (xmls.length == 0) {
                    reject("No se envió datos en el array de Documentos electrónicos XMLs");
                }
                if (xmls.length > 50) {
                    reject("Sólo se permiten un máximo de 50 Documentos electrónicos XML por lote");
                }
                let url = "https://sifen.set.gov.py/de/ws/async/recibe-lote.wsdl";
                if (env == "test") {
                    url = "https://sifen-test.set.gov.py/de/ws/async/recibe-lote.wsdl";
                }
                if (!this.cert) {
                    reject("Antes debe Autenticarse");
                }
                if (!this.key) {
                    reject("Antes debe autenticarse");
                }
                // Capturar la identidad TLS antes de ceder la ejecución al comprimir.
                const httpsAgent = new https.Agent({
                    cert: Buffer.from(this.cert, "utf8"),
                    key: Buffer.from(this.key, "utf8"),
                });
                const zip = new jszip_1.default();
                let rLoteDEXml = `<rLoteDE>\n`;
                for (let i = 0; i < xmls.length; i++) {
                    //const xml = xmls[i];
                    const xml = xmls[i].split("\n").slice(1).join("\n"); //Retirar xml
                    rLoteDEXml += `${xml}\n`;
                }
                rLoteDEXml += `</rLoteDE>`;
                rLoteDEXml = this.normalizeXML(rLoteDEXml);
                zip.file(`xml_file.xml`, `<?xml version="1.0" encoding="UTF-8"?>${rLoteDEXml}`);
                const zipAsBase64 = yield zip.generateAsync({ type: "base64" });
                //fs.writeFileSync(__dirname + '/zipped.zip', zipAsBase64);
                //axios.get(`${url}`, { httpsAgent }).then((respuesta: any) => {
                let soapXMLData = `<?xml version="1.0" encoding="UTF-8"?>\n\
                        <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                            <env:Header/>\n\
                            <env:Body>\n\
                                <rEnvioLote xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                    <dId>${id}</dId>\n\
                                    <xDE>${zipAsBase64}</xDE>\n\
                                </rEnvioLote>\n\
                            </env:Body>\n\
                        </env:Envelope>\n`;
                soapXMLData = this.normalizeXML(soapXMLData);
                if (defaultConfig.debug === true) {
                    console.log("url", url, "recibe. soapXMLData", soapXMLData);
                }
                if (defaultConfig.saveRequestFile) {
                    const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                }
                axios
                    .post(`${url}`, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                    .then((respuestaSuccess) => {
                    var parser = new xml2js_1.default.Parser({ explicitArray: false });
                    if (respuestaSuccess.status == 200) {
                        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                            parser
                                .parseStringPromise(respuestaSuccess.data)
                                .then(function (result) {
                                //resolve(result['env:Envelope']['env:Body']['ns2:rResEnviLoteDe']);
                                const resultData = 
                                //result["env:Envelope"]["env:Body"]["ns2:rResEnviLoteDe"];
                                result["env:Envelope"]["env:Body"];
                                resultData["id"] = id;
                                //result['env:Envelope']['env:Body']['ns2:rResEnviLoteDe']['id'] = id;
                                //const resultData = result['env:Envelope']['env:Body'];
                                delete resultData.$;
                                resolve(resultData);
                            });
                        }
                        else {
                            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                //console.log("setApi - recibe " + respuestaSuccess.data);
                                if (defaultConfig.debug === true) {
                                    console.log("recibeLote. response", respuestaSuccess.data);
                                }
                                reject(new Error("Error SIFEN BIG-IP logout page"));
                            }
                            else {
                                if (defaultConfig.debug === true) {
                                    console.log("recibeLote. response", respuestaSuccess.data);
                                }
                                reject(new Error(respuestaSuccess.data + ""));
                            }
                        }
                    }
                    else {
                        reject(new Error("Error de conexión con SIFEN"));
                    }
                })
                    .catch((err) => {
                    if (err && err.response && err.response.data) {
                        var xmlResponse = err.response.data;
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(xmlResponse)
                            .then(function (result) {
                            const resultData = 
                            /*result["env:Envelope"]["env:Body"]["ns2:rRetEnviDe"][
                            "ns2:rProtDe"
                          ];*/
                            result["env:Envelope"]["env:Body"];
                            resultData["id"] = id;
                            resolve(resultData);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     *
     * @param xml
     * @returns
     */
    evento(id, xml, env, certificado, passphase, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let defaultConfig = {
                        debug: false,
                        timeout: 90000,
                    };
                    defaultConfig = Object.assign(defaultConfig, config);
                    this.abrir(certificado, passphase);
                    let url = "https://sifen.set.gov.py/de/ws/eventos/evento.wsdl";
                    if (env == "test") {
                        url = "https://sifen-test.set.gov.py/de/ws/eventos/evento.wsdl";
                    }
                    if (!this.cert) {
                        reject("Antes debe Autenticarse");
                    }
                    if (!this.key) {
                        reject("Antes debe autenticarse");
                    }
                    const httpsAgent = new https.Agent({
                        cert: Buffer.from(this.cert, "utf8"),
                        key: Buffer.from(this.key, "utf8"),
                    });
                    let soapXMLData = this.normalizeXML(xml); //Para el evento, el xml ya viene con SoapData
                    if (defaultConfig.debug === true) {
                        console.log("url", url, "evento. soapXMLData", soapXMLData);
                    }
                    if (defaultConfig.saveRequestFile) {
                        const json = fs_1.default.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
                    }
                    axios
                        .post(`${url}`, soapXMLData, {
                        headers: {
                            "User-Agent": "facturaSend",
                            "Content-Type": "application/xml; charset=utf-8",
                        },
                        httpsAgent,
                        timeout: defaultConfig.timeout,
                    })
                        .then((respuestaSuccess) => {
                        var parser = new xml2js_1.default.Parser({ explicitArray: false });
                        if (respuestaSuccess.status == 200) {
                            if ((respuestaSuccess.data + "").startsWith("<?xml")) {
                                parser
                                    .parseStringPromise(respuestaSuccess.data)
                                    .then(function (result) {
                                    ///resolve(result['env:Envelope']['env:Body']);
                                    const resultData = result["env:Envelope"]["env:Body"];
                                    resultData.id = id;
                                    //delete resultData.$;
                                    resolve(resultData);
                                });
                            }
                            else {
                                if ((respuestaSuccess.data + "").startsWith("<html>")) {
                                    //console.log("setApi - recibe " + respuestaSuccess.data);
                                    //imprimir log solo si hay posible error
                                    if (defaultConfig.debug === true) {
                                        console.log("evento. response", respuestaSuccess.data);
                                    }
                                    reject(new Error("Error SIFEN BIG-IP logout page"));
                                }
                                else {
                                    //imprimir log solo si hay posible error
                                    if (defaultConfig.debug === true) {
                                        console.log("evento. response", respuestaSuccess.data);
                                    }
                                    reject(new Error(respuestaSuccess.data + ""));
                                }
                            }
                        }
                        else {
                            reject(new Error("Error de conexión con SIFEN"));
                        }
                    })
                        .catch((err) => {
                        if (err && err.response && err.response.data) {
                            var xmlResponse = err.response.data;
                            var parser = new xml2js_1.default.Parser({ explicitArray: false });
                            parser
                                .parseStringPromise(xmlResponse)
                                .then(function (result) {
                                const resultData = result["env:Envelope"]["env:Body"];
                                resultData.id = id;
                                resolve(resultData);
                            })
                                .catch(function (err) {
                                reject(err);
                            });
                        }
                        else {
                            reject(err);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    normalizeXML(xml) {
        xml = xml.split("\r\n").join("");
        xml = xml.split("\n").join("");
        xml = xml.split("\t").join("");
        xml = xml.split("    ").join("");
        xml = xml.split(">    <").join("><");
        xml = xml.split(">  <").join("><");
        xml = xml.replace(/\r?\n|\r/g, "");
        return xml;
    }
}
exports.default = new SET();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0VULmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1NFVC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUMxQixzREFBOEI7QUFDOUIsb0RBQTRCO0FBQzVCLDRDQUFvQjtBQUlwQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRS9CLE1BQU0sR0FBRztJQUtQOzs7Ozs7Ozs7OztNQVdFO0lBRUYsS0FBSyxDQUFDLFdBQWdCLEVBQUUsU0FBaUI7UUFDdkMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsUUFBUSxDQUNOLEVBQVUsRUFDVixHQUFXLEVBQ1gsR0FBb0IsRUFDcEIsV0FBZ0IsRUFDaEIsU0FBYyxFQUNkLE1BQXFCO1FBRXJCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsSUFBSTtnQkFDRixJQUFJLGFBQWEsR0FBaUI7b0JBQ2hDLEtBQUssRUFBRSxLQUFLO29CQUNaLE9BQU8sRUFBRSxLQUFLO2lCQUNmLENBQUM7Z0JBRUYsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFbkMsSUFBSSxHQUFHLEdBQUcsd0RBQXdELENBQUM7Z0JBQ25FLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtv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
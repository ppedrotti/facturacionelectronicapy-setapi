import { SetApiConfig } from "./type.interface.";
declare class SET {
    private cert;
    private key;
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
    abrir(certificado: any, passphase: string): void;
    /**
     * Consulta un Documento Electronico por CDC
     *
     * @param cdc
     * @returns
     */
    consulta(id: number, cdc: string, env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    /**
     * Consulta un lote en SIFEN
     * @param id
     * @param numeroProtocolo
     * @returns
     */
    /**
     * Consulta un lote en SIFEN
     * @param id
     * @param numeroProtocolo
     * @returns
     */
    consultaLote(id: number, numeroProtocolo: number, env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    /**
     *
     * @param xml
     * @returns
     */
    consultaRUC(id: number, ruc: string, env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    /**
     * Envia el Documento electronico a SIFEN
     * https://sifen.set.gov.py/de/ws/sync/recibe.wsdl
     * @param xml
     * @returns
     */
    recibe(id: number, xml: string, env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    /**
     * Envia el Documento electronico por lote a SIFEN
     * https://sifen.set.gov.py/de/ws/async/recibe-lote.wsdl
     * @param xmls
     * @returns
     */
    recibeLote(id: number, xmls: string[], env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    /**
     *
     * @param xml
     * @returns
     */
    evento(id: number, xml: string, env: "test" | "prod", certificado: any, passphase: any, config?: SetApiConfig): Promise<any>;
    private normalizeXML;
}
declare const _default: SET;
export default _default;

import { SetApiConfig } from "./type.interface.";
declare class SetAPI {
    consulta: (id: number, cdc: string, env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
    consultaRUC: (id: number, ruc: string, env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
    consultaLote: (id: number, numeroLote: number, env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
    recibe: (id: number, xml: string, env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
    recibeLote: (id: number, xml: string[], env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
    evento: (id: number, xml: string, env: "test" | "prod", cert: any, key: string, config?: SetApiConfig | undefined) => Promise<any>;
}
declare const _default: SetAPI;
export default _default;

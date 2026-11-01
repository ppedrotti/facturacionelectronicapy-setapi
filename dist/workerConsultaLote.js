"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = __importDefault(require("xml2js"));
const PKCS12_1 = __importDefault(require("./PKCS12"));
const https = require("https");
const axios = require("axios");
const { workerData, parentPort } = require("worker_threads");
//this.abrir(workerData.certificado, workerData.passphase);
PKCS12_1.default.openFile(workerData.certificado, workerData.passphase);
const cert = PKCS12_1.default.getCertificate();
const key = PKCS12_1.default.getPrivateKey();
if (!cert) {
    throw new Error("Antes debe Autenticarse");
}
if (!key) {
    throw new Error("Antes debe autenticarse");
}
const httpsAgent = new https.Agent({
    cert: Buffer.from(cert, "utf8"),
    key: Buffer.from(key, "utf8"),
});
axios
    .post(`${workerData.url}`, workerData.soapXMLData, {
    headers: {
        "User-Agent": "facturaSend",
        "Content-Type": "application/xml; charset=utf-8",
    },
    httpsAgent,
    timeout: workerData.timeout,
})
    .then((respuestaSuccess) => {
    var parser = new xml2js_1.default.Parser({ explicitArray: false });
    if (respuestaSuccess.status == 200) {
        if ((respuestaSuccess.data + "").startsWith("<?xml")) {
            parser
                .parseStringPromise(respuestaSuccess.data)
                .then(function (result) {
                const resultData = JSON.parse(JSON.stringify(result["env:Envelope"]["env:Body"]));
                resultData.id = workerData.id;
                parentPort.postMessage(resultData);
            });
        }
        else {
            if ((respuestaSuccess.data + "").startsWith("<html>")) {
                throw new Error("Error SIFEN BIG-IP logout page");
            }
            else {
                throw new Error(respuestaSuccess.data + "");
            }
        }
    }
    else {
        throw new Error("Error de conexión con SIFEN");
    }
})
    .catch((err) => {
    console.log("CAtch en error 1111", err);
    if (err && err.response && err.response.data) {
        var xmlResponse = err.response.data;
        var parser = new xml2js_1.default.Parser({ explicitArray: false });
        parser
            .parseStringPromise(xmlResponse)
            .then(function (resultData) {
            parentPort.postMessage(resultData);
        })
            .catch(function (err) {
            throw err;
        });
    }
    else {
        throw err;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyQ29uc3VsdGFMb3RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dvcmtlckNvbnN1bHRhTG90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTdELDJEQUEyRDtBQUUzRCxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5RCxNQUFNLElBQUksR0FBRyxnQkFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxHQUFHLGdCQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFFbkMsSUFBSSxDQUFDLElBQUksRUFBRTtJQUNULE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztDQUM1QztBQUVELElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDUixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Q0FDNUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDakMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztJQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO0NBQzlCLENBQUMsQ0FBQztBQUVILEtBQUs7S0FDRixJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxDQUFDLFdBQVcsRUFBRTtJQUNqRCxPQUFPLEVBQUU7UUFDUCxZQUFZLEVBQUUsYUFBYTtRQUMzQixjQUFjLEVBQUUsZ0NBQWdDO0tBQ2pEO0lBQ0QsVUFBVTtJQUNWLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTztDQUM1QixDQUFDO0tBQ0QsSUFBSSxDQUFDLENBQUMsZ0JBQXFCLEVBQUUsRUFBRTtJQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFekQsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BELE1BQU07aUJBQ0gsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2lCQUN6QyxJQUFJLENBQUMsVUFBVSxNQUFNO2dCQUNwQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUNuRCxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFFOUIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO2FBQ25EO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1NBQ0Y7S0FDRjtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2hEO0FBQ0gsQ0FBQyxDQUFDO0tBQ0QsS0FBSyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQzVDLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV6RCxNQUFNO2FBQ0gsa0JBQWtCLENBQUMsV0FBVyxDQUFDO2FBQy9CLElBQUksQ0FBQyxVQUFVLFVBQVU7WUFDeEIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsVUFBVSxHQUFHO1lBQ2xCLE1BQU0sR0FBRyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7S0FDTjtTQUFNO1FBQ0wsTUFBTSxHQUFHLENBQUM7S0FDWDtBQUNILENBQUMsQ0FBQyxDQUFDIn0=
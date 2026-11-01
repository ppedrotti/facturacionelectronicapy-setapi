"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_forge_1 = __importDefault(require("node-forge"));
class PKCS12 {
    openCertificate(file) {
        const pkcs12 = fs_1.default.readFileSync(file);
        this.p12Asn1 = node_forge_1.default.asn1.fromDer(pkcs12.toString("binary"));
    }
    openFile(file, passphase) {
        this.openCertificate(file);
        this.p12 = node_forge_1.default.pkcs12.pkcs12FromAsn1(this.p12Asn1, false, passphase);
    }
    clean() {
        this.p12 = undefined;
    }
    getPrivateKey() {
        for (let i = 0; i < this.p12.safeContents.length; i++) {
            if (this.p12.safeContents[i].safeBags[0].key) {
                return node_forge_1.default.pki.privateKeyToPem(this.p12.safeContents[i].safeBags[0].key);
                //return this.p12.safeContents[i].safeBags[0].key;
            }
        }
        return null;
    }
    getCertificate() {
        for (let i = 0; i < this.p12.safeContents.length; i++) {
            if (this.p12.safeContents[i].safeBags[0].cert) {
                const b64 = node_forge_1.default.pki.certificateToPem(this.p12.safeContents[i].safeBags[0].cert);
                //forge.pki.
                //const l = b64.split('\n');
                //l.pop();
                //l.pop();
                //l[0] = '';
                return b64;
            }
        }
        return null;
    }
    getCertificateBK() {
        for (let i = 0; i < this.p12.safeContents.length; i++) {
            if (this.p12.safeContents[i].safeBags[0].cert) {
                const b64 = node_forge_1.default.pki.certificateToPem(this.p12.safeContents[i].safeBags[0].cert);
                const l = b64.split("\n");
                l.pop();
                l.pop();
                l[0] = "";
                return l.join("\n");
            }
        }
        return null;
    }
    signature(xml, privateKey) {
        const md = node_forge_1.default.md.sha256.create();
        md.update(xml, "utf8");
        var key = node_forge_1.default.pki.privateKeyFromPem(privateKey);
        return key.sign(md);
    }
}
exports.default = new PKCS12();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEtDUzEyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BLQ1MxMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQiw0REFBK0I7QUFFL0IsTUFBTSxNQUFNO0lBSVYsZUFBZSxDQUFDLElBQVk7UUFDMUIsTUFBTSxNQUFNLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsR0FBRyxHQUFHLG9CQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxhQUFhO1FBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQzVDLE9BQU8sb0JBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUN6QyxDQUFDO2dCQUNGLGtEQUFrRDthQUNuRDtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsY0FBYztRQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUM3QyxNQUFNLEdBQUcsR0FBRyxvQkFBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDMUMsQ0FBQztnQkFDRixZQUFZO2dCQUNaLDRCQUE0QjtnQkFDNUIsVUFBVTtnQkFDVixVQUFVO2dCQUNWLFlBQVk7Z0JBQ1osT0FBTyxHQUFHLENBQUM7YUFDWjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzdDLE1BQU0sR0FBRyxHQUFHLG9CQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMxQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDVixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckI7U0FDRjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXLEVBQUUsVUFBZTtRQUNwQyxNQUFNLEVBQUUsR0FBRyxvQkFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxHQUFHLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksTUFBTSxFQUFFLENBQUMifQ==
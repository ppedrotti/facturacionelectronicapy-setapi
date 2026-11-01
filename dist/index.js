"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SET_1 = __importDefault(require("./SET"));
class SetAPI {
    constructor() {
        this.consulta = (id, cdc, env, cert, key, config) => {
            return SET_1.default.consulta(id, cdc, env, cert, key, config);
        };
        this.consultaRUC = (id, ruc, env, cert, key, config) => {
            return SET_1.default.consultaRUC(id, ruc, env, cert, key, config);
        };
        this.consultaLote = (id, numeroLote, env, cert, key, config) => {
            return SET_1.default.consultaLote(id, numeroLote, env, cert, key, config);
        };
        this.recibe = (id, xml, env, cert, key, config) => {
            return SET_1.default.recibe(id, xml, env, cert, key, config);
        };
        this.recibeLote = (id, xml, env, cert, key, config) => {
            return SET_1.default.recibeLote(id, xml, env, cert, key, config);
        };
        this.evento = (id, xml, env, cert, key, config) => {
            return SET_1.default.evento(id, xml, env, cert, key, config);
        };
    }
}
exports.default = new SetAPI();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFHeEIsTUFBTSxNQUFNO0lBQVo7UUFDRSxhQUFRLEdBQUcsQ0FDVCxFQUFVLEVBQ1YsR0FBVyxFQUNYLEdBQW9CLEVBQ3BCLElBQVMsRUFDVCxHQUFXLEVBQ1gsTUFBcUIsRUFDUCxFQUFFO1lBQ2hCLE9BQU8sYUFBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQztRQUNGLGdCQUFXLEdBQUcsQ0FDWixFQUFVLEVBQ1YsR0FBVyxFQUNYLEdBQW9CLEVBQ3BCLElBQVMsRUFDVCxHQUFXLEVBQ1gsTUFBcUIsRUFDUCxFQUFFO1lBQ2hCLE9BQU8sYUFBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQztRQUNGLGlCQUFZLEdBQUcsQ0FDYixFQUFVLEVBQ1YsVUFBa0IsRUFDbEIsR0FBb0IsRUFDcEIsSUFBUyxFQUNULEdBQVcsRUFDWCxNQUFxQixFQUNQLEVBQUU7WUFDaEIsT0FBTyxhQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDO1FBQ0YsV0FBTSxHQUFHLENBQ1AsRUFBVSxFQUNWLEdBQVcsRUFDWCxHQUFvQixFQUNwQixJQUFTLEVBQ1QsR0FBVyxFQUNYLE1BQXFCLEVBQ1AsRUFBRTtZQUNoQixPQUFPLGFBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUM7UUFDRixlQUFVLEdBQUcsQ0FDWCxFQUFVLEVBQ1YsR0FBYSxFQUNiLEdBQW9CLEVBQ3BCLElBQVMsRUFDVCxHQUFXLEVBQ1gsTUFBcUIsRUFDUCxFQUFFO1lBQ2hCLE9BQU8sYUFBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQztRQUNGLFdBQU0sR0FBRyxDQUNQLEVBQVUsRUFDVixHQUFXLEVBQ1gsR0FBb0IsRUFDcEIsSUFBUyxFQUNULEdBQVcsRUFDWCxNQUFxQixFQUNQLEVBQUU7WUFDaEIsT0FBTyxhQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUFBO0FBRUQsa0JBQWUsSUFBSSxNQUFNLEVBQUUsQ0FBQyJ9
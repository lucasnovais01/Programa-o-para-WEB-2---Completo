"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidadeControllerFindAll = void 0;
const common_1 = require("@nestjs/common");
const cidade_service_findall_1 = require("../service/cidade.service.findall");
const url_sistema_1 = require("../../commons/constants/url.sistema");
const mensagem_sistema_1 = require("../../commons/mensagem/mensagem.sistema");
let CidadeControllerFindAll = class CidadeControllerFindAll {
    cidadeServiceFindAll;
    constructor(cidadeServiceFindAll) {
        this.cidadeServiceFindAll = cidadeServiceFindAll;
    }
    async findAll(res) {
        const response = await this.cidadeServiceFindAll.findAll();
        return mensagem_sistema_1.MensagemSistema.showMensagem(common_1.HttpStatus.OK, 'Lista de cidade gerada com sucesso!', response, res.path, null);
    }
};
exports.CidadeControllerFindAll = CidadeControllerFindAll;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(url_sistema_1.ROTA.CIDADE.LIST),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CidadeControllerFindAll.prototype, "findAll", null);
exports.CidadeControllerFindAll = CidadeControllerFindAll = __decorate([
    (0, common_1.Controller)(url_sistema_1.ROTA.CIDADE.BASE),
    __metadata("design:paramtypes", [cidade_service_findall_1.CidadeServiceFindAll])
], CidadeControllerFindAll);
//# sourceMappingURL=cidade.controller.findall.js.map
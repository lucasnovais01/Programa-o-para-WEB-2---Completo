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
exports.CidadeControllerRemove = void 0;
const common_1 = require("@nestjs/common");
const cidade_service_remove_1 = require("../service/cidade.service.remove");
const url_sistema_1 = require("../../commons/constants/url.sistema");
const mensagem_sistema_1 = require("../../commons/mensagem/mensagem.sistema");
let CidadeControllerRemove = class CidadeControllerRemove {
    cidadeServiceRemove;
    constructor(cidadeServiceRemove) {
        this.cidadeServiceRemove = cidadeServiceRemove;
    }
    async remove(req, id) {
        await this.cidadeServiceRemove.remove(id);
        const rawPath = req.path ?? req.url ?? req.originalUrl;
        const path = typeof rawPath === 'string' ? rawPath : null;
        return mensagem_sistema_1.MensagemSistema.showMensagem(common_1.HttpStatus.NO_CONTENT, 'Cidade excluída com sucesso!', null, path, null);
    }
};
exports.CidadeControllerRemove = CidadeControllerRemove;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(url_sistema_1.ROTA.CIDADE.DELETE),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CidadeControllerRemove.prototype, "remove", null);
exports.CidadeControllerRemove = CidadeControllerRemove = __decorate([
    (0, common_1.Controller)(url_sistema_1.ROTA.CIDADE.BASE),
    __metadata("design:paramtypes", [cidade_service_remove_1.CidadeServiceRemove])
], CidadeControllerRemove);
//# sourceMappingURL=cidade.controller.remove.js.map
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
exports.CidadeControllerCreate = void 0;
const common_1 = require("@nestjs/common");
const cidade_request_1 = require("../dto/request/cidade.request");
const cidade_service_create_1 = require("../service/cidade.service.create");
const url_sistema_1 = require("../../commons/constants/url.sistema");
const cidade_response_1 = require("../dto/response/cidade.response");
const mensagem_sistema_1 = require("../../commons/mensagem/mensagem.sistema");
const swagger_1 = require("@nestjs/swagger");
const cidade_constants_1 = require("../constants/cidade.constants");
const swagger_decorators_1 = require("../../commons/decorators/swagger.decorators");
let CidadeControllerCreate = class CidadeControllerCreate {
    cidadeServiceCreate;
    constructor(cidadeServiceCreate) {
        this.cidadeServiceCreate = cidadeServiceCreate;
    }
    async create(res, cidadeRequest) {
        const response = await this.cidadeServiceCreate.create(cidadeRequest);
        return mensagem_sistema_1.MensagemSistema.showMensagem(common_1.HttpStatus.CREATED, 'Cidade cadastrada com sucesso!!!', response, res.path, null);
    }
};
exports.CidadeControllerCreate = CidadeControllerCreate;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(url_sistema_1.ROTA.CIDADE.CREATE),
    (0, swagger_decorators_1.ApiPostDoc)(cidade_constants_1.CIDADE.OPERACAO.CRIAR, cidade_request_1.CidadeRequest, cidade_response_1.CidadeResponse),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: cidade_constants_1.CIDADE.OPERACAO.CRIAR.SUCESSO,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: cidade_constants_1.CIDADE.OPERACAO.CRIAR.ERROR,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Erro interno no servidor',
    }),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiProduces)('application/json'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cidade_request_1.CidadeRequest]),
    __metadata("design:returntype", Promise)
], CidadeControllerCreate.prototype, "create", null);
exports.CidadeControllerCreate = CidadeControllerCreate = __decorate([
    (0, swagger_1.ApiTags)('CIDADE'),
    (0, common_1.Controller)(url_sistema_1.ROTA.CIDADE.BASE),
    __metadata("design:paramtypes", [cidade_service_create_1.CidadeServiceCreate])
], CidadeControllerCreate);
//# sourceMappingURL=cidade.controller.create.js.map
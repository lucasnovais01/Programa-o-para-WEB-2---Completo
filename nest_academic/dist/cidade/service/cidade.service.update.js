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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidadeServiceUpdate = void 0;
const common_1 = require("@nestjs/common");
const cidade_converter_1 = require("../dto/converter/cidade.converter");
const tabela_service_1 = require("./tabela.service");
let CidadeServiceUpdate = class CidadeServiceUpdate {
    cidades = tabela_service_1.tabelaCidade;
    constructor() { }
    update(id, cidadeRequest) {
        const cidade = cidade_converter_1.ConverterCidade.toCidade(cidadeRequest);
        const cidadeIndex = this.cidades.findIndex((c) => c.idCidade === id);
        const cidadeCadastrada = this.cidades[cidadeIndex];
        this.cidades[cidadeIndex] = {
            ...cidadeCadastrada,
            ...cidade,
        };
        const cidadeResponse = cidade_converter_1.ConverterCidade.toCidadeResponse(this.cidades[cidadeIndex]);
        return cidadeResponse;
    }
};
exports.CidadeServiceUpdate = CidadeServiceUpdate;
exports.CidadeServiceUpdate = CidadeServiceUpdate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CidadeServiceUpdate);
//# sourceMappingURL=cidade.service.update.js.map
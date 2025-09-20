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
exports.CidadeServiceCreate = void 0;
const common_1 = require("@nestjs/common");
const cidade_converter_1 = require("../dto/converter/cidade.converter");
const typeorm_1 = require("typeorm");
const cidade_entity_1 = require("../entity/cidade.entity");
const typeorm_2 = require("@nestjs/typeorm");
let CidadeServiceCreate = class CidadeServiceCreate {
    cidadeRepository;
    constructor(cidadeRepository) {
        this.cidadeRepository = cidadeRepository;
    }
    async create(cidadeRequest) {
        let cidade = cidade_converter_1.ConverterCidade.toCidade(cidadeRequest);
        const cidadeCadastrada = await this.cidadeRepository
            .createQueryBuilder('cidade')
            .where('cidade.nomeCidade =:nome', { nome: cidade.nomeCidade })
            .getOne();
        if (cidadeCadastrada) {
            throw new common_1.HttpException('A cidade com o nome informado já está cadastrada', common_1.HttpStatus.BAD_REQUEST);
        }
        cidade = await this.cidadeRepository.save(cidade);
        return cidade_converter_1.ConverterCidade.toCidadeResponse(cidade);
    }
};
exports.CidadeServiceCreate = CidadeServiceCreate;
exports.CidadeServiceCreate = CidadeServiceCreate = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cidade_entity_1.Cidade)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CidadeServiceCreate);
//# sourceMappingURL=cidade.service.create.js.map
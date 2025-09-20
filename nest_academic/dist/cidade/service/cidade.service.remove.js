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
exports.CidadeServiceRemove = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cidade_entity_1 = require("../entity/cidade.entity");
const typeorm_2 = require("typeorm");
const cidade_service_findone_1 = require("./cidade.service.findone");
let CidadeServiceRemove = class CidadeServiceRemove {
    cidadeRepository;
    service;
    constructor(cidadeRepository, service) {
        this.cidadeRepository = cidadeRepository;
        this.service = service;
    }
    async remove(idCidade) {
        const cidadeCadastrada = await this.cidadeRepository.findById(idCidade);
        createQueryBuilder('cidade')
            .where('cidade.ID_CIDADE = :idCidade', { idCidade: idCidade })
            .getOne();
        if (cidadeCadastrada?.idCidade) {
            throw new Error('Cidade não localizada');
        }
        await this.cidadeRepository
            .createQueryBuilder('cidade')
            .delete(cidadeCadastrada.idCidade)
            .from(cidade_entity_1.Cidade)
            .where('cidade.ID_CIDADE = idCidade', idCidade, cidadeCadastrada.idCidade);
    }
};
exports.CidadeServiceRemove = CidadeServiceRemove;
exports.CidadeServiceRemove = CidadeServiceRemove = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cidade_entity_1.Cidade)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cidade_service_findone_1.CidadeServiceFindOne])
], CidadeServiceRemove);
//# sourceMappingURL=cidade.service.remove.js.map
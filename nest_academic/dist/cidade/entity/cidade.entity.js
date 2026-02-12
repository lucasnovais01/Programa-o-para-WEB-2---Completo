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
exports.Cidade = void 0;
const typeorm_1 = require("typeorm");
let Cidade = class Cidade extends typeorm_1.BaseEntity {
    idCidade = 0;
    codCidade = '';
    nomeCidade = '';
    constructor(data = {}) {
        super();
        Object.assign(this, data);
    }
};
exports.Cidade = Cidade;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', {
        name: 'ID_CIDADE',
    }),
    __metadata("design:type", Number)
], Cidade.prototype, "idCidade", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'COD_CIDADE',
        type: 'varchar2',
        length: 10,
    }),
    __metadata("design:type", String)
], Cidade.prototype, "codCidade", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'NOME_CIDADE',
        type: 'varchar2',
        length: 20,
    }),
    __metadata("design:type", String)
], Cidade.prototype, "nomeCidade", void 0);
exports.Cidade = Cidade = __decorate([
    (0, typeorm_1.Entity)('CIDADE'),
    __metadata("design:paramtypes", [Object])
], Cidade);
//# sourceMappingURL=cidade.entity.js.map
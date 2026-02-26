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
exports.CidadeRequest = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const cidade_constants_1 = require("../../constants/cidade.constants");
class CidadeRequest {
    idCidade;
    codCidade = '';
    nomeCidade = '';
    constructor(data = {}) {
        Object.assign(this, data);
    }
}
exports.CidadeRequest = CidadeRequest;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ description: cidade_constants_1.CIDADE.SWAGGER.ID_CIDADE, example: '1' }),
    __metadata("design:type", Number)
], CidadeRequest.prototype, "idCidade", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'CIDADE.INPUT_ERROR.COD_CIDADE.BLANK' }),
    (0, class_validator_1.IsString)({ message: 'CIDADE.INPUT_ERROR.COD_CIDADE.STRING' }),
    (0, class_validator_1.MaxLength)(10, {
        message: 'O tamanho máximo é de 10 caracteres para o campo',
    }),
    (0, swagger_1.ApiProperty)({ description: cidade_constants_1.CIDADE.SWAGGER.COD_CIDADE, example: 'COD120' }),
    __metadata("design:type", String)
], CidadeRequest.prototype, "codCidade", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome da ciadade deve ser informado' }),
    (0, class_validator_1.IsString)({ message: 'A informação só pode conter somente texto' }),
    (0, class_validator_1.MaxLength)(50, {
        message: 'O tamanho máximo é de 10 caracteres para o nome da cidade',
    }),
    __metadata("design:type", String)
], CidadeRequest.prototype, "nomeCidade", void 0);
//# sourceMappingURL=cidade.request.js.map
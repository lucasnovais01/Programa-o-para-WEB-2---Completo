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
exports.CidadeControllerFindOne = void 0;
const common_1 = require("@nestjs/common");
const cidade_service_findone_1 = require("../service/cidade.service.findone");
const url_sistema_1 = require("../../commons/constants/url.sistema");
let CidadeControllerFindOne = class CidadeControllerFindOne {
    cidadeServiceFindOne;
    constructor(cidadeServiceFindOne) {
        this.cidadeServiceFindOne = cidadeServiceFindOne;
    }
    findOne() {
        return null;
    }
};
exports.CidadeControllerFindOne = CidadeControllerFindOne;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(url_sistema_1.ROTA.CIDADE.BY_ID),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CidadeControllerFindOne.prototype, "findOne", null);
exports.CidadeControllerFindOne = CidadeControllerFindOne = __decorate([
    (0, common_1.Controller)(url_sistema_1.ROTA.CIDADE.BASE),
    __metadata("design:paramtypes", [cidade_service_findone_1.CidadeServiceFindOne])
], CidadeControllerFindOne);
//# sourceMappingURL=cidade.controller.findone.js.map
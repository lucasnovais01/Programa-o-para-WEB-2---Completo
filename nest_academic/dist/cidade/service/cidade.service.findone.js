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
exports.CidadeServiceFindOne = void 0;
const common_1 = require("@nestjs/common");
let CidadeServiceFindOne = class CidadeServiceFindOne {
    cidadeServiceFindOne;
    constructor(cidadeServiceFindOne) {
        this.cidadeServiceFindOne = cidadeServiceFindOne;
    }
    findOne(id) {
        const cidade = this.cidadeServiceFindOne.find((c) => c.idCidade === id);
        return cidade;
    }
};
exports.CidadeServiceFindOne = CidadeServiceFindOne;
exports.CidadeServiceFindOne = CidadeServiceFindOne = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CidadeServiceFindOne])
], CidadeServiceFindOne);
//# sourceMappingURL=cidade.service.findone.js.map
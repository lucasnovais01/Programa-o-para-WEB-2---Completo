"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidadeModule = void 0;
const common_1 = require("@nestjs/common");
const cidade_controller_findall_1 = require("./controllers/cidade.controller.findall");
const cidade_controller_findone_1 = require("./controllers/cidade.controller.findone");
const cidade_controller_create_1 = require("./controllers/cidade.controller.create");
const cidade_controller_update_1 = require("./controllers/cidade.controller.update");
const cidade_controller_remove_1 = require("./controllers/cidade.controller.remove");
const cidade_service_create_1 = require("./service/cidade.service.create");
const cidade_service_update_1 = require("./service/cidade.service.update");
const cidade_service_remove_1 = require("./service/cidade.service.remove");
const cidade_service_findall_1 = require("./service/cidade.service.findall");
const cidadeControllers = [
    cidade_controller_findall_1.CidadeControllerFindAll,
    cidade_controller_findone_1.CidadeControllerFindOne,
    cidade_controller_create_1.CidadeControllerCreate,
    cidade_controller_update_1.CidadeControllerUpdate,
    cidade_controller_remove_1.CidadeControllerRemove,
];
const cidadeServices = [
    cidade_service_create_1.CidadeServiceCreate,
    cidade_service_update_1.CidadeServiceUpdate,
    cidade_service_remove_1.CidadeServiceRemove,
    cidade_service_findall_1.CidadeServiceFindAll,
];
let CidadeModule = class CidadeModule {
};
exports.CidadeModule = CidadeModule;
exports.CidadeModule = CidadeModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            ...cidadeControllers,
        ],
        providers: [...cidadeServices],
        exports: [...cidadeServices],
    })
], CidadeModule);
//# sourceMappingURL=cidade.module.js.map
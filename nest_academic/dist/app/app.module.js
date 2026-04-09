"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const Joi = __importStar(require("joi"));
const cidade_module_1 = require("../cidade/cidade.module");
const resources_module_1 = require("../resources/resources.module");
//const oracledb = require('oracledb') as typeof import('oracledb');
//oracledb.initOracleClient({
// libDir: 'E:/cocao/oracle/instantclient',
//});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    DATABASE_TYPE: Joi.string().required(),
                    DATABASE_HOST: Joi.string().required(),
                    DATABASE_PORT: Joi.number().default(1521),
                    DATABASE_USERNAME: Joi.string().required(),
                    DATABASE_DATABASE: Joi.string().required(),
                    //DATABASE_PASSWORD: Joi.string().required(),
                    DATABASE_AUTOLOADENTITIES: Joi.boolean().default(true),
                    DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
                    //DATABASE_LOGGING: Joi.boolean().default(true),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    //sid: configService.get('DATABASE_DATABASE'), - acesso ao banco de dados oracle
                    database: configService.get('DATABASE_DATABASE'),
                    //password: configService.get('DATABASE_PASSWORD'),
                    //autoLoadEntities: configService.get('DATABASE_AUTOLOADENTITIES'),
                    entities: [__dirname + '/../**/*.entity.{ts,js}'],
                    synchronize: configService.get('DATABASE_SYNCHRONIZE'),
                    logging: ['query', 'error'],
                }),
            }),
            cidade_module_1.CidadeModule,
            resources_module_1.ResourceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
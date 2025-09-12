"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const joi_1 = __importDefault(require("joi"));
const cidade_module_1 = require("../cidade/cidade.module");
const oracledb = require('oracledb');
oracledb.initOracleClient({
    libDir: 'D:/.Lucas Novais/oracle/client',
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: joi_1.default.object({
                    DATABASE_TYPE: joi_1.default.string().required(),
                    DATABASE_HOST: joi_1.default.string().required(),
                    DATABASE_PORT: joi_1.default.number().required(),
                    DATABASE_USERNAME: joi_1.default.string().required(),
                    DATABASE_NAME: joi_1.default.string().required(),
                    DATABASE_PASSWORD: joi_1.default.string().required(),
                    DATABASE_AUTOLOADENTITIES: joi_1.default.boolean().default(true),
                    DATABASE_SYNCHRONIZE: joi_1.default.boolean().default(false),
                    DATABASE_LOGGING: joi_1.default.boolean().default(true),
                    DATABASE_ROW_NUMBER: joi_1.default.boolean().default(true),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootaAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'oracle',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    sid: configService.get('DATABASE_DATABASE'),
                    password: configService.get('DATABASE_PASSWORD'),
                    autoLoadEntities: configService.get('DATABASE_AUTOLOADENTITIES'),
                    synchronize: configService.get('DATABASE_SYNCHRONIZE'),
                    logging: ['query', 'error'],
                }),
            }),
            cidade_module_1.CidadeModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
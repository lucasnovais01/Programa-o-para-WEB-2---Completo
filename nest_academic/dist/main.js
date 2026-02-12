"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const http_exception_filter_1 = require("./commons/exceptions/filter/http.exception.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle('Sistema Acadêmico')
        .setDescription('API para gestão acadêmica')
        .addBearerAuth()
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, configSwagger);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:8000'],
        methods: 'GET, POST, PUT, DELETE',
        allowedheaders: 'Content-Type, Accept',
        credentials: false,
    });
    await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
//# sourceMappingURL=main.js.map
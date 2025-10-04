"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const http_exception_filter_1 = require("./commons/exceptions/filter/http.exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
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
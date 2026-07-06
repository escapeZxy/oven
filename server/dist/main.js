"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const libsql_migration_1 = require("./prisma/libsql-migration");
const prisma_service_1 = require("./prisma/prisma.service");
function resolveCorsOrigin() {
    var _a;
    const configuredOrigins = (_a = process.env['CORS_ORIGIN']) === null || _a === void 0 ? void 0 : _a.split(',').map((origin) => origin.trim()).filter((origin) => origin.length > 0);
    return configuredOrigins && configuredOrigins.length > 0 ? configuredOrigins : true;
}
async function bootstrap() {
    var _a;
    await (0, libsql_migration_1.runLibsqlMigrations)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = Number((_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 3000);
    app.enableCors({
        origin: resolveCorsOrigin(),
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.get(prisma_service_1.PrismaService).enableShutdownHooks(app);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
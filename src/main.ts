import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, NestApplicationOptions } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as csurf from "csurf";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";
import * as dotEnv from "dotenv";
import paths from "@configs/paths";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from '@shared/filters';

dotEnv.config({
  path: paths.dotEnvDev
});

async function bootstrap() {
  const options: NestApplicationOptions = {
    httpsOptions: {
      key: fs.readFileSync(paths.key),
      cert: fs.readFileSync(paths.cert)
    },
    logger: ["error", "warn", "debug"]
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, options);

  const limit = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000
  });

  app
  .use(helmet())
  .use(cookieParser())
  .use(csurf())
  .use(limit);

  app.enableCors({
    methods: 'GET',
    maxAge: 3600
  });

  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true
  });

  app
  .useGlobalPipes(validationPipe)
  .useGlobalFilters(new HttpExceptionFilter());

  const packageInfo = require("../package.json");
  const documentConfig = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    // .addBasicAuth()
    .addTag("App")
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup("swagger", app, document);

  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.HOST_PORT);
}

bootstrap();

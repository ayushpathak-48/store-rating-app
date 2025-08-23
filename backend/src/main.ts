import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unexpected fields
      forbidNonWhitelisted: true, // Throw error on unknown fields
      transform: true,
      stopAtFirstError: false, // Show all validation errors
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

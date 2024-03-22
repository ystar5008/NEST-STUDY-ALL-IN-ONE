import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapter/redis-io.adapter';
import { logger } from './middleware.ts/logger.middleware';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  app.enableCors({
    origin: 'http://127.0.0.1:5500', // 허용할 출처
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드.
    credentials: true, // 자격 증명 정보를 포함할지 여부
    allowedHeaders: 'Content-Type, Accept, Authorization', // 허용할 헤더
  });

  //등록된 모든 경로에 글로벌 미들웨어를 바인딩
  app.use(logger);
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

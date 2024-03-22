import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware, logger } from './middleware.ts/logger.middleware';

@Module({
  imports: [EventModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//implements NestModule {
//미들웨어 설정
//미들웨어는 요청 및 응답개체 변환
//요청 및 응답주기 종료
//next()함수도 다음 미들웨어 기능으로 제어를 전달
// configure(consumer: MiddlewareConsumer) {
//   //consumer.apply(LoggerMiddleware).forRoutes('cats');
//   //실행할 미들웨어 파일 설정, 적용할 라우터설정
//   consumer
//     .apply(LoggerMiddleware, logger)
//     //미들웨어 실행을 제외할 특정 라우터 설정
//     .exclude(
//       { path: 'cats', method: RequestMethod.GET },
//       { path: 'cats', method: RequestMethod.POST },
//       'cats/(.*)',
//     )
//     //.forRoutes('auth');
//     //cats 라우터에 get메서드에만 미들웨어 적용
//     .forRoutes({ path: '*', method: RequestMethod.GET });
//   //특정 컨트롤러에만 적용가능
//.forRoutes(CatsController);

//미들웨어를 다중으로 설정시 컴마로 구분
//consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
//   }
// }

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './common/constnts';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  //AuthModule이 다른 모듈에서 improt될 때, 해당 모듈에서도 AuthGuard사용가능
  //글로벌 레벨에ㅓ 사용되는것이 아니라 AuthModule내에서만 사용된다는의미
  //글로벌하게 AuthGuard가 사용되는것이 아니라 AuthModule을 import한 모듈 내에서만 사용가능
  //AuthGuard모든 엔드포인트에 자동으로 바인딩
  providers: [
    // {
    //   //이 가드가 무엇을 제공하는지 나타냄
    //   //APP_GUARD라는 프로바디어를 제공함
    //   provide: APP_GUARD,
    //   //실제로 GUARD의 구현체를 지정함 => AuthGuard클래스를 사용하여 Guard를 구현함

    //   useClass: AuthGuard,
    // },
    AuthService,
  ],

  exports: [AuthService],
})
export class AuthModule {}

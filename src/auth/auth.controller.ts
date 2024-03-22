import {
  Body,
  Controller,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './common/auth.guard';
import { Public } from './common/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res) {
    console.log(signInDto);
    const token = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    console.log(token.access_token);
    res.cookie('Authorization', `Bearer ${token.access_token}`);
    res.redirect('http://localhost:3000/auth/profile');
    //return 'ok';
  }

  @UseGuards(AuthGuard)
  //AuthGuard 지정을 안해줘도 APP_GUARD로 AuthGuard를 AuthModule에서 전역으로
  //설정해주었기 때문에 AuthGuard가 AuthModule에 전역적으로 적용
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //퍼블릭 데코레이터는 요청핸들러가 공개 엔드포인트인지 나타냄
  //SetMetadata를 사용하여 IS_Public_KEY를 설정하고 true로 설정하여 해당 핸들러가 공개된것있찌 표시
  @Public()
  @Get('test')
  getTest() {
    return 1;
  }
}

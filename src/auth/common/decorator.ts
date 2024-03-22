import { SetMetadata } from '@nestjs/common';

//사용자 정의 데코레이터 팩토리 기능을 사용하여
//사용자정의 데코레이터 작성
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from '@shared/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UsersRepository, UserEntitySubscriber } from './orm';
import * as services from './services';
import * as controllers from './controllers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature(
      [ UserEntity, UsersRepository ]
    ),
    CryptoModule,
  ],
  controllers: [
    ...Object.values(controllers)
  ],
  providers: [
    ...Object.values(services),
    UserEntitySubscriber
  ],
  exports: [
    ...Object.values(services)
  ]
})
export class UsersModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as strategies from './strategies';
import * as services from './services';
import * as controllers from './controllers';
import { CryptoModule } from '@shared/crypto';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    CryptoModule,

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.register({
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: process.env.JWT_ALGORITHM
      }
    })
  ],
  controllers: [
    ...Object.values(controllers)
  ],
  providers: [
    ...Object.values(services),
    ...Object.values(strategies)
  ],
  exports: [
    ...Object.values(services),
  ]
})
export class AuthModule {}
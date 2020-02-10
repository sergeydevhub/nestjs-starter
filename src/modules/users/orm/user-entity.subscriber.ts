import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { CryptoService } from '@shared/crypto';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UserEntity } from '../orm';

@Injectable()
export class UserEntitySubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly cryptoService: CryptoService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): Function | string {
    return UserEntity
  }

  public async beforeInsert(
    event: InsertEvent<UserEntity>
  ): Promise<any | void> {
    const salt: string = await this.cryptoService.generateSalt();
    const password: string = await this.cryptoService.hashPassword(event.entity.password, salt);

    event.entity.salt = salt;
    event.entity.password = password;
  }
}
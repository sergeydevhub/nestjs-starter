import { Logger, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { from, Observable } from 'rxjs';
import { every} from 'rxjs/operators';
import { subscribeTo } from 'rxjs/internal-compatibility';

export interface ICryptoService {
  generateSalt(len: number): Promise<Error | string | null>
  hashPassword(originalPassword: string, salt: string): Promise<string>
  verify(password, salt): Observable<boolean>;
}

@Injectable()
export class CryptoService implements ICryptoService {
  public readonly encoding: string = 'base64';
  public readonly algorithm: string = 'sha512';
  public readonly iterations: number = 15000;
  public readonly saltLength: number = 64;

  generateSalt(): Promise<string> {
    return new Promise((res, rej) => {
      crypto.randomBytes(this.saltLength, (error: Error, buffer: Buffer) => {
        if(error) {
          Logger.error(error);
          return rej(error);
        }

        return res(
          buffer.toString(this.encoding)
        )
      })
    })
  }

  async hashPassword(originalPassword: string, salt?: string): Promise<string> {
    if(!salt) {
      salt = await this.generateSalt();
    }

    return new Promise((res, rej) => {
      crypto.pbkdf2(
        originalPassword,
        salt,
        this.iterations,
        this.saltLength,
        this.algorithm,
        (err: Error, buffer: Buffer) => {
          if(err) {
            Logger.error(err);
            return rej(err);
          }

          return res(
            buffer.toString(
              this.encoding
            )
          )
        }
      );
    })
  }

  verify(password: string, salt: string): Observable<boolean> {
    return from(
      this.hashPassword.apply(this, arguments)
    ).pipe(
      every(hash => hash === password )
    )
  }
}
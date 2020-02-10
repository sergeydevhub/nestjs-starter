import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { UserRoles } from './user-roles.enum'

export interface User {
  id: number;
  name: string;
  // photoUrl: string;
  surname: string;
  age: number;
  email: string;
  password: string;
  salt: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt?: Date | undefined
}

@Entity('user')
@Unique(['email'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 32
  })
  public name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 32
  })
  public surname: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 64
  })
  public email!: string;

  @Column({
    type: 'number',
    nullable: true,
  })
  public age: number;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 8
  })
  public gender: string;

  @Column({
    type: 'char',
    select: false,
    nullable: false,
    length: 128
  })
  public password!: string;

  @Column({
    type: 'char',
    select: false,
    nullable: false,
    length: 64
  })
  public salt!: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
    default: UserRoles.USER
  })
  public role: UserRoles;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  public updatedAt?: Date | undefined;
}
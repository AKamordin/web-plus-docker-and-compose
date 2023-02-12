import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { PostgresErrorCode } from '../common/enums/errors.constraint';
import { UsersQuery } from '../common/types/users.query';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      const createdUser = this.userRepository.create({
        ...user,
        password: hash,
      });
      return await this.userRepository.save(createdUser);
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(error.detail);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  getUsers({ query }: UsersQuery): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: [{ email: ILike(query) }, { username: ILike(query) }],
    });
  }

  getUser(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  getUserByUsername(
    username: string,
    showHidden?: boolean,
  ): Promise<UserEntity> {
    let queryBuilder = this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where(`user.username = :username`, { username });
    if (showHidden) {
      queryBuilder = queryBuilder.addSelect('user.password');
    }
    return queryBuilder.getOne();
  }

  getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where(`(user.username = :username or user.email = :email)`, {
        username,
        email,
      });
    return queryBuilder.getOne();
  }

  getExistingUser(
    id: number,
    username: string,
    email: string,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where(`user.id != :id`, { id })
      .andWhere(`(user.username = :username or user.email = :email)`, {
        username,
        email,
      });
    return queryBuilder.getOne();
  }

  async updateUser(id: number, user: UpdateUserDto, updatePassword: boolean) {
    if (updatePassword) {
      const hash = await bcrypt.hash(user.password, 10);
      return this.userRepository.update({ id }, { ...user, password: hash });
    }
    return this.userRepository.update({ id }, user);
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}

import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user.dto';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly users: UserLoginDto[] = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
  ) {}

  create(user: UserLoginDto) {
    this.users.push(user);
    console.log(this.users);
    
    this.userRepository.save({
      id: 1,
      sex: 2
    });
  }

  findAll(): UserLoginDto[] {
    return this.users;
  }
}

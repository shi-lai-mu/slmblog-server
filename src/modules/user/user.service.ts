import { Inject, Injectable, Optional } from '@nestjs/common';
import { UserBaseDto } from './dto/user.dto';

@Injectable()
export class UserService<T> {
  private readonly users: UserBaseDto[] = [];

  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}

  create(user: UserBaseDto) {
    this.users.push(user);
  }

  findAll(): UserBaseDto[] {
    console.log(this.httpClient);
    
    return this.users;
  }
}

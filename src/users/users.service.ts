import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existinUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

    if (existinUser) {
      throw new BadRequestException('Email already exists');
    }

    const { password, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });

    await this.userRepository.save(user);

    delete (user as any).password;

    return user;
  }

  findAll() {
    return this.userRepository.find({});
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmailForAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'password', 'email', 'fullName', 'roles', 'isActive'], // Explicitly select password
    });
  }
}
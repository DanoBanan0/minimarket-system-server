import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.usersService.findAll().then(users =>
            users.find(u => u.email === email)
        );

        const userFound = await this.usersService.findByEmailForAuth(email);

        if (!userFound) {
            throw new UnauthorizedException('Credentials are not valid (email)');
        }

        if (!bcrypt.compareSync(password, userFound.password)) {
            throw new UnauthorizedException('Credentials are not valid (password)');
        }

        const payload = { id: userFound.id, roles: userFound.roles };

        return {
            user: {
                id: userFound.id,
                email: userFound.email,
                fullName: userFound.fullName,
            },
            token: this.jwtService.sign(payload),
        };
    }
}

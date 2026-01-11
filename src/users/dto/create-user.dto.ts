import { IsEmail, IsEnum, IsString, MinLength, IsOptional, IsArray } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    fullName: string;

    @ApiProperty({ uniqueItems: true })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole, isArray: true, required: false })
    @IsOptional()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[];
}

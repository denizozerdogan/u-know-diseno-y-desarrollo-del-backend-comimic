import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 24)
    @ApiProperty({ example: 'password1234' })
    password: string;
}
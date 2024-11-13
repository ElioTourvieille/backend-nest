import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(['free', 'premium', 'elite'],
        {
            message: 'Valid role required'
        })
    role: 'free' | 'premium' | 'elite';
}





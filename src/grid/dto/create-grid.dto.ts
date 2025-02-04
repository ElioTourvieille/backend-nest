import { IsString, IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateGridDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsOptional()
    tournamentIds?: number[];
}
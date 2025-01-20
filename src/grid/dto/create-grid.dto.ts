import { IsString } from "class-validator";
import { IsArray } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateGridDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    tournamentIds: number[];
}
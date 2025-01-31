import { IsNumber, IsNotEmpty } from "class-validator";

export class AddTournamentToGridDto {
    @IsNumber()
    @IsNotEmpty()
    tournamentId: number;
} 
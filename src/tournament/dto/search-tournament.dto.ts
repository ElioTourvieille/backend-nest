import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchTournamentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  buyInMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  buyInMax?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Holdem', 'Omaha', 'Mixed'])
  format?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}

import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { TableSize, Variant, TournamentType } from '@prisma/client';

export class SearchTournamentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  room?: string;

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
  @IsEnum(TableSize)
  tableSize?: TableSize;

  @IsOptional()
  @IsEnum(Variant)
  variant?: Variant;

  @IsOptional()
  @IsEnum(TournamentType)
  type?: TournamentType;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime?: string;


  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime?: string;


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

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SearchTournamentDto } from './dto/search-tournament.dto';

@Injectable()
export class TournamentService {
    constructor (private readonly databaseService: DatabaseService) { }

    async searchTournaments(searchTournamentDto: SearchTournamentDto) {
        const { name, buyInMin, buyInMax, format, startDate, endDate, page, pageSize } = searchTournamentDto;

        const skip = (page - 1) * pageSize;

        const where = {
            name: name ? { contains: name, mode: 'insensitive' as const } : undefined,
            buyIn: {
                gte: buyInMin || undefined,
                lte: buyInMax || undefined,
            },
            format: format || undefined,
            startTime: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        }

        const [tournaments, total] = await Promise.all([
        this.databaseService.tournament.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { startTime: 'asc' },
        }),
        this.databaseService.tournament.count({ where }),
        ]);

        return { 
          data: tournaments,
          meta: {
            totalResults:total,
            currentPage: page,
            totalPages: Math.ceil(total / pageSize),
            pageSize,
          },
         };
    }
  }
    

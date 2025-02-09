import { Controller, Query, Get, Post } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { SearchTournamentDto } from './dto/search-tournament.dto';

@Controller('tournaments')
export class TournamentController {
    constructor(private tournamentService: TournamentService) { }

    @Get('search') // GET /tournaments/search
    async searchTournaments(@Query() searchTournamentDto: SearchTournamentDto) {
        console.log('Received search request:', searchTournamentDto);
        const results = await this.tournamentService.searchTournaments(searchTournamentDto);
        console.log('Search results:', results);
        return results;
    }

    @Post('import') // POST /tournaments/import
    async importTournaments() {
        await this.tournamentService.importAllTournaments();
        return { message: 'Tournaments imported successfully' };
    }
}


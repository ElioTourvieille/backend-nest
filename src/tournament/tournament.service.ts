import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SearchTournamentDto } from './dto/search-tournament.dto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { TableSize, Variant, TournamentType } from '@prisma/client';

interface RawTournamentData {
    id: string;
    name: string;
    buyIn: number;
    startTime: string;
    room: string;
    tableSize?: TableSize;
    variant?: Variant;
    type?: TournamentType;
    players?: number;
    lateReg?: number;
}

@Injectable()
export class TournamentService {
    constructor (private readonly databaseService: DatabaseService) { }

    private async readJsonFile<T>(filePath: string): Promise<T> {
        const fullPath = join(process.cwd(), filePath);
        const data = await fs.readFile(fullPath, 'utf-8');
        return JSON.parse(data);
    }

    private mapToTournamentData(raw: RawTournamentData) {
        return {
            name: raw.name,
            buyIn: raw.buyIn,
            startTime: new Date(raw.startTime),
            room: raw.room,
            tableSize: raw.tableSize || TableSize.FULL_RING,
            variant: raw.variant || Variant.NO_LIMIT_HOLDEM,
            type: raw.type || TournamentType.STANDARD,
            players: raw.players,
            lateReg: raw.lateReg,
        };
    }

    private async importTournamentsForRoom(room: string, filePath: string) {
        const data = await this.readJsonFile<RawTournamentData[]>(filePath);
        
        await Promise.all(data.map(tournament => {
            const tournamentData = this.mapToTournamentData({ ...tournament, room });
            return this.databaseService.tournament.upsert({
                where: {
                    name_startTime_room: {
                        name: tournamentData.name,
                        startTime: tournamentData.startTime,
                        room: tournamentData.room
                    }
                },
                create: tournamentData,
                update: tournamentData
            });
        }));
    }

    async importGGPokerTournaments() {
        await this.importTournamentsForRoom('GGPoker', 'data/ggpoker_tournaments.json');
    }

    async importWinamaxTournaments() {
        await this.importTournamentsForRoom('Winamax', 'data/winamax_tournaments.json');
    }

    async importPMUTournaments() {
        await this.importTournamentsForRoom('PMU', 'data/pmu_tournaments.json');
    }

    async importAllTournaments() {
        await Promise.all([
            this.importGGPokerTournaments(),
            this.importWinamaxTournaments(),
            this.importPMUTournaments()
        ]);
    }

    async searchTournaments(searchTournamentDto: SearchTournamentDto) {
        const { 
            name, 
            buyInMin, 
            buyInMax, 
            tableSize,
            variant,
            type,
            startDate, 
            endDate, 
            page = 1,
            pageSize = 25
        } = searchTournamentDto;

        const skip = (page - 1) * pageSize;

        const where = {
            name: name ? { contains: name, mode: 'insensitive' as const } : undefined,
            buyIn: {
                gte: buyInMin || undefined,
                lte: buyInMax || undefined,
            },
            tableSize: tableSize || undefined,
            variant: variant || undefined,
            type: type || undefined,
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
                totalResults: total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
                pageSize,
            },
        };
    }
  }
    

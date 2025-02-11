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
        const pageSize = searchTournamentDto?.pageSize || 25;
        const page = searchTournamentDto?.page || 1;

        try {
            const { 
                name, 
                buyInMin, 
                buyInMax, 
                tableSize,
                variant,
                type,
                startDate,
                endDate,
                time,
                endTime,
                room,
            } = searchTournamentDto || {};

            const skip = (page - 1) * pageSize;

            let startDateTime = undefined;
            let endDateTime = undefined;

            if (startDate) {
                startDateTime = new Date(startDate);
            }

            if (endDate) {
                const baseDate = new Date(endDate);
                if (endTime) {
                    const [hours, minutes] = endTime.split(':').map(Number);
                    baseDate.setHours(hours, minutes, 59, 999);
                }
                endDateTime = baseDate;
            }

            const where = {
                name: name ? { contains: name, mode: 'insensitive' as const } : undefined,
                buyIn: {
                    gte: buyInMin || undefined,
                    lte: buyInMax || undefined,
                },
                tableSize: tableSize || undefined,
                variant: variant || undefined,
                type: type || undefined,
                room: room || undefined,
                startTime: {
                    gte: startDateTime,
                    lte: endDateTime,
                },
            }

            // Time slot management
            if (time || endTime) {
                const startTimeDate = new Date();
                const endTimeDate = new Date();

                if (time) {
                    const [startHours, startMinutes] = time.split(':').map(Number);
                    startTimeDate.setHours(startHours, startMinutes, 0, 0);
                }

                if (endTime) {
                    const [endHours, endMinutes] = endTime.split(':').map(Number);
                    endTimeDate.setHours(endHours, endMinutes, 59, 999);
                } else if (time) {
                    // If there is no endTime, we use time + 1 minute
                    endTimeDate.setTime(startTimeDate.getTime() + 60000);
                }

                where['startTime'] = {
                    ...where['startTime'],
                    gte: time ? startTimeDate : undefined,
                    lte: endTime ? endTimeDate : undefined,
                };
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
                data: tournaments || [],
                meta: {
                    totalResults: total,
                    currentPage: page,
                    totalPages: Math.ceil(total / pageSize),
                    pageSize,
                },
            };
        } catch (error) {
            console.error('Error in searchTournaments:', error);
            return {
                data: [],
                meta: {
                    totalResults: 0,
                    currentPage: page,
                    totalPages: 0,
                    pageSize,
                },
            };
        }
    }
  }
    

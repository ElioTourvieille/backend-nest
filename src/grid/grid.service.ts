import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGridDto } from './dto/create-grid.dto';
import { UpdateGridDto } from './dto/update-grid.dto';

@Injectable()
export class GridService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createGrid(kindeId: string, createGridDto: CreateGridDto) {
        console.log('Creating grid with kindeId:', kindeId);
        const { name, tournamentIds } = createGridDto;
        
        if (!kindeId) {
            throw new Error('KindeId is required');
        }

        return this.databaseService.grid.create({
            data: {
                name,
                user: { 
                    connect: { 
                        kindeId: kindeId 
                    } 
                },
                ...(tournamentIds && tournamentIds.length > 0
                    ? { tournaments: { connect: tournamentIds.map(id => ({ id })) } }
                    : {}),
            },
            include: {
                tournaments: true,
            },
        });
    }

    async getUserGrids(kindeId: string) {
        return this.databaseService.grid.findMany({
            where: { user: { kindeId } },
            select: {
                id: true,
                name: true,
                createdAt: true,
                tournaments: {
                    select: {
                        id: true,
                        name: true,
                        startTime: true
                    }
                }
            },
        });
    }

    async getGrid(gridID: number) {
        return this.databaseService.grid.findUnique({
            where: { id: gridID },
            include: { tournaments: true },
        });
    }

    async updateGrid(gridID: number, updateGridDto: UpdateGridDto) {
        const { name, tournamentIds } = updateGridDto;
        return this.databaseService.grid.update({
            where: { id: gridID },
            data: { 
                name, 
                tournaments: { set: tournamentIds.map(id => ({ id })) }
            },
            include: {
                tournaments: true,
            },
        });
    }

    async deleteGrid(gridID: number) {
        return this.databaseService.grid.delete({ where: { id: gridID } });
    }

    async addTournamentToGrid(gridId: number, tournamentId: number) {
        return this.databaseService.grid.update({
            where: { id: gridId },
            data: {
                tournaments: {
                    connect: { id: tournamentId }
                }
            },
            include: {
                tournaments: true,
            },
        });
    }

    async removeTournamentFromGrid(gridId: number, tournamentId: number) {
        return this.databaseService.grid.update({
            where: { id: gridId },
            data: {
                tournaments: {
                    disconnect: { id: tournamentId }
                }
            },
            include: {
                tournaments: true,
            },
        });
    }
}
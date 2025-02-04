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
            include: { tournaments: true },
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
}
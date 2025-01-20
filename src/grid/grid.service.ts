import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGridDto } from './dto/create-grid.dto';
import { UpdateGridDto } from './dto/update-grid.dto';

@Injectable()
export class GridService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createGrid(userID: number, createGridDto: CreateGridDto) {
        const { name, tournamentIds } = createGridDto;
        return this.databaseService.grid.create({
            data: {
                name,
                user: { connect: { id: userID } },
                tournaments: { connect: tournamentIds.map(id => ({ id })) },
            },
            include: {
                tournaments: true, // Include related tournaments in the response
            },
        });
    }

    async getUserGrids(userID: number) {
        return this.databaseService.grid.findMany({
            where: { userId: userID },
            include: { tournaments: true }, // Include tournament details in the response
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
                tournaments: { set: tournamentIds.map(id => ({ id })) } // Replace all tournament connections
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

    
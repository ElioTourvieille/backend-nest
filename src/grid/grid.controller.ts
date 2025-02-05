import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GridService } from './grid.service';
import { CreateGridDto } from './dto/create-grid.dto';
import { UpdateGridDto } from './dto/update-grid.dto';
import { KindeGuard } from '../auth/kinde.guard';
import { AddTournamentToGridDto } from './dto/add-tournament-to-grid.dto';

@Controller('grid')
@UseGuards(KindeGuard) // Protect all routes with KindeGuard
export class GridController {
    constructor(private readonly gridService: GridService) {}

    @Post() // POST /grid
    async createGrid(@Body() createGridDto: CreateGridDto, @Req() req: any) {
        console.log('Request user:', req.user);
        const kindeId = req.user.id;
        console.log('KindeId:', kindeId);
        return this.gridService.createGrid(kindeId, createGridDto);
    }

    @Get() // GET /grid
    async getUserGrids(@Req() req: any) {
        const kindeId = req.user.id;
        return this.gridService.getUserGrids(kindeId);
    }

    @Get(':id') // GET /grid/:id
    async getGrid(@Param('id', ParseIntPipe) id: number) {
        return this.gridService.getGrid(id);
    }

    @Put(':id') // PUT /grid/:id
    async updateGrid(@Param('id', ParseIntPipe) id: number, @Body() updateGridDto: UpdateGridDto) {
        return this.gridService.updateGrid(id, updateGridDto);
    }

    @Delete(':id') // DELETE /grid/:id
    async deleteGrid(@Param('id', ParseIntPipe) id: number) {
        return this.gridService.deleteGrid(id);
    }

    @Post(':id/add-tournament') // POST /grid/:id/add-tournament
    async addTournamentToGrid(
        @Param('id', ParseIntPipe) id: number,
        @Body() addTournamentDto: AddTournamentToGridDto
    ) {
        return this.gridService.addTournamentToGrid(id, addTournamentDto.tournamentId);
    }
}

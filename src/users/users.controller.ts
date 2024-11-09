import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get(':id') // GET /users/:id
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Get() // GET /users or GET /users?role=
    findByRole(@Query('role') role?: 'free' | 'premium' | 'elite') {
        return this.usersService.findByRole(role);
    }
    
}

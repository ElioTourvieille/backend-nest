import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get(':id') // GET /users/:id
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Get() // GET /users
    findByRole(@Query('role') role?: 'student' | 'teacher') {
        return this.usersService.findByRole(role);
    }
    
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, ValidationPipe, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, Role } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post() // POST /users
    create(@Body() createUserDto: Prisma.UserCreateInput) {
        return this.usersService.create(createUserDto);
    }

    @Get(':id') // GET /users/:id
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Get() // GET /users or GET /users?role=
    findByRole(@Query('role') role?: Role) {
        return this.usersService.findByRole(role);
    }

    @Patch(':id') // PATCH /users/:id
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: Prisma.UserUpdateInput) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id') // DELETE /users/:id
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id);
    }
}

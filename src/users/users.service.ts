import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor (private readonly databaseService: DatabaseService) { }

    async create(createUserDto: Prisma.UserCreateInput) {
        return this.databaseService.user.create({
            data: createUserDto,
        });
    }

    async findOne(id: number) {
        return this.databaseService.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByRole(role?: Role) {
        if (role) return this.databaseService.user.findMany({
            where: {
                role,
            },
        });

        return this.databaseService.user.findMany();
    }

    async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }

    async delete(id: number) {
        return this.databaseService.user.delete({
            where: {
                id,
            },
        });
    }
}

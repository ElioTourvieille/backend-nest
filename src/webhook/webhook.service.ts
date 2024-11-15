import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WebhookService {
    constructor(private readonly databaseService: DatabaseService) { }

    async processKindeEvent(event: any) {
        try {
            switch (event.type) {
                case 'user.created':
                    await this.createUser(event.data);
                    break;
                case 'user.updated':
                    await this.update(event.data.id, event.data);
                    break;
                case 'user.deleted':
                    await this.delete(event.data.id);
                    break;
                default:
                    throw new Error(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.error(`Failed to process event ${event.type}:`, error);
            throw error;
        }
    }

    async createUser(userData: Prisma.UserCreateInput) {
        try {
            await this.databaseService.user.create({ data: userData });
        } catch (error) {
            console.error('Failed to create user:', error);
            throw error;
        }
    }

    async update(id: number, updateUserData: Prisma.UserUpdateInput) {
        try {
            return await this.databaseService.user.update({
                where: { id },
                data: updateUserData,
            });
        } catch (error) {
            console.error('Failed to update user:', error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await this.databaseService.user.delete({ where: { id } });
        } catch (error) {
            console.error('Failed to delete user:', error);
            throw error;
        }
    }
} 

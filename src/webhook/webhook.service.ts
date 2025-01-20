import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WebhookService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Process incoming Kinde webhook events for user management
  // @param verifiedEvent - The verified webhook event from Kinde
  async processKindeEvent(verifiedEvent: any) {
    try {
      switch (verifiedEvent.type) {
        case 'user.created':
          // Handle new user creation in our database
          const userData = {
            kindeId: verifiedEvent.data.user.id,
            email: verifiedEvent.data.user.email,
            name: `${verifiedEvent.data.user.first_name} ${verifiedEvent.data.user.last_name}`,
            role: 'free',
          };
          await this.createUser(userData);
          break;
        case 'user.updated':
          // Sync user data updates from Kinde
          await this.update(verifiedEvent.data.user.id, {
            email: verifiedEvent.data.user.email,
            name: `${verifiedEvent.data.user.first_name} ${verifiedEvent.data.user.last_name}`,
          });
          break;
        case 'user.deleted':
          // Remove user when deleted from Kinde
          await this.delete(verifiedEvent.data.user.id);
          break;

        default:
          throw new Error(`Unhandled event type: ${verifiedEvent.type}`);
      }
    } catch (error) {
      console.error(`Failed to process event ${verifiedEvent.type}:`, error);
      throw error;
    }
  }

  // Create a new user in our database from Kinde data
  // @param userData - User information from Kinde
  async createUser(userData: { kindeId: string; email: string; name: string; role: string }) {
    try {
      await this.databaseService.user.create({
        data: {
          kindeId: userData.kindeId,
          email: userData.email,
          name: userData.name,
          role: userData.role as Role, // Conversion explicite
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(kindeId: string, updateUserData: Prisma.UserUpdateInput) {
    try {
      return await this.databaseService.user.update({
        where: { kindeId: kindeId },
        data: updateUserData,
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async delete(kindeId: string) {
    try {
      return await this.databaseService.user.delete({
         where: {
          kindeId: kindeId 
          } 
        });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }
}

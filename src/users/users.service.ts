import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [
        {
            id: 1,
            name: 'Thoma',
            email: 'thoma@gmail.com',
            role: 'student',
        },
        {
            id: 2,
            name: 'Chadi',
            email: 'chadi@gmail.com',
            role: 'student',
        },
        {
            id: 3,
            name: 'Julien',
            email: 'julien@gmail.com',
            role: 'teacher',
        },
        {
            id: 4,
            name: 'Kevin',
            email: 'kevin@gmail.com',
            role: 'director',
        },
    ];

    findOne(id: number) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    findByRole(role?: 'student' | 'teacher' | 'director') {
        if (role) {
            const rolesArray = this.users.filter(user => user.role === role);
            if (rolesArray.length === 0) 
                throw new NotFoundException(`User Role not found`);
                return rolesArray;
        }
        return this.users;
    }


}

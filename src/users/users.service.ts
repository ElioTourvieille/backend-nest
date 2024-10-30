import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    users = [
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
    ];

    findOne(id: number) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    findAll() {
        return this.users;
    }

}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import type { UserPosts } from './Post.js'; // Keep this as 'import type' for type safety

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // CORRECTED LINE: Remove the arrow function wrapper
    @OneToMany('UserPosts', (post: UserPosts) => post.user) // <--- THIS IS THE CHANGE
    posts: UserPosts[];
}
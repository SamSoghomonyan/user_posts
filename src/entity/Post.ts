import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import type { User } from './User.js'; // Keep 'import type' for type safety

@Entity()
export class UserPosts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  post: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isLiked: boolean;

  @Column({ default: 0 })
  likedCount: number;

  // Corrected: Directly pass the string literal 'User'
  @ManyToOne('User', (user: User) => user.posts) // <--- This will be the change
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import type  { User as IUser } from './index.js';
import  { User } from './index.js';
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

  @ManyToOne(() =>  User, (user: User) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: IUser;

  @Column({ nullable: true })
  userId: string;
}
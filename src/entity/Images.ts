import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity()
export class Images {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ImagesURL: string;
}
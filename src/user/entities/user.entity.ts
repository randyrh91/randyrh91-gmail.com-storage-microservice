import { Image } from 'src/image/entities/image.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_name', length: 50, unique: true })
    userName: string;

    @Column({ nullable: false })
    password: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @OneToMany(() => Image, (image) => image.user)
    images: Image[];
}

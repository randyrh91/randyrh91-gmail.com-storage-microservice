import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column({name: 'is_published'})
    isPublished: boolean;

    @Column({name: 'created_at'})
    createdAt: Date;

    @ManyToOne(()=> User, (user) => user.id,{
        eager: true
    })
    user: User 
}

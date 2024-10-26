import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "history"})
export class Log {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    action: string;

    @Column()
    date: Date;

    @ManyToOne(()=> User, (user) => user.id,{
        eager: true
    })
    user: User 

    @ManyToOne(()=> Image, (image) => image.id,{
        eager: true
    })
    image: Image 
}

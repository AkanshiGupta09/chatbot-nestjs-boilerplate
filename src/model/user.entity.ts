import { IsString, IsNumber, IsOptional } from 'class-validator';

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  mobileNumber: string;

  @IsString()
  language: string;
  @Column()
  botID: string;
}

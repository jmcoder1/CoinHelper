import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./Guild";

@Entity()
export class GuildActivity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  guildId: number;

  @OneToOne(() => Guild)
  guild: Guild;

  @Column({ nullable: false, default: 0 })
  numGuildCurrencies: number;

  @Column({ nullable: false, default: 0 })
  numGuildChannels: number;

  @Column({ nullable: false, default: 0 })
  numRemovalReasons: number;
}

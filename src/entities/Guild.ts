import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  OneToOne,
} from "typeorm";
import { GuildActivity } from "./GuildActivity";

@Entity()
export class Guild extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  discordId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  guildEconomyChannelId: number;

  @OneToOne(() => Guild)
  guildEconomyChannel: Guild;

  @AfterInsert()
  public handleAfterInsert = async () => {
    await GuildActivity.create({ guildId: this.id }).save();
  };
}

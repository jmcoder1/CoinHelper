import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
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

  @AfterInsert()
  public handleAfterInsert = async () => {
    await GuildActivity.create({ guildId: this.id }).save();
  };
}

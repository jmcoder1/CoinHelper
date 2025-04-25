import {
  AfterInsert,
  BaseEntity,
  Column,
  Entity,
  getConnection,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Guild } from "./Guild";

@Entity()
export class GuildChannel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  guildId: number;

  @OneToOne(() => Guild)
  guild: Guild;

  @Column({ nullable: false })
  discordId: string;

  @Column({ nullable: false })
  name: string;

  @AfterInsert()
  public handleAfterInsert = async () => {
    await getConnection().query(
      `
        UPDATE guild_activity
        SET "numGuildChannels" = "numGuildChannels" + 1
        WHERE "guildId" = ${this.guildId}
    `
    );
  };
}

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
export class GuildRemovalReason extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  guildId: number;

  @OneToOne(() => Guild)
  guild: Guild;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  value: string;

  @AfterInsert()
  public handleAfterInsert = async () => {
    await getConnection().query(
      `
        UPDATE guild_activity
        SET "numRemovalReasons" = "numRemovalReasons" + 1
        WHERE "guildId" = ${this.guildId}
    `
    );
  };
}

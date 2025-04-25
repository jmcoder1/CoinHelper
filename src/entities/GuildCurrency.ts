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
export class GuildCurrency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  guildId: number;

  @OneToOne(() => Guild)
  guild: Guild;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  namePlural: string;

  @Column({ nullable: false })
  iconSrc: string;

  @Column({ nullable: false })
  bannerSrc: string;

  @AfterInsert()
  public handleAfterInsert = async () => {
    await getConnection().query(
      `
        UPDATE guild_activity
        SET "numGuildCurrencies" = "numGuildCurrencies" + 1
        WHERE "guildId" = ${this.guildId}
    `
    );
  };
}

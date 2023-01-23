import sqlite3, { RunResult } from "sqlite3";
import fs from "fs";
import path from "path";
import { DuskCrew } from "../types/dusk";

function loadFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, filename), (err, data) =>
      err ? reject(err) : resolve(data.toString())
    )
  );
}

const VERSIONS: string[] = [];

export class DuskDatabase {
  connection: sqlite3.Database;
  loading: Promise<void>;
  isLoaded = false;

  constructor() {
    this.connection = new sqlite3.Database("./dusk.sqlite3");
    this.loading = this.initialize();
  }

  async getCrewsForServers(serverIds: string[]): Promise<DuskCrew[]> {
    const rows = await this.all(
      `SELECT * FROM Crews WHERE serverId IN (SELECT value FROM json_each(?))`,
      JSON.stringify(serverIds)
    );
    return rows.map(({ crewId, serverId, data }) => ({
      ...JSON.parse(data),
      serverId,
      crewId,
    }));
  }

  async getCrew(crewId: string): Promise<DuskCrew> {
    const { serverId, data } = await this.get(
      `SELECT * FROM Crews WHERE crewId = ?`,
      crewId
    );
    return { ...JSON.parse(data), serverId, crewId };
  }

  async createCrew({ crewId, serverId, ...data }: DuskCrew) {
    await this.run(
      `INSERT INTO Crews (crewId, serverId, data) VALUES (?, ?, ?)`,
      crewId,
      serverId,
      JSON.stringify(data)
    );
    return await this.getCrew(crewId);
  }

  deleteCrew(crewId: string) {
    return this.run(`DELETE FROM Crews WHERE crewId = ?`, crewId);
  }

  async updateCrew({ crewId, serverId, ...data }: DuskCrew) {
    await this.run(
      `UPDATE Crews SET serverId = ?, data = ? WHERE crewId = ?`,
      serverId,
      JSON.stringify(data),
      crewId
    );
    return await this.getCrew(crewId);
  }

  private async initialize() {
    const init = await loadFile("db/init.sql");
    await this.runAllSql(init);
    const versions = (
      await this.allPromise(`SELECT versionId FROM AppVersions`)
    ).map((it) => it.VersionId);
    console.log(`Current versions: ${versions.join(", ")}`);
    for (const newVersion of VERSIONS) {
      if (versions.includes(newVersion)) continue;
      const serverCharacterUserId = await loadFile(`db/${newVersion}.sql`);
      await this.runAllSql(serverCharacterUserId);
      await this.runPromise(
        `INSERT INTO AppVersions (versionId) VALUES (?);`,
        newVersion
      );
    }
    this.isLoaded = true;
  }

  private async all(sql: string, ...params: any[]) {
    if (!this.isLoaded) await this.loading;
    const results = await this.allPromise(sql, ...params);
    return results;
  }

  private async get(sql: string, ...params: any[]) {
    if (!this.isLoaded) await this.loading;
    const result = await this.getPromise(sql, ...params);
    return result;
  }

  private async run(sql: string, ...params: any[]) {
    if (!this.isLoaded) await this.loading;
    const result = await this.runPromise(sql, ...params);
    return result;
  }

  private allPromise(sql: string, ...params: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, params, (error, rows) => {
        if (error) {
          return reject(error);
        }
        resolve(rows);
      });
    });
  }

  private runPromise(sql: string, ...params: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.run(
        sql,
        params,
        (result: RunResult, error: Error | null) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  private getPromise(sql: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.get(sql, params, (error, row) => {
        if (error) {
          return reject(error);
        }
        resolve(row);
      });
    });
  }

  private async runAllSql(script: string) {
    await this.runPromise("BEGIN");
    try {
      for (const comm of script.split(";")) {
        await this.runPromise(comm);
      }
      await this.runPromise("END");
    } catch (e) {
      console.error(e);
      await this.runPromise("ROLLBACK");
    }
  }
}

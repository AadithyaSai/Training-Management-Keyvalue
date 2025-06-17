import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import "dotenv/config";

const dataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	ssl: {
		rejectUnauthorized: false,
	},
	extra: {
		max: 5,
		min: 2,
	},
	synchronize: false,
	logging: true,
	namingStrategy: new SnakeNamingStrategy(),
	entities: ["dist/entities/*.js"],
	migrations: ["dist/db/migrations/*.js"],
});

export default dataSource;

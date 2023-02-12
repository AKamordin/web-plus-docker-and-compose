import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {
    DEFAULT_DB_HOST,
    DEFAULT_DB_NAME,
    DEFAULT_DB_PASS,
    DEFAULT_DB_PORT,
    DEFAULT_DB_USER,
    DEFAULT_JWT_SECRET, DEFAULT_PORT
} from "../constants";

export default () => ({
    port: parseInt(process.env.PORT, 10) || DEFAULT_PORT,
    database: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || DEFAULT_DB_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || DEFAULT_DB_PORT,
        username: process.env.POSTGRES_USER || DEFAULT_DB_USER,
        password: process.env.POSTGRES_PASSWORD || DEFAULT_DB_PASS,
        database: process.env.POSTGRES_DB || DEFAULT_DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
    } as PostgresConnectionOptions,
    secretKey: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(', ') : '*',
});

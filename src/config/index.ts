import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config({ quiet: true })

const config = {
    port: env.PORT,
    database_url: env.DATABASE_URL,
    node_env: env.NODE_ENV,
}

export default config;
import {Server} from "./Server";
import express, {Express} from 'express';
import cors from 'cors';

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT?: number;
      }
    }
}

const app: Express = express();

app.use(cors());

const port: number = process.env.PORT || 8080;

const server = new Server(app);
server.start(port);

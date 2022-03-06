import express, {Express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
import {ShopifyController} from './Controllers/ShopifyController';

import {Server} from "./Server";
import path from 'path';
import { SessionController } from './Controllers/SessionController';
import { ActiveSessions } from './types/ActiveSessions';

require('dotenv').config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: number;
      API_KEY: string;
      API_SECRET_KEY: string;
      SCOPES: string;
      SHOP: string;
      HOST: string;
      HOST_NAME: string;
    }
  }
}

const { API_KEY, API_SECRET_KEY, SCOPES, PORT, HOST_NAME } = process.env;

/**
 * Initializing the Shopify Context. The config used here is used for the next steps when we start the
 * oAuth flow and request for an access token from Shopify.
 */
Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST_NAME,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.October21,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
});

const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const app: Express = express();

app.use(cors());
app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

/**
 *  This block, of code from my understanding basically serves the purpose of generating the redirect urls via AppBridge.
 *  I was unable to get oAuth flow to complete without this.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/auth/toplevel", async (req, res) => {
  res.cookie(TOP_LEVEL_OAUTH_COOKIE, "1", {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
  });

  res.render("top_level", {
    apiKey: Shopify.Context.API_KEY,
    hostName: Shopify.Context.HOST_NAME,
    shop: req.query.shop,
  });
});

const port: number = PORT || 8080;

const activeSessions: ActiveSessions = {};

const server = new Server(app);


// Initialize Controllers
const shopifyController = new ShopifyController(express.Router(), Shopify.Context, activeSessions);
const sessionController = new SessionController(express.Router(), activeSessions);

server.registerRouter('/', sessionController.router);
server.registerRouter('/shopify', shopifyController.router);

// Static serve
app.use('/admin', express.static('./dist/admin'));
app.use('/app-proxy', express.static('./dist/customer'));

server.start(port);

import { Request, Response, NextFunction, Router } from 'express';
import { ContextInterface } from '@shopify/shopify-api/dist/context';
import Shopify, { AuthQuery } from '@shopify/shopify-api';
import { ActiveSessions } from '../types/ActiveSessions';

export class ShopifyController {
    private readonly _router: Router;
    private readonly _context: ContextInterface;
    private _activeSessions: ActiveSessions;

    constructor(router: Router, context: ContextInterface, activeSessions: ActiveSessions) {
        this._activeSessions = activeSessions;
        this._context = context;
        this._router = router;
        this._router.get('/login', this.login.bind(this));
        this._router.get('/auth/callback', this.callback.bind(this));
    }

    public get router(): Router {
        return this._router;
    }

    async login(req: Request, res: Response, next: NextFunction) {

        if (!req.signedCookies.shopify_top_level_oauth) {
            res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
            return;
        }

        // Generate the login url for the to being oAuth flow
        let authRoute = await Shopify.Auth.beginAuth(
            req,
            res,
            process.env.SHOP,
            '/shopify/auth/callback',
            true,
        );

        return res.redirect(authRoute);
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        try {
            const session = await Shopify.Auth.validateAuthCallback(
              req,
              res,
              req.query as unknown as AuthQuery,
            );

            this._activeSessions[session.shop] = session.scope as string;

          } catch (error) {
            console.error(error); // in practice these should be handled more gracefully
          }
          return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
    }
}

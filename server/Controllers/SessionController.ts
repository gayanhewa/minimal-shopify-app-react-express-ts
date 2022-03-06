import { Request, Response, NextFunction, Router } from 'express';
import { AuthQuery } from '@shopify/shopify-api';
import { ActiveSessions } from '../types/ActiveSessions';

export class SessionController {
    private readonly _router: Router;
    private _activeSessions: ActiveSessions;

    constructor(router: Router, activeSessions: ActiveSessions) {
        this._activeSessions = activeSessions;
        this._router = router;
        this._router.get('/', this.check.bind(this));
    }

    public get router(): Router {
        return this._router;
    }

    private check(req: Request, res: Response, next: NextFunction) {
        const {shop, host} = req.query as unknown as AuthQuery;

        if (this._activeSessions[shop]) {
            res.redirect(`/admin?host=${host}&shop=${shop}`);
        } else {
            res.redirect(`/shopify/login?shop=${shop}`);
        }
    }
}

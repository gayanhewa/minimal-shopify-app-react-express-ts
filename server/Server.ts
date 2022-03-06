import {Express, Request, Response, Router} from "express";

export class Server {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

    public registerRouter(prefix: string, router: Router): void {
        this.app.use(prefix, router);
    }
}

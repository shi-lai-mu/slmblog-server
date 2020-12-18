import { NestMiddleware } from "@nestjs/common";

export class GlobalMiddleware implements NestMiddleware {


  use(request: Request, response: Response, next: any) {
    const req: any = request;
    const res: any = response;
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Expose-Headers', 'token');
    next();
  }
}
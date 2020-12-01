import { NestMiddleware } from "@nestjs/common";
import { CurUser } from "../decorators/global.decorators";

export class GlobalMiddleware implements NestMiddleware {


  use(request: Request, response: Response, next: any) {
    const req: any = request;
    const res: any = response;
    next();
  }
}
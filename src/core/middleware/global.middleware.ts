import { NestMiddleware } from "@nestjs/common";

import { isDev } from "src/constants/system";
import { getIPAdress } from "src/utils/network";



const devDomian = getIPAdress() ?? 'dev.slmblog.com';
// const origin = 'http://' + (isDev ? devDomian  + ':8888' : 'slmblog.com');
const origin = '*';
export class GlobalMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: any) {
    // const req: any = request;
    const res: any = response;

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'token');
    next();
  }
}
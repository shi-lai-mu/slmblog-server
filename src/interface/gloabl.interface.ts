import { Request } from "@nestjs/common";
import { User } from "src/entity/user.entity";

export interface GlobalRequest extends Request {
  user: User;
}
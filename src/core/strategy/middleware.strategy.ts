// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";

// /**
//  * 权限守卫
//  */
//  @Injectable()
//  export class JwtPermissionStrategy extends PassportStrategy(Strategy) {
//    // 权限等级
//    private PermissionRole: UserRole = UserRole.Normal;
 
//    /**
//     * 权限守卫 只允许指定权限以上用户访问接口
//     * @params role 权限组
//     */
//    constructor(
//      role: UserRole = UserRole.Normal,
//      @InjectRepository(User) private readonly userRepository?: Repository<User>,
//    ) {
//      super(role);
//      this.PermissionRole = role;
//    }
 
   
//    /**
//     * 本地策略校验身份
//     * 采用 用户id 和 用户盐 取数据 (只有id和八位盐都猜出才有可能获取到)
//     */
//     async validate(data: { iv: string; id: number; iat: number; exp: number; }) {
//       console.log();
      
//      const user = await this.userRepository
//        .createQueryBuilder('u')
//        .addSelect('u.password')
//        .addSelect('u.iv')
//        .addSelect('u.status')
//        .where({
//          id: data.id,
//        })
//        .getOne()
//      ;
//      if (user) user.validateType = 'jwt';
//      return user;
//    }
 
 
//    canActivate(context: ExecutionContext) {
//      const req = context.switchToHttp().getRequest();
//      return super.canActivate(context);
//    }
 
//    /**
//     * 处理请求
//     */
//    handleRequest(err, user, info) {
//      const { PermissionRole } = this;
 
//      if (err || !user) {
//        let errMsg = ResponseEnum.UNAUTHORIZED_INVALID;
//        if (info && info.toString().indexOf('expired') !== -1) {
//          errMsg = ResponseEnum.UNAUTHORIZED_EXPIRED;
//        }
//        throw err || new ResBaseException(errMsg);
//      }
 
//      // 权限判断
//      if (PermissionRole !== UserRole.Normal) {
//        if (user.role < PermissionRole) {
//          let currentRoleName = '';
//          let userRoleName = '';
//          for (const roleName in UserRole) {
//            const item = UserRole[roleName] as unknown as UserRole;
//            if (item === PermissionRole) currentRoleName = roleName;
//            if (item === user.role) userRoleName = roleName;
//          }
//          const Error = ResponseEnum.NOT_PERMISSION;
//          throw new ResBaseException({
//            ...Error,
//            message: Error.message.replace('%s', currentRoleName),
//            result: `当前权限组 [${userRoleName}]`
//          });
//        }
//      }
//      return user;
//    }
//  }
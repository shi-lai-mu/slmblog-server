import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UserConfigEntity } from "src/modules/user/entity/user.entity";
import { SaveUserConfigDto } from "../dto/userConfig.dto";
import { ResponseBody, ResponseEnum } from "src/constants/response";

/**
 * 用户配置 逻辑层
 */
@Injectable()
export class UserConfigService {

  constructor(
    @InjectRepository(UserConfigEntity) private readonly UserConfigRepository: Repository<UserConfigEntity>,
  ) {}


  /**
   * 获取用户配置
   * @param userId 用户ID
   */
  async getConfig(userId: number) {
    const config = await this.UserConfigRepository.findOne({ user: userId });
    if (config) {
      config.json = JSON.parse(config.json);
    }
    return config.json;
  }


  /**
   * 保存用户配置
   * @param userId     用户ID
   * @param userConfig 配置内容
   */
  async saveConfig(userId: number, userConfig: SaveUserConfigDto) {
    const currentConfig = await this.UserConfigRepository.findOne({ user: userId });
    if (currentConfig) {
      const { raw } = await this.UserConfigRepository.update({
        user: userId,
      }, {
        json: userConfig.json,
      });
      if (!raw.affectedRows) ResponseBody.throw(ResponseEnum.CONFIG.SAVE_UPDATE_ERROR);
    } else {
      const { raw } = await this.UserConfigRepository.insert({
        user: userId,
        json: userConfig.json,
      });
      if (!raw.insertId) ResponseBody.throw(ResponseEnum.CONFIG.SAVE_INSERT_ERROR);
    }
    return JSON.parse(userConfig.json);
  }
}
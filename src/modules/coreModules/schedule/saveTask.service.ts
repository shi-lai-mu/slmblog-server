import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from "@nestjs/common";

import { ArticleCommentService } from "src/modules/article/service/comment.service";



/**
 * 核心 定时器 保存任务 逻辑
 */
@Injectable()
export class ScheduleSaveTaskService {

  constructor(
    private readonly Logger: Logger,
    private readonly ArticleCommentService: ArticleCommentService,
  ) {}

  @Cron('1 * * * * *')
  handleCron() {
    // this.Logger.debug('该方法将在45秒标记处每分钟运行一次');
    this.ArticleCommentService.saveRedisData();
  }
}
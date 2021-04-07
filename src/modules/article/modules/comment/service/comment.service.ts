
import { Injectable } from "@nestjs/common";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Article } from "../../../entity/article.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { ArticleComment } from "../entity/comment.entity";

import { ArticleService } from 'src/modules/article/article.service';

import { skipPage } from "src/utils/collection";
import { ArticleCommentNS } from "../type/comment";
import { responseList } from 'src/utils/collection';
import { ResponseBody } from "src/constants/response";
import { SendArticleCommentDto } from "../dto/comment.dto";
import { ArticleResponse } from "../../../constants/response.cfg";
import { UserTableName } from "src/modules/user/constants/entity.cfg";



/**
 * 文章业务 评论 逻辑层 
 */
@Injectable()
export class ArticleCommentService {

  constructor(
    @InjectRepository(Article) private readonly Article: Repository<Article>,
    @InjectRepository(ArticleComment) private readonly ArticleComment: Repository<ArticleComment>,
  ) {}


  /**
   * 获取文章评论
   * @param articleId 文章ID
   * @param page      页数
   * @param count     个数
   * @param parentId  父级评论ID
   */
  async getArticleComment(articleId: Article['id'], page: number, count: number, parentId?: ArticleComment['id']) {
    const user = UserTableName.USER;

    const commentList = await this.ArticleComment
      .createQueryBuilder('comment')
      .leftJoin('comment.user', user)
      .select([ 'comment' ])
      .addSelect([ `${user}.id`, `${user}.avatarUrl`, `${user}.nickname` ])
      .where({
        article: articleId,
        parent: parentId ?? IsNull(),
      })
      .orderBy('comment.id')
      .skip(skipPage(page, count))
      .take(count)
      .cache(600 * 1000)
      .getManyAndCount()
    ;

    if (commentList[0]) {
      for (const comment of commentList[0] as ArticleCommentNS.CommentListItem[]) {
        if (comment.subCommentCount) {
          comment.subComment = await this.getArticleComment(articleId, 1, 10, comment.id);
        }
      }
    }

    const [ list, total ] = commentList;
    return responseList(page, count, list, total);
  }


  /**
   * 发表评论
   * @param articleId          文章ID
   * @param sendArticleComment 评论入参
   * @param user               评论用户
   */
  async send( articleId: string, sendArticleComment: SendArticleCommentDto, user?: UserEntity) {
    let { content } = sendArticleComment;
    const { nickname, email, link, parentId } = sendArticleComment;
    const article = await this.Article.findOne(articleId);
    let parent: ArticleComment | null = null;

    if (!article) {
      ResponseBody.throw(ArticleResponse.STATE_NOT_EXISTS);
    }

    // 查询父级
    if (parentId !== undefined) {
      parent = await this.ArticleComment.findOne(parentId);
      if (!parent) {
        ResponseBody.throw(ArticleResponse.SEND_SUB_COMMENT_PARENT_NOT);
      }
    }
    
    // 敏感词
    const isMintContent = ArticleService.SensitiveWord.filterSync(content, { every: false, replace: false });
    if (isMintContent.words.length) {
      const errMsg = ArticleResponse.SUB_IS_SENSITIVE;
      errMsg.message = errMsg.message.replace('%s', isMintContent.words.join(', '));
      ResponseBody.throw(errMsg);
    }

    // 非img标签替换
    content = content
      .replace(/<img /g, '<-img ')
      .replace(/<(\/)?[a-zA-Z]+[1-9]?[^><]*>/g, '')
      .replace(/<-img /g, '<img ')
    ;

    // 存储
    const commentQuery = (await new ArticleComment({
        article: Number(articleId),
        content,
        user: user.id,
        nickname,
        email,
        link,
        parent: parentId,
      })
      .save()
    ) as ArticleCommentNS.CommentListItem;

    if (!commentQuery.id) {
      ResponseBody.throw(ArticleResponse.SEND_COMMENT_ERROR);
    }

    // 更新子评论数量
    if (commentQuery.parent && parent) {
      this.ArticleComment
      .update({
        id: commentQuery.parent,
      }, {
        subCommentCount: ++parent.subCommentCount,
      });
    }

    // 插入自己评价的用户信息
    if (user) {
      commentQuery.user = {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
      } as any;
    }

    // 更新评论数量
    this.Article.update({
      id: Number(articleId),
    }, {
      commentCount: article.commentCount + 1,
    });

    if (!commentQuery.parent) {
      commentQuery.subComment = commentQuery.subComment || {
        list: [],
        total: 0,
        page: 0,
        pageSize: 0,
      };
    }
    
    return commentQuery;
  }
}
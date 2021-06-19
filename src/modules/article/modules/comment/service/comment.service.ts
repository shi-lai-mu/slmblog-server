import { In, IsNull, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Article } from '../../../entity/article.entity'
import { ArticleComment } from '../entity/comment.entity'
import { ArticleLove } from '../entity/comment.love.entity'
import { UserEntity } from 'src/modules/user/entity/user.entity'

import { ArticleService } from 'src/modules/article/article.service'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'

import { skipPage } from 'src/utils/collection'
import { ArticleCommentNS } from '../type/comment'
import { ArticleNS } from '../../../type/article'
import { responseList } from 'src/utils/collection'
import { ResponseBody } from 'src/constants/response'
import { SendArticleCommentDto } from '../dto/comment.dto'
import { ArticleResponse } from '../../../constants/response.cfg'
import { UserTableName } from 'src/modules/user/constants/entity.cfg'

/**
 * 文章业务 评论 逻辑层
 */
export class ArticleCommentService {
  constructor(
    private readonly RedisService: RedisService,
    @InjectRepository(Article) private readonly Article: Repository<Article>,
    @InjectRepository(ArticleLove) private readonly ArticleLove: Repository<ArticleLove>,
    @InjectRepository(ArticleComment) private readonly ArticleComment: Repository<ArticleComment>
  ) {}

  /**
   * 获取 文章/评论 点赞数据
   * @param articleId 文章ID
   * @param commentId 评论ID
   */
  async getLoveBehaviorCheck(articleId: number, commentId?: string[]) {
    if (!commentId) commentId = ['0']
    const check: null | ArticleNS.LoveIdList[] = await this.RedisService.hmGetItem(
      'articleComment',
      String(articleId),
      ...commentId
    )
    const ids = []
    const comment: { [k: number]: ArticleNS.LoveIdList } = {}
    Object.values(check).forEach((love, i) => {
      if (!love) {
        ids.push(commentId[i])
      }
      comment[love ? love[1] : commentId[i]] = love
    })

    // 不存在缓存需写入缓存
    if (ids.length) {
      const dbData = await this.ArticleLove.find({
        where: {
          article: articleId,
          targetId: In(ids),
        },
        take: ids.length,
      })

      const checkArray: string[] = []
      dbData.forEach(data => {
        const json = JSON.parse(data.json)
        const checkData: ArticleNS.LoveIdList = [data.id, data.targetId, json[2], json[3]]
        checkArray.push(String(data.targetId), JSON.stringify(checkData))
        comment[data.targetId] = checkData
      })
      if (checkArray.length) {
        this.RedisService.hmSetItem('articleComment', String(articleId), ...checkArray)
      }
    }

    return comment
  }

  /**
   * 获取文章评论
   * @param articleId 文章ID
   * @param page      页数
   * @param count     个数
   * @param options   额外配置  parentId: 父级评论ID   user: 用户信息(用于判定是否点赞)
   */
  async getArticleComment(
    articleId: Article['id'],
    page: number,
    count: number,
    options?: {
      parentId?: ArticleComment['id']
      user?: UserEntity
    }
  ) {
    const user = UserTableName.USER
    const [list, total] = await this.ArticleComment.createQueryBuilder('comment')
      .leftJoin('comment.user', user)
      .select(['comment'])
      .addSelect([`${user}.id`, `${user}.avatarUrl`, `${user}.nickname`])
      .where({
        article: articleId,
        parent: options.parentId ?? IsNull(),
      })
      .orderBy('comment.id')
      .skip(skipPage(page, count))
      .take(count)
      .cache(600 * 1000)
      .getManyAndCount()
    if (list) {
      const ids: string[] = []
      for (const comment of list as ArticleCommentNS.CommentListItem[]) {
        if (comment.subCommentCount) {
          comment.subComment = await this.getArticleComment(articleId, 1, 5, {
            ...options,
            parentId: comment.id,
          })
        }
        ids.push(String(comment.id))
      }

      // 读取/写入 赞/踩 数据
      const loveData = await this.getLoveBehaviorCheck(articleId, ids)
      list.forEach((comment, i) => {
        if (loveData[comment.id]) {
          const item = loveData[comment.id]
          const [, , love, criticism] = item
          comment.criticismNum = criticism.length
          comment.loveNum = love.length

          const userInfo = options.user
          if (userInfo?.id) {
            comment.likeStatus = love.includes(userInfo.id)
              ? 1
              : criticism.includes(userInfo.id)
              ? 2
              : 0
          }
        }
      })
    }

    return responseList(page, count, list, total)
  }

  /**
   * 发表评论
   * @param articleId          文章ID
   * @param sendArticleComment 评论入参
   * @param user               评论用户
   */
  async send(articleId: string, sendArticleComment: SendArticleCommentDto, user?: UserEntity) {
    let { content } = sendArticleComment
    const { nickname, email, link, parentId } = sendArticleComment
    const article = await this.Article.findOne(articleId)
    let parent: ArticleComment | null = null

    if (!article) {
      ResponseBody.throw(ArticleResponse.STATE_NOT_EXISTS)
    }

    // 查询父级
    if (parentId !== undefined) {
      parent = await this.ArticleComment.findOne(parentId, {
        loadRelationIds: true,
      })

      if (!parent) {
        ResponseBody.throw(ArticleResponse.SEND_SUB_COMMENT_PARENT_NOT)
      }
      if (parent.parent) {
        ResponseBody.throw(ArticleResponse.SEND_SUB_NOT_COMMENT_PARENT)
      }
    }

    // 敏感词
    const isMintContent = ArticleService.SensitiveWord.filterSync(content, {
      every: false,
      replace: false,
    })
    if (isMintContent.words.length) {
      const errMsg = ArticleResponse.SUB_IS_SENSITIVE
      errMsg.message = errMsg.message.replace('%s', isMintContent.words.join(', '))
      ResponseBody.throw(errMsg)
    }

    // 非img标签替换
    content = content
      .replace(/<img /g, '<-img ')
      .replace(/<(\/)?[a-zA-Z]+[1-9]?[^><]*>/g, '')
      .replace(/<-img /g, '<img ')

    // 存储
    const commentQuery = (await new ArticleComment({
      article: Number(articleId),
      content,
      user: user.id,
      nickname,
      email,
      link,
      parent: parentId,
    }).save()) as ArticleCommentNS.CommentListItem

    if (!commentQuery.id) {
      ResponseBody.throw(ArticleResponse.SEND_COMMENT_ERROR)
    }

    // 更新子评论数量
    if (commentQuery.parent && parent) {
      this.ArticleComment.update(
        {
          id: commentQuery.parent,
        },
        {
          subCommentCount: ++parent.subCommentCount,
        }
      )
    }

    // 插入自己评价的用户信息
    if (user) {
      commentQuery.user = {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
      } as any
    }

    // 更新评论数量
    this.Article.update(
      {
        id: Number(articleId),
      },
      {
        commentCount: article.commentCount + 1,
      }
    )

    if (!commentQuery.parent) {
      commentQuery.subComment = commentQuery.subComment || {
        list: [],
        total: 0,
        page: 0,
        pageSize: 0,
      }
    }

    return commentQuery
  }
}

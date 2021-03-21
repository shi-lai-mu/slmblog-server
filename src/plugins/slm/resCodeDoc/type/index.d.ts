import { Status } from "src/constants/response";



export namespace ResponseDocument {
  /**
   * 响应文档参数
   */
  export interface Options {
    /**
     * 标题
     */
    title?: string;
    /***
     * 路由
     */
    url?: string;
  }
  

  /**
   * 响应
   */
  export interface ResStatus extends Status {
    /**
     * 调用键
     */
    key: string;
    /**
     * 业务拓展模块名
     */
    extends?: string;
  }


  /**
   * 响应文档注入入参
   */
  export interface InsterOptions {
    /**
     * 业务名
     */
    name: string;
    /**
     * 本业务其实码
     */
    startCode?: number;
    /**
     * 业务拓展模块名
     */
    extends?: string;
  }


  export type CodeTypeObject = {
    [k: string]: {
      /**
       * 错误类型名称
       */
      type: string;
      /**
       * 响应Map
       */
      resMap: ResponseDocument.ResStatus[];
      /**
       * 响应码状态
       */
      code: {
        /**
         * 起始码
         */
        start: number;
        /**
         * 截止码
         */
        end: number;
        /**
         * 转换次数
         */
        transferLogCount: number;
      };
    }
  }


  /**
   * 响应业务
   */
  export interface responseBusiness {
    [key: string]: {
      /**
       * 错误类型
       */
      type: string;
      /**
       * 总数统计
       */
      total: number;
    }
  }

  /**
   * 错误类型
   */
  export type CodeType = 'P' | 'B' | 'N' | 'D' | 'F' | 'I' | 'O';

  /**
   * 错误类型中文定义
   */
  export interface CodeObject {
    /**
     * 置顶Code类型
     */
    name: CodeType;
    /**
     * 显示名称
     */
    type: string;
  }
}

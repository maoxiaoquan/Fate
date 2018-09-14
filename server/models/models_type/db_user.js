const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../../utils/time')

module.exports = {
  NAME: 'user', /*表名*/
  TABLE: {
    /*表结构*/
    uid: { // 用户ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'uid',
      field: 'uid'
    },
    avatar: { // 头像
      type: Seq.STRING(100),
      comment: '头像',
      field: 'avatar'
    },
    nickname: { // 昵称
      type: Seq.STRING(16),
      comment: '昵称',
      field: 'nickname'
    },
    password: { // 密码
      type: Seq.STRING(100),
      comment: '密码',
      field: 'password'
    },
    sex: { // 性别
      type: Seq.STRING(10),
      comment: '性别',
      field: 'sex'
    },
    phone: { // 手机号码
      type: Seq.STRING(15),
      comment: '手机号码',
      field: 'phone'
    },
    email: { // 邮箱
      type: Seq.STRING(36),
      comment: '邮箱',
      field: 'email'
    },
    reg_ip: { // 注册IP
      type: Seq.STRING(16),
      comment: '注册IP',
      field: 'reg_ip'
    },
    last_sign_ip: { // 最后登录ip
      type: Seq.STRING(16),
      comment: '最后登录ip',
      field: 'last_sign_ip'
    },
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
    last_sign_time: { // 最后登录时间
      type: Seq.BIGINT(50),
      comment: '最后登录时间',
      field: 'last_sign_time'
    },
    introduction: { // 简介
      type: Seq.TEXT,
      comment: '简介',
      field: 'introduction'
    },
    user_tag_ids: {
      type: Seq.STRING(100),
      comment: '用户的标签',
      field: 'user_tag_ids'
    },
    enable: { // 是否可以登录
      type: Seq.BOOLEAN,
      comment: '是否可以登录',
      field: 'enable'
    }
  }
}
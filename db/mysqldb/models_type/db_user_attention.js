const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'user_attention' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    uid: {
      // 用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    attention_uid: {
      // 关注的用户ID
      type: Seq.INTEGER(10),
      comment: 'attention_uid',
      field: 'attention_uid'
    },
    ...time.create_date
  }
}

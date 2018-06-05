import React from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, Select, Table, Modal, InputNumber, Tree } from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import { isEmpty } from '../../../utils/tools'
import './AdminAuthority.scss'
import {
  create_admin_authority,
  get_admin_authority_list,
  delete_admin_authority
} from '../action/AdminAuthorityAction'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

class AdminAuthority extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      authority_type_select: 1,
      authority_parent_id: '',
      authority_parent_title: ''
    }
  }

  componentDidMount () {
    this.fetch_admin_authority_list()
  }

  showModal = async (value) => {
    console.log('value', value)
    this.props.form.resetFields()
    this.setState({
      visible: true,
      authority_parent_id: value ? value.authority_id : '',
      authority_parent_title: value ? value.authority_name : ''
    })
    /*this.props.form.setFieldsValue({
      authority_parent_title: '11'
    })*/
    if (!value) {
      this.props.form.setFields({
        authority_sort: {
          value: await this.props.admin_authority.admin_authority_list.length
        }
      })

    } else {
      this.props.form.setFields({
        authority_sort: {
          value: value.children.length
        }
      })
    }

  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  authority_type_Change = (value) => {
    this.setState({
      authority_type_select: value
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.fetch_admin_authority_create(values)
        console.log('Received values of form: ', values)
      }
    })
  }

  handle_delete_authority = (data) => {
    const that = this
    confirm({
      title: '你确认要删除当前权限吗',
      content: `${data.authority_name}，删除权限后，所有与之关联的角色将失去此权限！`,
      okText: 'YES',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        that.fetch_admin_authority_delete(data)
      },
      onCancel () {
      }
    })
  }

  fetch_admin_authority_list = () => {
    this.props.dispatch(get_admin_authority_list())
  }

  fetch_admin_authority_create = async (values) => {

    await this.props.dispatch(create_admin_authority({
      authority_name: values.authority_name,
      authority_type: values.authority_type,
      authority_parent_id: this.state.authority_parent_id,
      authority_url: values.authority_url,
      authority_sort: values.authority_sort,
      authority_description: values.authority_description
    }, () => {
      this.setState({
        visible: false
      })
      this.fetch_admin_authority_list()
      alert.message_success('权限创建成功')
    }))
  }

  fetch_admin_authority_delete = async (data) => {
    let id_arr = await this.traversal_delete(data)
    await this.props.dispatch(delete_admin_authority({authority_id_arr: id_arr}, () => {
      this.fetch_admin_authority_list()
      alert.message_success('删除成功')
    }))
  }

  traversal_delete = (val) => {
    let _arr = []

    function id_arr (data) {
      for (let i in data) {
        _arr.push(data[i].authority_id)
        if (!isEmpty(data[i].children)) {
          id_arr(data[i].children)
        }
      }
    }

    _arr.push(val.authority_id)
    if (!isEmpty(val.children)) {
      id_arr(val.children)
    }
    return _arr
  }

  render () {
    const {admin_authority} = this.props
    const {getFieldDecorator} = this.props.form
    const {authority_type_select, authority_parent_title} = this.state

    const customLabel = (data) => {
      return (
        <div className="box-tree-title clearfix">
          <div className="pull-left">
            <span className="title">{data.authority_name} </span>
          </div>
          <div className="pull-right">
            <Icon type="plus-circle-o" onClick={() => this.showModal(data)}/>
            <Icon type="edit"/>
            <Icon type="delete" onClick={() => this.handle_delete_authority(data)}/>
          </div>
        </div>
      )
    }

    const TreeNodeTree = (data) => {
      return (
        data.length > 0 ? (
          data.map((item) => {
            return (
              <TreeNode title={customLabel(item)} key={item.authority_id}>
                {TreeNodeTree(item.children)}
              </TreeNode>
            )
          })
        ) : null
      )
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 19}
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 5
        }
      }
    }

    return (
      <div className="box-card">
        <div className="box-card-header">
          <h2><strong>权限管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <div className="admin-authority">
            <Button className="admin-authority-create-btn" icon="plus"
                    onClick={() => this.showModal()}
                    type="primary">创建权限</Button>
            <Modal
              footer={null}
              onCancel={this.handleCancel}
              title="创建权限"
              visible={this.state.visible}
            >

              <Form className="login-form" onSubmit={this.handleSubmit}>

                {
                  authority_parent_title ? (
                    <FormItem
                      {...formItemLayout}
                      label="父权限名称"
                    >
                      <Input disabled={true} type="text" value={this.state.authority_parent_title}/>
                    </FormItem>
                  ) : ''
                }

                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限名称"
                >
                  {getFieldDecorator('authority_name', {
                    rules: [{required: true, message: '请输入权限名称'}]
                  })(
                    <Input type="text"/>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限类型"
                >
                  {getFieldDecorator('authority_type', {
                    rules: [
                      {required: true, message: '请选择权限类型！'}
                    ]
                  })(
                    <Select onChange={this.authority_type_Change} placeholder="请选择权限类型！">
                      <Option value="1">基础菜单</Option>
                      <Option value="2">操作和功能</Option>
                    </Select>
                  )}
                </FormItem>

                {
                  Number(authority_type_select) === 2 ? (
                      <FormItem
                        {...formItemLayout}
                        hasFeedback
                        label="权限路径"
                      >
                        {getFieldDecorator('authority_url', {
                          rules: [{required: true, message: '请输入权限路径'}]
                        })(
                          <Input addonBefore="/api/" placeholder="请输入权限路径" type="text"/>
                        )}
                      </FormItem>
                    )
                    : (
                      <FormItem
                        {...formItemLayout}
                        hasFeedback
                        label="权限路径"
                      >
                        {getFieldDecorator('authority_url', {
                          rules: [{required: true, message: '请输入权限路径'}]
                        })(
                          <Input placeholder="请输入权限路径" type="text"/>
                        )}
                      </FormItem>
                    )
                }


                <FormItem
                  {...formItemLayout}
                  label="排序"
                >
                  {getFieldDecorator('authority_sort')(
                    <InputNumber/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限描述"
                >
                  {getFieldDecorator('authority_description', {
                    rules: [{required: true, message: '请输入权限描述'}]
                  })(
                    <Input placeholder="请输入权限描述" type="text"/>
                  )}
                </FormItem>
                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    提交
                  </Button>
                  <Button onClick={this.handleReset} style={{marginLeft: 8}}>
                    重置
                  </Button>
                </FormItem>
              </Form>

            </Modal>

            <Tree
              showLine
            >
              {
                admin_authority.admin_authority_list.map((item) => {
                  return (
                    <TreeNode title={customLabel(item)} key={item.authority_id}>
                      {TreeNodeTree(item.children)}
                    </TreeNode>
                  )
                })
              }
            </Tree>
          </div>
        </div>
      </div>
    )
  }
}

const AdminAuthorityForm = Form.create()(AdminAuthority)

export default connect(({admin_authority}) => {
  return {
    admin_authority
  }
})(AdminAuthorityForm)


import React, { PureComponent } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  HashRouter,
  browserHistory,
} from 'react-router-dom'
import {
  Menu, Icon, Row, Col, Layout, Drawer,
} from 'antd'
import { connect } from 'react-redux'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { get_admin_user_info } from '../../../stores/actions/index'

import Header from '../../../components/Parts/Header' // 头部
import Aside from '../../../components/Parts/Aside' // 侧栏

const { Content, Footer, Sider } = Layout

class Manager extends PureComponent {
  state = {
    isMobile: false,
    collapsed: false,
  }

  componentDidMount() {
    this.eHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        })
      }
    })
    this.props.dispatch(get_admin_user_info())
  }

  componentWillUnmount() {
    unenquireScreen(this.eHandler)
  }

  onCollapseChange = (collapsed) => {
    this.setState({
      collapsed,
    })
  }

  render() {
    const { collapsed, isMobile } = this.state

    const asideProps = {
      collapsed,
      onCollapseChange: this.onCollapseChange,
    }

    const headerProps = {
      collapsed,
      onCollapseChange: this.onCollapseChange,
    }

    console.log('collapsed111', collapsed)

    return (
      <Layout className="admin-manager">
        {
          isMobile
            ? (
              <Drawer
                maskClosable
                placement="left"
                closable={false}
                onClose={this.onCollapseChange.bind(this, !collapsed)}
                visible={!collapsed}
                width={200}
                style={{
                  padding: 0,
                  height: '100vh',
                }}>
                <Aside {...{
                  ...asideProps,
                  collapsed: false,
                  onCollapseChange: () => {}
                }} />
              </Drawer>
            )
            : <Aside {...asideProps} />
        }
        <Layout className="admin-wrapper">
          <Header {...headerProps} />
          <Content className="admin-content">
            {this.props.children}
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ state_title }) => ({
  state_title,
}))(Manager)

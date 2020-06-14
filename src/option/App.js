import React from "react";
import { Layout, Menu, Switch, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { newRule, saveOptions, routes } from "./utils";
import { addRule, replaceConfig } from "./actions/config";
import {
  Switch as RouterSwitch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import "./App.css";
import Rule from "./components/Rule";
import Record from "./components/Record";

const { Header, Content, Footer } = Layout;

function App(props) {
  let appRoute = routes[0].route;
  routes.forEach((route) => {
    if (useRouteMatch(route.route)) {
      appRoute = route.route;
    }
  });
  console.log("appRoute", appRoute);
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <Menu theme="dark" mode="horizontal" selectedKeys={[appRoute]}>
          {routes.map((route) => {
            return (
              <Menu.Item key={route.route}>
                <Link to={route.route}>{route.title}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
        <span className="logo_text">easy-interceptor</span>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, marginTop: 24 }}
        >
          <RouterSwitch>
            <Route path="/records">
              <Record />
            </Route>
            <Route path={["/", "/rules"]}>
              <div className="app_rule_header">
                <Switch
                  checkedChildren="全部开启"
                  unCheckedChildren="全部关闭"
                  checked={props.config.switch}
                  onChange={props.onChangeConfig({
                    switch: !props.config.switch,
                  })}
                />
                <Button
                  type="primary"
                  shape="round"
                  style={{ marginLeft: 16 }}
                  icon={<PlusOutlined />}
                  onClick={props.onAddRule}
                  size="small"
                >
                  Rule
                </Button>
              </div>
              {props.config.rules.map((rule, index) => {
                return <Rule rule={rule} index={index} />;
              })}
              <div className="app_rule_footer">
                <Button
                  type="primary"
                  shape="round"
                  style={{ marginLeft: 16 }}
                  icon={<SaveOutlined />}
                  onClick={() => {
                    saveOptions(props.config, () => {
                      message.success("配置已生效！");
                    });
                  }}
                  size="big"
                >
                  保存配置
                </Button>
              </div>
            </Route>
          </RouterSwitch>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Easy Interceptor ©2020 Created by Bayes Wang
      </Footer>
    </Layout>
  );
}

export default connect(
  (state, ownProps) => ({
    config: state.config,
    record: state.record,
  }),
  (dispatch, ownProps) => ({
    onAddRule: () => {
      dispatch(addRule(newRule()));
    },
    onChangeConfig: (config) => () => {
      dispatch(replaceConfig(config));
    },
  })
)(App);

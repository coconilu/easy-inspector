import React from "react";
import { Input, Select, Card, Switch, Divider, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { resourceTypes, urlTypes, headerType, newHeader } from "../utils";
import "./Rule.css";
import { connect } from "react-redux";
import { delRule, changeRule } from "../actions/config";

const { Option } = Select;

const buttonSize = "small";

function renderHeaders(headers, _type, props) {
  return headers.map((header, index) => {
    return (
      <div className="header_container">
        <Select
          defaultValue={headerType[0]}
          value={header.type}
          style={{ width: 100, marginRight: 16 }}
          onChange={(v) => {
            props.onChangeHeader(_type, index, { type: v });
          }}
        >
          {headerType.map((type) => {
            return <Option value={type}>{type}</Option>;
          })}
        </Select>
        <Input
          style={{ width: 200, marginRight: 16 }}
          addonBefore="name: "
          value={header.name}
          key="name"
          onChange={(e) => {
            props.onChangeHeader(_type, index, { name: e.target.value });
          }}
          placeholder=""
        />
        <Input
          style={{
            width: 320,
            marginRight: 16,
            display: `${header.type === "add" ? "inline-block" : "none"}`,
          }}
          addonBefore="value: "
          value={header.value}
          key="value"
          onChange={(e) => {
            props.onChangeHeader(_type, index, { value: e.target.value });
          }}
          placeholder=""
        />
        <div className="header_delete_button">
          <Button
            type="primary"
            shape="round"
            icon={<CloseOutlined />}
            onClick={props.onDeleteHeader(_type, index)}
            size={buttonSize}
            danger
          >
            Header
          </Button>
        </div>
      </div>
    );
  });
}

function Blank() {
  return <p style={{ textAlign: "center", fontSize: 18 }}>空</p>;
}

function Rule(props) {
  const {
    switch: ruleSwitch,
    urlType,
    urlString,
    resourceType,
    reqHeaders,
    resHeaders,
  } = props.rule;
  const ruleIndex = props.index;
  return (
    <Card
      title={`Rule_${ruleIndex + 1}`}
      extra={
        <div className="rule_card_header_right">
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            style={{ marginRight: 16 }}
            checked={ruleSwitch}
            onChange={props.onChangeRule({ switch: !ruleSwitch })}
          />
          <Button
            type="primary"
            shape="round"
            icon={<CloseOutlined />}
            onClick={props.onDeleteRule}
            size={buttonSize}
            danger
          >
            Rule
          </Button>
        </div>
      }
    >
      <div className="rule_container_header">
        <span style={{ whiteSpace: "nowrap" }}>URL 匹配规则：</span>
        <Select
          defaultValue={resourceTypes[0]}
          value={resourceType}
          style={{ width: 200, marginRight: 16 }}
          onChange={(v) => {
            props.onChangeRule({ resourceType: v })();
          }}
        >
          {resourceTypes.map((type) => {
            return <Option value={type}>{type}</Option>;
          })}
        </Select>
        <Select
          defaultValue={urlTypes[0]}
          value={urlType}
          style={{ width: 120, marginRight: 16 }}
          onChange={(v) => {
            props.onChangeRule({ urlType: v })();
          }}
        >
          {urlTypes.map((type) => {
            return <Option value={type}>{type}</Option>;
          })}
        </Select>
        <Input
          addonBefore={urlType === "include" ? "包含" : "正则"}
          value={urlString}
          style={{ flexGrow: 1 }}
          onChange={(e) => {
            props.onChangeRule({ urlString: e.target.value })();
          }}
          placeholder=""
        />
      </div>
      <div className="rule_container_body">
        <div className="rule_container_body_title">
          <Divider
            orientation="left"
            className="rule_container_body_title_left"
            plain
          >
            处理请求头
          </Divider>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size={buttonSize}
            onClick={props.onAddHeader("reqHeaders")}
          >
            Header
          </Button>
        </div>
        <div>
          {reqHeaders.length
            ? renderHeaders(reqHeaders, "reqHeaders", props)
            : Blank()}
        </div>
        <div className="rule_container_body_title">
          <Divider
            orientation="left"
            className="rule_container_body_title_left"
            plain
          >
            处理响应头
          </Divider>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size={buttonSize}
            onClick={props.onAddHeader("resHeaders")}
          >
            Header
          </Button>
        </div>
        <div>
          {resHeaders.length
            ? renderHeaders(resHeaders, "resHeaders", props)
            : Blank()}
        </div>
      </div>
    </Card>
  );
}

export default connect(
  (state, ownProps) => ({}),
  (dispatch, ownProps) => ({
    onAddHeader: (headerType) => () => {
      dispatch(
        changeRule({
          index: ownProps.index,
          rule: Object.assign({}, ownProps.rule, {
            [headerType]: ownProps.rule[headerType].concat([newHeader()]),
          }),
        })
      );
    },
    onDeleteHeader: (headerType, headerIndex) => () => {
      dispatch(
        changeRule({
          index: ownProps.index,
          rule: Object.assign({}, ownProps.rule, {
            [headerType]: ownProps.rule[headerType].filter(
              (header, index) => index !== headerIndex
            ),
          }),
        })
      );
    },
    onChangeHeader: (headerType, headerIndex, _header) => {
      dispatch(
        changeRule({
          index: ownProps.index,
          rule: Object.assign({}, ownProps.rule, {
            [headerType]: ownProps.rule[headerType].map((header, index) =>
              index !== headerIndex ? header : Object.assign(header, _header)
            ),
          }),
        })
      );
    },
    onChangeRule: (rule) => () => {
      dispatch(
        changeRule({
          index: ownProps.index,
          rule: Object.assign({}, ownProps.rule, rule),
        })
      );
    },
    onDeleteRule: () => {
      dispatch(delRule({ index: ownProps.index }));
    },
  })
)(Rule);

import React from "react";
import { Collapse, Table, Tooltip, Button } from "antd";
import { connect } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";

import { combineHeaders } from "../utils";
import { cleanRecords } from "../actions/record";
import "./Record.css";

const { Panel } = Collapse;
const { Column, ColumnGroup } = Table;

function URLDisplay(props) {
  return (
    <Tooltip title={props.title} color="cyan" placement="bottom">
      <p className="url_display">{props.title}</p>
    </Tooltip>
  );
}

function Record(props) {
  const records = props.record.records;

  return (
    <div>
      <div className="record_header_container">
        <Button
          type="primary"
          shape="round"
          icon={<CloseOutlined />}
          onClick={props.onCleanRecords}
          size={"big"}
          danger
        >
          清空列表
        </Button>
      </div>
      <Collapse>
        {records.map((record, index) => {
          const headers = combineHeaders(record.reqHeaders, record.resHeaders);
          return (
            <Panel header={<URLDisplay title={record.url} />} key={index}>
              <p>{`资源类型：${record.resourceType} `}</p>
              <p>{`请求方法：${record.method}`}</p>
              <p>
                <Table dataSource={headers} pagination={false} bordered={true}>
                  <ColumnGroup title="请求头">
                    <Column title="Key" dataIndex={["reqHeader", "name"]} />
                    <Column title="Value" dataIndex={["reqHeader", "value"]} />
                  </ColumnGroup>
                  <ColumnGroup title="响应头">
                    <Column title="Key" dataIndex={["resHeader", "name"]} />
                    <Column title="Value" dataIndex={["resHeader", "value"]} />
                  </ColumnGroup>
                </Table>
              </p>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

export default connect(
  (state, ownProps) => ({
    record: state.record,
  }),
  (dispatch, ownProps) => ({
    onCleanRecords: () => {
      dispatch(cleanRecords());
    },
  })
)(Record);

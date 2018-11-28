import React from 'react';
import { Button, message, Col, Form, Input, Select, Table, Divider, Tag, Spin } from 'antd';
import { bindActionCreators } from 'redux';
import { cityJson } from '../../../api/tool.js';// 世界国家数据
import app from 'app';

import { connect } from 'dva';
import styles from './LogView.less';

// const Option = Select.Option;

// let dataSource = [];

const columns = [{
  title: '编码',
  dataIndex: 'operationRecognitionCode',
  key: 'operationRecognitionCode',
}, {
  title: '姓名',
  dataIndex: 'operationName',
  key: 'operationName',
}, {
  title: '模块',
  dataIndex: 'operationModule',
  key: 'operationModule',
}, {
  title: '时间',
  dataIndex: 'operationTime',
  key: 'operationTime',
}, {
  title: '操作',
  dataIndex: 'operationMovement',
  key: 'operationMovement',
}, {
  title: '内容',
  dataIndex: 'operationExplain',
  key: 'operationExplain',
}];


class LogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      page: 1,
      rows: 12,
      total: '',
      proLoading: true, // 产品加载中属性
    };
  }
  componentDidMount() {
    this.getTable(this.state.page, this.state.rows);
  }

  getTable = (page, rows) => {
    this.setState({
      proLoading: true,
    });
    const data = {
      page,
      rows,
    };
    const self = this;
    app.$api.findLogAll(data).then((res) => {
      const allData = res.data.data;
      allData.forEach((item) => {
        item.operationTime = app.$tool.day(item.operationTime).format('YYYY MM-DD HH:mm:ss');
      });
      this.setState({
        dataSource: allData,
        total: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  changePage = (page, rows) => {
    this.setState(() => ({
      page,
    }), () => {
      this.getTable(this.state.page, this.state.rows);
    });
  }

  paginationFun = () => {
    return {
      current: this.state.page,
      defaultPageSize: this.state.rows,
      total: this.state.total,
      onChange: this.changePage,
    };
  }

  render() {
    const self = this;
    return (
      <div className={styles.logWrap} >
        <div className={styles.title}>日志查看</div>
        <div>
          <Spin size="large" spinning={this.state.proLoading} >
            <Table
              dataSource={this.state.dataSource}
              columns={columns}
              pagination={{  // 分页
                current: this.state.page,
                defaultPageSize: this.state.rows,
                total: this.state.total,
                onChange: this.changePage,
              }}
            />
          </Spin>
        </div>
      </div>
    ); ss;
  }

}

// const LogViewForm = Form.create()(LogView);
export default connect(() => ({}))(LogView);

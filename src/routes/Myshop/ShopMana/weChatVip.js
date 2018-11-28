import React from 'react';
import { Input, Button, Row, Col, Table, message,Spin } from 'antd';
import app from 'app';

import styles from './weChatVip.less';

class WeChatVip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      search: '',
      proLoading: true, // 筛选条件加载中属性
    };
  }

  getCol() {
    this.setState({
      columns: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>头像/信息</span>,
        dataIndex: 'headPic',
        key: 'headPic',
        render: (text, record, index) => (
          <div>
            <img src={text} width="94" height="94" />
          </div>),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>昵称</span>,
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>性别</span>,
        dataIndex: 'sex',
        key: 'sex',
        render: (text, record, index) => (
          <div>
            {text === '1' ? <span>男</span> : <span>女</span> }
          </div>),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>手机号码</span>,
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>城市</span>,
        dataIndex: 'region',
        key: 'region',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>姓名</span>,
        dataIndex: 'realName',
        key: 'realName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>生日</span>,
        dataIndex: 'birthday',
        key: 'birthday',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>积分</span>,
        dataIndex: 'integral',
        key: 'integral',
        render: (text, record, index) => (
          <div className={styles.integral}>
            <div>平台积分: {text} </div>
            <div>店铺积分: {record.shopIntegral}</div>
          </div>
        ),
        // shopIntegral
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>创建日期</span>,
        dataIndex: 'createTime',
        key: 'createTime',
      }],
    });
  }

  componentDidMount() {
    this.getCol();
    this.getVipList(1);
  }

  getVipList(page, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page,
      row: 10,
      // search,
    };
    otherParams && Object.assign(params, otherParams);
    app.$api.clientList(params).then((res) => {
      const { rowSize: total, data: dataSource } = res.data;
      this.setState({
        dataSource,
        total,
        proLoading:false,
      });
    });
  }

  filterVip(pagina, filters) {
    this.getVipList(pagina.current, params);
  }

  // 获取搜索参数
  getSear(e) {
    this.setState({
      search: e.target.value,
    });
  }

  // 点击确定
  searInfo() {
    const { search } = this.state;
    const params = {
      search,
    };
    this.getVipList(1, params);
  }

  // 单元格样式
  rowClass() {
    return styles.rowClass;
  }

  render() {
    const { dataSource, columns, total } = this.state;
    return (
      <div className={styles.weChatVip} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>VIP客户管理</div>
            {/* <div className={styles.searchBox}>
          <Input style={{ width: 300 }} size="large" placeholder="输入供应商名称查询" />
          <Button className={styles.btn} type="primary">搜索</Button>
        </div> */}
          </div>
          <Row><Col span={6} > <Input placeholder="昵称/手机号码/姓名" onInput={this.getSear.bind(this)} /></Col><Col span={4} offset={1} ><Button type="primary" onClick={this.searInfo.bind(this)} >搜索</Button></Col></Row>
          <div style={{ height: 30 }} />
          <Spin size="large" spinning={this.state.proLoading} >
            <Table
              style={{ marginRight: 50 }}
              bordered
              rowClassName={this.rowClass}
              dataSource={dataSource}
              columns={columns}
              onChange={this.filterVip.bind(this)}
              pagination={{
                total,
                defaultPageSize: 10,
              }}
            />
           </Spin>


        </div>

      </div>
    );
  }
}

WeChatVip.propTypes = {

};

export default WeChatVip;

import React from 'react';
import { Row, Col, Input, Button, Checkbox, message, Modal, Pagination, Tabs } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import styles from './messageModal.less';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

class MessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      operations: '', // 全选按钮
      lineCheckAll: false, // 线上VIP全选
      offLineCheckAll: false, // 线下VIP全选
      lineList: [], // 线上VIP列表
      offLineList: [], // 线下VIP列表
      lineListTrue: [], // 线上VIP列表选中
      offLineListTrue: [], // 线下VIP列表选中
      tabsType: '1',
        // 分页
      pageIndex: 1, // 当前页
      pageSize: 9, // 每页展示条数
    };
  }

  componentDidMount() {
    this.setState({
      visible: this.props.visible,
    });
    this.changeTab('1');
    this.getVipLineList(1);
  }

  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  getVipLineList(page, otherParams) {
    const params = {
      page,
      row: 9,
      // search,
    };
    otherParams && Object.assign(params, otherParams);
    app.$api.clientList(params).then((res) => {
      const { rowSize: totalNum, data: lineList } = res.data;
      this.setState({
        lineList,
        totalNum,
        pageIndex: page,
      });
    });
  }

  getVipOffLineList(page, otherParams) {
    const params = {
      page,
      row: 9,
      // search,
    };
    otherParams && Object.assign(params, otherParams);
    app.$api.clientInfoList(params).then((res) => {
      const { rowSize: totalNum, data: offLineList } = res.data;

    //   offLineList.forEach((item) => {
    //     item.key = (Math.random() * 1000).toFixed(2),
    //     item.name = item.realName,
    //     item.birthday = moment(item.birthday).format('YYYY-MM-DD');
    //     item.createTime = moment(item.createTime).format('YYYY-MM-DD');
    //     item.updateTime = moment(item.updateTime).format('YYYY-MM-DD');
    //   });
      this.setState({
        offLineList,
        totalNum,
        pageIndex: page,
      });
    });
  }


  getAllLine(e) {
    const { lineList } = this.state;
    const lineLists = lineList.map((item) => {
      return item.nickName;
    });
    this.setState({
      lineListTrue: e.target.checked ? lineLists : [],
      lineCheckAll: e.target.checked,
    }, () => {
      this.setState({
        operations: <Checkbox
          onChange={this.getAllLine.bind(this)}
          checked={this.state.lineCheckAll}
        >全选</Checkbox>,
      });
    });
  }

  getAllOffLine(e) {
    const { offLineList } = this.state;
    const offLineLists = offLineList.map((item) => {
      return item.id;
    });
    this.setState({
      offLineListTrue: e.target.checked ? offLineLists : [],
      offLineCheckAll: e.target.checked,
    }, () => {
      this.setState({
        operations: <Checkbox
          onChange={this.getAllOffLine.bind(this)}
          checked={this.state.offLineCheckAll}
        >全选</Checkbox>,
      });
    });
  }

  onChangeLine(e) {
    this.setState({
      lineListTrue: e,
    });
  }

  onChangeOffLine(e) {
    this.setState({
      offLineListTrue: e,
    });
  }

  sendTrue() {
    // const params = {
    // };
    // app.$api.xxx(params).then((res) => {
    message.success('推送成功');
    // });
  }

  changeTab(e) {
    if (e === '1') {
      this.setState({
        tabsType: '1',
        operations: <Checkbox
          onChange={this.getAllLine.bind(this)}
          checked={this.state.lineCheckAll}
        >全选</Checkbox>,
      });
      this.getVipLineList(1);
    } else if (e === '2') {
      this.setState({
        tabsType: '2',
        operations: <Checkbox
          onChange={this.getAllOffLine.bind(this)}
          checked={this.state.offLineCheckAll}
        >全选</Checkbox>,
      });
      this.getVipOffLineList(1);
    }
  }

  onChangPage(pageIndex, pageSize) {
    const { tabsType } = this.state;
    if (tabsType === '1') {
      this.getVipOffLineList(pageIndex);
    }
    if (tabsType === '2') {
      this.getVipOffLineList(pageIndex);
    }
  }
  render() {
    const { onCancel } = this.props;
    const { visible, operations, lineList, offLineList, lineListTrue, offLineListTrue, pageIndex, totalNum, pageSize } = this.state;
    return (
      <Modal
        title="选择推送客户"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={900}
      >
        <div className={styles.box}>

          <Tabs defaultActiveKey="1" size="small" tabBarExtraContent={operations} onTabClick={this.changeTab.bind(this)}>
            <TabPane tab="线上VIP" key="1">
              <Checkbox.Group value={lineListTrue} onChange={this.onChangeLine.bind(this)}>
                <Row type="flex" style={{ minHeight: 400 }} >
                  {lineList.map((item) => {
                    return (
                      <Col key={item.nickName} span={8} className={`f ${styles.mItem}`} >
                        <Checkbox value={item.nickName} >
                          <div className={'f'} >
                            <img className="ml10" src={`${item.headPic}`} width="60" height="60" />
                            <span className={'ml20'}>{item.nickName}</span>
                          </div>
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </TabPane>
            <TabPane tab="线下VIP" key="2">
              <Checkbox.Group value={offLineListTrue} onChange={this.onChangeOffLine.bind(this)}>
                <Row type="flex" style={{ minHeight: 400 }}>
                  {offLineList.map((item) => {
                    return (
                      <Col key={item.id} span={8} className={`f ${styles.mItem}`}>
                        <Checkbox value={item.id} >
                          <div className={'f'}>
                            <span className="ml10">{item.realName}</span>
                            <span className="ml10">{item.phone}</span>
                          </div></Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group></TabPane>
          </Tabs>
          <div className="fend">
            <Pagination
              current={pageIndex}
              total={totalNum}
              onChange={this.onChangPage.bind(this)}
              pageSize={pageSize}
            />
          </div>

          <Row className="mt40 mb20" type="flex" align="middle" justify="center"> <Col> <Button size="large" onClick={onCancel} type="primary">取消</Button> <Button size="large" onClick={this.sendTrue.bind(this)} style={{ marginLeft: 40 }} type="primary">确认推送</Button> </Col> </Row>
        </div>
      </Modal>
    );
  }
}

MessageModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
};

MessageModal.defaultPropTypes = {
  visible: false,
};

// DownModal.contextTypes = {
//   router: PropTypes.object.isRequired,
// };


export default MessageModal;

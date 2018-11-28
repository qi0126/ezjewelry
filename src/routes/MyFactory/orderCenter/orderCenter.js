import React from 'react';
import { connect } from 'dva';
import { Select, Button, Slider, Tabs, DatePicker, Pagination, Spin } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import CustomSimpleTable from '../../../components/customTable/customSimpleTable';
import SingleTr from '../../../components/customTable/singleSimpleTr/singleSimpleTr';
import GroupTr from '../../../components/customTable/groupSimpleTr/groupSimpleTr';

import styles from './orderCenter.less';

// import './OrderCenter.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;


const timeOptions = [{
  val: '请选择',
  code: 1,
}, {
  val: '全部订单',
  code: 2,
}, {
  val: '今日',
  code: 3,
}, {
  val: '最近一个月订单',
  code: 4,
}, {
  val: '最近一年订单',
  code: 5,
}];

const statusOptions = [{
  val: '全部',
  code: '1',
}, {
  val: '待支付',
  code: 'UNPAID',
}, {
  val: '已支付',
  code: 'PAIDUP',
}, {
  val: '已完成',
  code: 'OVER',
}];


const timeItems = timeOptions.map(number =>
  <Option key={number.code}>{number.val}</Option>,
);

const statusItems = statusOptions.map(number =>
  <Option key={number.code}>{number.val}</Option>,
);


class OrderCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
      totalNum: 0, // 总条数
      timeData: null, // 时间控件动态值
      stateDate: [], // 状态
      selectValue: '1', // select选中的值
      orderData: [],
      blockName: '',
      pageIndex: 1,
      rows: 10,
      keyWord: '',
      startTime: '',
      endTime: '',
      orderStatu: '',
      proLoading: true, // 产品加载中属性
    };
  }

  componentDidMount() {

    this.receivedOrders();
    this.receivedOrderStatuList();
  }

  // 获取订单数据
  receivedOrders = () => {
    this.setState({
      proLoading: true,
    });
    const params = {
      blockName: this.state.blockName,
      pageIndex: this.state.pageIndex,
      rows: this.state.pageSize,
      keyWord: this.state.keyWord,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      orderStatu: this.state.orderStatu != 1 ? this.state.orderStatu : '',
    };

    app.$api.receivedOrders(params).then((res) => {

      res.data.data.forEach((item) => {
        item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      this.setState({
        orderData: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  // 获取状态
  receivedOrderStatuList = () => {
    app.$api.receivedOrderStatuList().then((res) => {
      res.data.unshift({
        name: '全部',
        statu: '1',
      });
      this.setState({
        stateDate: res.data,
      });

    });
  }

  // 跳转详情
  goDetailedPage = (item) => {
    // this.context.router.push('/MyFactory/OrderDetails');
    this.context.router.push({ pathname: '/MyFactory/OrderDetails', query: { orderId: item.orderNo } });
  }

  // 日期
  handleDate = (value) => {
    this.setState({
      timeData: value,
    });
    if (value.length == 2) {
      this.setState(() => ({
        startTime: app.$tool.day(value[0]._d).format('YYYY-MM-DD'),
        endTime: app.$tool.day(value[1]._d).format('YYYY-MM-DD'),
      }), () => {
        this.receivedOrders();
      });
    } else {
      this.setState(() => ({
        startTime: '',
        endTime: '',
      }), () => {
        this.receivedOrders();
      });
    }

  };

  // 选显卡
  tabsFun = (value) => {
    // console.log('选项卡');
    // console.log(value);
    this.setState(() => ({
      blockName: value,
      startTime: '',
      endTime: '',
      orderStatu: '',
      timeData: null,
      selectValue: '1',
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
    }), () => {
      this.receivedOrders();
      this.forceUpdate();
    });
  }

  // 搜索
  searchFun = () => {
    // console.log('搜索');
    // console.log(this.input.value);
    this.setState(() => ({
      keyWord: `${this.input.value}`,
    }), () => {
      this.receivedOrders();
    });

  }

  handleChange = (value) => {
    // console.log(`selected ${value}`);
    this.setState(() => ({
      selectValue: value,
      orderStatu: value,
    }), () => {
      this.receivedOrders();
    });
  };

  // 分页
  onChangPage = (pageIndex, pageSize) => {
    // console.log('分页');
    // console.log(pageIndex);
    // console.log(pageSize);
    this.setState(() => ({
      pageIndex,
    }), () => {
      this.receivedOrders();
    });
  };

  onShowSizeChange = (current, pageSize) => {
    // console.log('分页2');
    // console.log(current);
    // console.log(pageSize);
    this.setState(() => ({
      pageSize,
    }), () => {
      this.receivedOrders();
    });
  }


  render() {
    const { timeData, stateDate, pageIndex, pageSize, totalNum } = this.state;
    const sign = [];
    const pageShow = () => {
      if (this.state.orderData.length == 0) {
        return <div className={styles.noData}>暂无订单</div>;
      } else {
          // return (
          //   <CustomSimpleTable callback={this.goDetailedPage}>
          //     <SingleTr></SingleTr>
          //     <GroupTr></GroupTr>
          //     <SingleTr></SingleTr>
          //   </CustomSimpleTable>
          // )
        const table = this.state.orderData.map((item, index) => {
          return (
            <CustomSimpleTable orderData={item} key={index} callback={() => { this.goDetailedPage(item); }} confirmGoods={this.confirmGoods}>
              {
                    item.proList.map((li, num) => {
                      // console.log('单个');
                      const lis = () => {
                          // return li.groupId == undefined ? <SingleTr singleData={li} key={num}></SingleTr>:''
                        if (li.groupId == undefined || li.groupId == '') {

                          return <SingleTr singleData={li} key={num} />;

                        } else {
                          const groupTr = item.proList.map((liItem, order) => {
                                // console.log('开始组合');
                            if (liItem.groupId == li.groupId && liItem.proName != li.proName && sign.includes(li.groupId) == false) {
                                  // console.log('进入组合');
                              sign.push(li.groupId);
                              return <GroupTr groupOne={li} groupTwo={liItem} key={order} />;
                            } else if (liItem.groupId != li.groupId && sign.includes(li.groupId) == false) {
                                  // sign.push(li.groupId);
                                  // return  <SingleTr singleData={li} key={num}></SingleTr>
                            }
                          });

                          return groupTr;
                        }
                      };

                      return lis();


                    })


                  }
            </CustomSimpleTable>
          );
        });
        return table;
      }

    };
    return (
      <div id={styles.orderCenter} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>订单中心</div>
            <div className={styles.searchBox}>
              <input type="text" placeholder="商品名称/订单号/下单时间" className={styles.left} ref={input => this.input = input} />
              <div className={styles.btn} onClick={this.searchFun}>搜索</div>
            </div>
          </div>
          <Spin size="large" spinning={this.state.proLoading} >
            <Tabs defaultActiveKey="" onChange={this.tabsFun}>
              <TabPane tab="全部订单" key="">
                <div className={styles.tableWrap}>

                  {/* 订单 */}
                  <div className={styles.table}>
                    <div className={styles.tbTr}>
                      <div className={styles.tbTh} style={{ width: 296, paddingRight: 10, justifyContent: 'flex-start' }}>
                        <RangePicker onChange={this.handleDate} value={timeData} />
                      </div>
                      {/* <div className={styles.tbTh} style={{ flex: 1 }}>
                          零售价
                      </div> */}
                      <div className={styles.tbTh} style={{ flex: '0 1 70px' }}>
                          数量
                      </div>
                      <div className={styles.tbTh} style={{ flex: 2 }}>
                          款式类型
                      </div>
                      <div className={styles.tbTh} style={{ flex: 3 }}>
                          供应商批发价
                      </div>
                      <div className={styles.tbTh} style={{ flex: 2 }}>
                          规格
                      </div>
                      <div className={styles.tbTh} style={{ flex: 2, marginLeft: 10 }}>
                        <Select value={this.state.selectValue} style={{ width: 100 }} onChange={this.handleChange}>
                          {/* {statusItems} */}
                          {stateDate.map((item) => {
                            return (
                              <Option key={item.statu}>{item.name}</Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>

                    {this.state.blockName == '' ? pageShow() : ''}

                  </div>
                </div>
              </TabPane>
              <TabPane tab="品牌款" key="BLOCK-BRAND">
                <div className={styles.tableWrap}>
                  {/* 订单 */}
                  <div className={styles.table}>
                    <div className={styles.tbTr}>
                      <div className={styles.tbTh} style={{ width: 296, paddingRight: 10, justifyContent: 'flex-start' }}>
                        <RangePicker onChange={this.handleDate} value={timeData} />
                      </div>
                      {/* <div className={styles.tbTh} style={{ flex: 1 }}>
                        零售价
                    </div> */}
                      <div className={styles.tbTh} style={{ flex: '0 1 70px' }}>
                        数量
                    </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                        款式类型
                    </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                        供应商批发价
                    </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                        规格
                    </div>
                      <div className={styles.tbTh} style={{ flex: 1, marginLeft: 10 }}>
                        <Select value={this.state.selectValue} style={{ width: 100 }} onChange={this.handleChange}>
                          {stateDate.map((item) => {
                            return (
                              <Option key={item.statu}>{item.name}</Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>

                    {this.state.blockName == 'BLOCK-BRAND' ? pageShow() : ''}

                  </div>
                </div>
              </TabPane>
              <TabPane tab="钻石定制款" key="BLOCK-DIAMOND">
                <div className={styles.tableWrap}>

                  {/* 订单 */}
                  <div className={styles.table}>
                    <div className={styles.tbTr}>
                      <div className={styles.tbTh} style={{ width: 296, paddingRight: 10, justifyContent: 'flex-start' }}>
                        <RangePicker onChange={this.handleDate} value={timeData} />
                      </div>
                      {/* <div className={styles.tbTh} style={{ flex: 1 }}>
                          零售价
                      </div> */}
                      <div className={styles.tbTh} style={{ flex: '0 1 70px' }}>
                          数量
                      </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                          款式类型
                      </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                          供应商批发价
                      </div>
                      <div className={styles.tbTh} style={{ flex: 1 }}>
                          规格
                      </div>
                      <div className={styles.tbTh} style={{ flex: 1, marginLeft: 10 }}>
                        <Select value={this.state.selectValue} style={{ width: 100 }} onChange={this.handleChange}>
                          {/* {statusItems} */}
                          {stateDate.map((item) => {
                            return (
                              <Option key={item.statu}>{item.name}</Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>

                    {this.state.blockName == 'BLOCK-DIAMOND' ? pageShow() : ''}

                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Spin>
        </div>
        {/* 分页 */}
        <div style={{ float: 'right' }}>
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            current={pageIndex}
            total={totalNum}
            onChange={this.onChangPage}
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '30']}
              />
        </div>
      </div>
    );
  }
}

OrderCenter.propTypes = {

};

OrderCenter.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default OrderCenter;

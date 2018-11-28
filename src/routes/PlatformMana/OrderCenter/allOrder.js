import React from 'react';
import { connect } from 'dva';
import { Select, Button, Slider, Tabs, DatePicker, Pagination, Spin } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';

import CustomTable from '../../../components/customTable/customTable';
import SingleTr from '../../../components/customTable/singleTr/singleTr';
import GroupTr from '../../../components/customTable/groupTr/groupTr';

import styles from './allOrder.less';


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


class AllOrder extends React.Component {
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
    this.cusOrders();
    this.retailStatus();
  }

  // 获取订单数据
  cusOrders = () => {
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

    app.$api.cusOrders(params).then((res) => {
      res.data.data.forEach((item) => {
        item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      this.setState({
        orderData: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    }).catch((err) => {
      this.setState({
        orderData: [],
      });
    });
  }

  // 获取状态
  retailStatus = () => {
    app.$api.retailStatus().then((res) => {
      res.data.unshift({
        name: '全部',
        statu: '1',
      });
      this.setState({
        stateDate: res.data,
      });

    });
  }

  // 状态
  handleState = (value) => {
    this.setState(() => ({
      selectValue: value,
      orderStatu: value,
    }), () => {
      this.cusOrders();
    });
  };
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
        this.cusOrders();
      });
    } else {
      this.setState(() => ({
        startTime: '',
        endTime: '',
      }), () => {
        this.cusOrders();
      });
    }

  };

  // 搜索
  searchFun = () => {
    this.setState(() => ({
      keyWord: `${this.input.value}`,
    }), () => {
      this.cusOrders();
    });

  }

  // 进入订单详情
  goDetailedPage = (item) => {
    console.log(item.orderNo);
    // this.context.router.push('/myShop/OrderDetails');
    this.context.router.push({ pathname: '/platformMana/allOrderDetails', query: { orderId: item.orderNo } });
    // this.props.history.push("/platformMana/LogView");
  }

  // 确认发货
  confirmGoods = (value) => {
  }

  // 选显卡
  tabsFun = (value) => {
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
      this.cusOrders();
      this.forceUpdate();
    });
  }

  // 分页
  onChangPage = (pageIndex, pageSize) => {
    this.setState(() => ({
      pageIndex,
    }), () => {
      this.cusOrders();
    });
  };

  onShowSizeChange = (current, pageSize) => {
    console.log('分页2');
    console.log(current);
    console.log(pageSize);
    this.setState(() => ({
      pageSize,
    }), () => {
      this.cusOrders();
    });
  }

  render() {
    const { timeData, stateDate, pageIndex, pageSize, totalNum } = this.state;
    const sign = [];
    const noDataStyle = { display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#999',
      minHeight: '200px',
      fontSize: '16px',
      fontWeight: '500',

    };
    const pageShow = () => {
      if (this.state.orderData.length == 0) {
        return <div style={noDataStyle}>暂无订单</div>;
      } else {
        const table = this.state.orderData.map((item, index) => {
          return (
            <CustomTable orderData={item} key={index} callback={() => { this.goDetailedPage(item); }} confirmGoods={this.confirmGoods}>
              {
                    item.proList.map((li, num) => {
                      const lis = () => {
                            // return li.groupId == undefined ? <SingleTr singleData={li} key={num}></SingleTr>:''
                        if (li.groupId == undefined || li.groupId == '') {
                          console.log('开始组合');
                          return <SingleTr singleData={li} key={num} />;

                        } else {
                          const groupTr = item.proList.map((liItem, order) => {
                            console.log('开始组合0');
                            if (liItem.groupId == li.groupId && liItem.proName != li.proName && sign.includes(li.groupId) == false) {
                              console.log('进入组合1');
                              sign.push(li.groupId);
                              return <GroupTr groupOne={li} groupTwo={liItem} key={order} />;
                            } else if (liItem.groupId != li.groupId && sign.includes(li.groupId) == false) {
                              console.log('进入组合2');
                                    // sign.push(li.groupId);
                                    // return  <SingleTr singleData={li} key={num}></SingleTr>
                            }
                          });

                          return groupTr;
                        }
                      };

                      return (lis());
                    })


                  }
            </CustomTable>
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

          <Tabs defaultActiveKey="" onChange={this.tabsFun}>
            <TabPane tab="全部订单" key="">
              <div className={styles.tableWrap}>

                {/* 订单 */}
                <div className={styles.table}>
                  <div className={styles.tbTr}>
                    <div className={styles.tbTh} style={{ width: 324, paddingRight: 10, justifyContent: 'flex-start' }}>
                      {/* <Select defaultValue={timeOptions[0].val} style={{ width: 160 }} onChange={this.handleChange}>
                      {timeItems}
                    </Select> */}
                      <RangePicker onChange={this.handleDate} value={timeData} />
                    </div>
                    <div className={styles.tbTh} style={{ flex: 3 }}>
                      零售价
                  </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                      数量
                  </div>
                    <div className={styles.tbTh} style={{ flex: 3 }}>
                      款式类型
                  </div>
                    <div className={styles.tbTh} style={{ flex: 3 }}>
                      规格
                  </div>
                    <div className={styles.tbTh} style={{ flex: 3, justifyContent: 'flex-end' }}>
                    支付金额
                  </div>
                    <div className={styles.tbTh} style={{ flex: 3, marginLeft: 10, justifyContent: 'flex-end' }}>
                      <Select value={this.state.selectValue} style={{ width: 100 }} onChange={this.handleState}>
                        {/* {statusItems} */}
                        {stateDate.map((item) => {
                          return (
                            <Option key={item.statu}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <Spin size="large" spinning={this.state.proLoading} >
                    {this.state.blockName == '' ? pageShow() : ''}
                  </Spin>

                </div>
              </div>
            </TabPane>
            {/* <TabPane tab="品牌款" key="BLOCK-BRAND">
               {pageShow()}
            </TabPane> */}
            <TabPane tab="设计师款" key="BLOCK-DESIGNER">
              <div className={styles.tableWrap}>

                {/* 订单 */}
                <div className={styles.table}>
                  <div className={styles.tbTr}>
                    <div className={styles.tbTh} style={{ width: 296, paddingRight: 10, justifyContent: 'flex-start' }}>
                      {/* <Select defaultValue={timeOptions[0].val} style={{ width: 160 }} onChange={this.handleChange}>
                          {timeItems}
                        </Select> */}
                      <RangePicker onChange={this.handleDate} value={timeData} />
                    </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          零售价
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          数量
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          款式类型
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          规格
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                        支付金额
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1, marginLeft: 10 }}>
                      <Select defaultValue={statusOptions[0].val} style={{ width: 100 }} onChange={this.handleState}>
                        {/* {statusItems} */}
                        {stateDate.map((item) => {
                          return (
                            <Option key={item.statu}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <Spin size="large" spinning={this.state.proLoading} >
                    {this.state.blockName == 'BLOCK-DESIGNER' ? pageShow() : ''}
                  </Spin>

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
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          零售价
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          数量
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          款式类型
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                          规格
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1 }}>
                        支付金额
                      </div>
                    <div className={styles.tbTh} style={{ flex: 1, marginLeft: 10 }}>
                      <Select defaultValue={statusOptions[0].val} style={{ width: 100 }} onChange={this.handleState}>
                        {stateDate.map((item) => {
                          return (
                            <Option key={item.statu}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <Spin size="large" spinning={this.state.proLoading} >
                    {this.state.blockName == 'BLOCK-DIAMOND' ? pageShow() : ''}
                  </Spin>


                </div>
              </div>

            </TabPane>
          </Tabs>

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

AllOrder.propTypes = {

};

AllOrder.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default AllOrder;

import React,{Fragment}from 'react';
import { connect } from 'dva';
import { Select, Button,Slider,Tabs,DatePicker,Pagination,Spin} from 'antd';
import PropTypes from 'prop-types';
import app from 'app';

import CustomTable from '../../../components/customTable/customTable';
import SingleTr from '../../../components/customTable/singleTr/singleTr';
import GroupTr from '../../../components/customTable/groupTr/groupTr';

import styles from './ownOrder.less';


// import './OrderCenter.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;


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


class OwnOrder extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页展示条数
        totalNum: 0, // 总条数
        stateDate:[],//状态
        selectValue:'1',//select选中的值
        orderData:[],
        blockName: "",
        pageIndex: 1,
        rows: 10,
        keyWord: "",
        startTime: "",
        endTime: "",
        orderStatu: "",
        proLoading: true, // 筛选条件加载中属性
      };
    }

  componentDidMount() {
    this.receivedOrders();
    this.receivedOrderStatuList();
  }

  //获取订单数据
  receivedOrders = () => {
    this.setState({
      proLoading: true,
    });
    let params = {
      blockName: this.state.blockName,
      pageIndex: this.state.pageIndex,
      rows:this.state.pageSize,
      keyWord: this.state.keyWord,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      orderStatu: this.state.orderStatu !=1 ? this.state.orderStatu : ''
    }
    app.$api.receivedOrders(params).then(res => {
      res.data.data.forEach(item => {
        item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      });
      this.setState({
        orderData:res.data.data,
        totalNum:res.data.rowSize,
        proLoading:false,
      })
    })
  }

  // 获取状态
  receivedOrderStatuList = () => {
    app.$api.receivedOrderStatuList().then(res => {
      res.data.unshift({
        name:'全部',
        statu:'1'
      })
      this.setState({
        stateDate:res.data
      })
      
    })
  }


  //状态
  handleState = (value) => {

    this.setState(() =>({
      selectValue:value,
      orderStatu:value
    }),() => {
      this.receivedOrders();
    })
  };
  //日期
  handleDate = (value) => {
    if (value.length == 2) {
      this.setState(() =>({
        startTime:app.$tool.day(value[0]._d).format('YYYY-MM-DD'),
        endTime:app.$tool.day(value[1]._d).format('YYYY-MM-DD')
      }),() => {
        this.receivedOrders();
      })
    } else {
      this.setState(() =>({
        startTime:'',
        endTime:''
      }),() => {
        this.receivedOrders();
      })
    }

  };

  //搜索
  searchFun = () => {
    this.setState(() =>({
      keyWord:this.input.value + ''
    }), () => {
      this.receivedOrders();
    })

  }

  //进入订单详情
  goDetailedPage = (item) => {
    // this.context.router.push('/myShop/ownOrderDetails');
    this.context.router.push({ pathname: '/myShop/ownOrderDetails', query: { orderId: item.orderNo } });
  }

  //确认发货
  confirmGoods = (value) => {

  }

  //分页
  onChangPage = (pageIndex, pageSize) => {

    this.setState(() => ({
      pageIndex
    }),() => {
      this.receivedOrders();
    })
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState(() => ({
      pageSize
    }), () => {
      this.receivedOrders();
    })
  }

  render() {
    const {stateDate,pageIndex, pageSize, totalNum} = this.state;
    let sign = []
    const pageShow = () => {
        if (this.state.orderData.length == 0) {
           return <div className={styles.noData}>暂无订单</div>
        } else {
          // return (
          //   <CustomTable callback={this.goDetailedPage}>
          //     <SingleTr></SingleTr>
          //     <GroupTr></GroupTr>
          //     <SingleTr></SingleTr>
          //   </CustomTable>
          // )
          let table = this.state.orderData.map((item,index) => {
            return (
              <CustomTable orderData={item} key={index} callback={() => {this.goDetailedPage(item)}} confirmGoods={this.confirmGoods}>
                  {
                    item.proList.map((li, num) => {
                      console.log('单个');
                        let lis = () => {
                          // return li.groupId == undefined ? <SingleTr singleData={li} key={num}></SingleTr>:''
                          if (li.groupId == undefined || li.groupId == '') {
                            
                            return  <SingleTr singleData={li} key={num}></SingleTr>  
                            
                          } else {
                            let groupTr = item.proList.map((liItem, order) => {
                                console.log('开始组合');
                                if (liItem.groupId == li.groupId && liItem.proName != li.proName && sign.includes(li.groupId) == false) {
                                  console.log('进入组合1');
                                  sign.push(li.groupId);
                                  return <GroupTr groupOne={li} groupTwo={liItem} key={order}></GroupTr>
                                } else if (liItem.groupId != li.groupId && sign.includes(li.groupId) == false){
                                  console.log('进入组合2');
                                  // sign.push(li.groupId);
                                  // return  <SingleTr singleData={li} key={num}></SingleTr>  
                                }
                            })
                          
                             return groupTr
                          }
                        }
                        let groupLis = () => {
                          let groupTr = item.proList.map((liItem, order) => {
                            console.log('开始组合');
                              if (true) {
                                console.log('进入组合');
                                return <GroupTr groupOne={li} groupTwo={liItem} key={order}></GroupTr>
                              }
                          })
                        
                           return groupTr
                        }
                        let renderFun = () => {
        
                          return  lis()
                        }
                      return(
                        //  li.groupId == undefined ? <SingleTr singleData={li} key={num}></SingleTr>: 
                        // item.proList.map((liItem, order) => {
                        //   console.log('开始组合');
                        //     if (li.groupId == liItem.groupId && li.proName != liItem.proName) {
                        //       console.log('进入组合');
                        //       return <GroupTr groupOne={li} groupTwo={liItem} key={order}></GroupTr>
                        //     }
                        // })
                        renderFun()
                        
                      )
 
                    })
                   
                    
                  }
              </CustomTable>
            )
          })
          return table
        }
        
    }
    return (
      <div id={styles.orderCenter} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>订单中心</div>
            <div className={styles.searchBox}>
              <input type="text" placeholder="商品名称/订单号/下单时间" className={styles.left} ref={input => this.input = input}/>
              <div className={styles.btn} onClick={this.searchFun}>搜索</div>
            </div>
          </div>

          <div className={styles.tableWrap}>
  
            {/* 订单 */}
            <div className={styles.table}>
              <div className={styles.tbTr}>
                <div className={styles.tbTh} style={{ width: 324, paddingRight: 10, justifyContent: 'flex-start' }}>
                  {/* <Select defaultValue={timeOptions[0].val} style={{ width: 160 }} onChange={this.handleChange}>
                    {timeItems}
                  </Select> */}
                  <RangePicker onChange={this.handleDate}/>
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
                <div className={styles.tbTh} style={{ flex: 3,justifyContent:'flex-end'}}>
                   支付金额
                </div>
                <div className={styles.tbTh} style={{ flex: 3, marginLeft: 10 }}>
                  <Select value={this.state.selectValue} style={{ width: 100 }} onChange={this.handleState}>
                    {/* {statusItems} */}
                      {stateDate.map(item => {
                            return (
                              <Option key={item.statu}>{item.name}</Option>
                            )
                      })}
                  </Select>
                </div>
              </div>

              {/* 无数据 */}
              {/* <div className={styles.noData}>暂无订单</div> */}
              <Spin size="large" spinning={this.state.proLoading} >
                {pageShow()}
              </Spin>

              {/* <CustomTable callback={this.goDetailedPage}>
                <SingleTr></SingleTr>
                <SingleTr></SingleTr>
                <SingleTr></SingleTr>
              </CustomTable> */}

              {/* <CustomTable>
                <SingleTr></SingleTr>
                <SingleTr></SingleTr>
                <SingleTr></SingleTr>
                <GroupTr></GroupTr>
                <GroupTr></GroupTr>
                <SingleTr></SingleTr>
              </CustomTable> */}

             
  
            </div>
          </div>

        </div>
        
        {/* 分页 */}
        <div style={{float:'right'}}>
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
};

OwnOrder.propTypes = {

};

OwnOrder.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default OwnOrder;

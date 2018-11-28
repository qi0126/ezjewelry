import React from 'react';
import { connect } from 'dva';
import { Select, Button, Icon, Table, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import DetailsTableWrapOne from '../../../../components/customTable/detailsTableWrapOne/detailsTableWrapOne';
import DetailsTableWrapTwo from '../../../../components/customTable/detailsTableWrapTwo/detailsTableWrapTwo';
import SingleDetailTr from '../../../../components/customTable/singleDetailTr/singleDetailTr';
import GroupDetailTr from '../../../../components/customTable/groupDetailTr/groupDetailTr';

import styles from './OrderDetails.less';


const columns = [
  { title: '产品详情',  key: 'name',render:  (text, record) => <span style={{paddingLeft:30}}><img src={record.imgUrl} className={styles.imgSmall}/>{record.name}</span>},
  { title: '数量', dataIndex: 'num', key: 'num' },
  { title: '供应商批发价', dataIndex: 'priceOne', key: 'priceOne' },
  { title: '克重', dataIndex: 'weight', key: 'weight' },
  { title: '材质', dataIndex: 'mater', key: 'mater' },
  { title: '尺寸', dataIndex: 'size', key: 'size' },
]

const data = [
  { key: 1, name: '纯银镶晶钻简约掌心环',imgUrl:'../images/pro01.png', num: 'X1', priceOne: '￥3166.00~￥3566.00',weight:'0.35g~0.46g',mater:'PT950', size:'16',description: '商品编号：326435778' },
  { key: 2, name: '纯银镶晶钻简约掌心环',imgUrl:'../images/pro02.png', num: 'X2', priceOne: '￥3166.00~￥3566.00',weight:'0.35g~0.46g',mater:'PT950', size:'16',description: '商品编号：326435779' },
  { key: 3, name: '纯银镶晶钻简约掌心环',imgUrl:'../images/pro03.png', num: 'X3', priceOne: '￥3166.00~￥3566.00',weight:'0.35g~0.46g',mater:'PT950', size:'16',description: '商品编号：326435780' },
];
function handleChange(value) {
  console.log(`selected ${value}`);
}

const tableState = {

  expandRowByClick:false,
  pagination:false,
}

  class OrderDetails extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        btnShow:'',
        orderId:'',
        OrderDetailsData:''
      }
    }

  componentDidMount() {
      console.log('详情');
      console.log(this.props.location.query.orderId);
      this.state.orderId = this.props.location.query.orderId

      this.getOrderDetails();
      if (this.props.location.query.currentState == 'all') {
        this.setState({
          btnShow:'none'
        })
      }
  }

  //获取订单详情数据
  getOrderDetails = () => {
    let params = {
      orderNo:this.state.orderId
    }
    app.$api.receivedOrderDetail(params).then(res => {
      console.log('订单详细数据');
      console.log(res.data);
      this.setState({
        OrderDetailsData:res.data
      })
    })
  }

  //返回
  backFun = () => {
    console.log('返回');
    this.context.router.push('/platformMana/ownOrder');
  }

  render() {
    let self = this;
    let sign = []
    const pageShow = () => {
      if (this.state.OrderDetailsData.orderNo == undefined) {
         return <div className={styles.noData}>暂无订单信息</div>
      } else {
        let table = this.state.OrderDetailsData.proList.map((item,index) => {
            let lis = () => {
              if (item.groupId == undefined || item.groupId == '') {
                console.log('进入组合0');
                return <SingleDetailTr singleData={item} key={index}></SingleDetailTr>
              } else {
                let groupTr = self.state.OrderDetailsData.proList.map(li => {
                  if (item.groupId == li.groupId && item.proName != li.proName && sign.includes(li.groupId) == false) {
                    console.log('进入组合1');
                    sign.push(li.groupId);
                    return <GroupDetailTr groupOne={item} groupTwo={li} key={index}></GroupDetailTr>
                  } else if (item.groupId != li.groupId && sign.includes(li.groupId) == false){
                    console.log('进入组合2');
                    // sign.push(li.groupId);
                    // return  <SingleDetailTr singleData={li} key={index}></SingleDetailTr>
                  }
                })
                return groupTr;
              }
            }
            return lis();
        })
        return table
      }
    }
    return (
      <div className={styles.OrderDetailsWrap}>
        <div className={styles.OrderTitle}>
          <div className={styles.backWrap} onClick={this.backFun}>
            <span className={styles.backTilte}>＜</span> 返回
          </div>
          <div className={styles.numberWrap}>
              <div style={{flex:1}}>下单时间：{this.state.OrderDetailsData.createTime}</div>
              <div style={{flex:1}}>订单编号：{this.state.OrderDetailsData.orderNo}</div>
              <div style={{flex:2}}>{this.state.OrderDetailsData.currentHanleViewName} <Button style={{marginLeft:32,display:this.state.btnShow}} type="primary">确认发货</Button></div>
          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 表格 */}
        {/* <DetailsTableWrapOne></DetailsTableWrapOne> */}
        <DetailsTableWrapTwo OrderDetailsData={this.state.OrderDetailsData}>
            {/* <SingleDetailTr></SingleDetailTr>
            <SingleDetailTr></SingleDetailTr>
            <GroupDetailTr></GroupDetailTr>
            <GroupDetailTr></GroupDetailTr> */}
            {pageShow()}
        </DetailsTableWrapTwo>


        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 尾部信息 */}
        <div className={styles.footer}>
            <div className={styles.td}>
                <h3>订单备注信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>钻石是指经过琢磨的金刚石，金刚石是一种天然矿物，是钻石的原石。简单地讲，钻石是在地球深部高压、高温条件</div>
                  <span className={styles.line}></span>
                </div>
            </div>
            <div className={styles.td}>
                <h3>收货人信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>收货人：</span>
                      <span>Anna</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>手机号：</span>
                      <span>136565696666</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>地址：</span>
                      <span>深圳市盐田北山工业园</span>
                    </div>
                  </div>
                  <span className={styles.line}></span>
                </div>
            </div>
            <div className={styles.td}>
                <h3>付款信息</h3>
                <div className={`${styles.contentWrap} ${styles.noLeftBorder}`}>
                  <div className={styles.leftCont}>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>付款方式：</span>
                        <span>在线支付</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>付款时间：</span>
                        <span>2018-05-21 05:45:21</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>商品总额：</span>
                        <span>￥3166</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>应支付金额：</span>
                        <span>￥3166</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>运费金额：</span>
                        <span>￥0.00</span>
                      </div>
                  </div>
                  <span></span>
                </div>
            </div>




        </div>

      {/*  */}
      </div>
    );
  }
};

OrderDetails.propTypes = {

};

OrderDetails.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default OrderDetails;

import React from 'react';
import { connect } from 'dva';
import { Select, Button, Icon, Table, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import DetailsTableWrapOne from '../../../../components/customTable/detailsTableWrapOne/detailsTableWrapOne';
import DetailsTableWrapShopAll from '../../../../components/customTable/detailsTableWrapShopAll/detailsTableWrapShopAll';
import SingleDetailTrShopAll from '../../../../components/customTable/singleDetailTrShopAll/singleDetailTrShopAll';
import GroupDetailTrShopAll from '../../../../components/customTable/groupDetailTrShopAll/groupDetailTrShopAll';

import styles from './allOrderDetails.less';



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
      // if (this.props.location.query.currentState == 'all') {
      //   this.setState({
      //     btnShow:'none'
      //   })
      // }
  }

  //获取订单详情数据
  getOrderDetails = () => {
    let params = {
      orderNo:this.state.orderId
    }
    app.$api.retailOrderDetail(params).then(res => {
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
    this.context.router.push('/myShop/allOrder');
  }

  render() {
    const { OrderDetailsData } = this.state;
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
                return <SingleDetailTrShopAll singleData={item} key={index}></SingleDetailTrShopAll>
              } else {
                let groupTr = self.state.OrderDetailsData.proList.map(li => {
                  if (item.groupId == li.groupId && item.proName != li.proName && sign.includes(li.groupId) == false) {
                    console.log('进入组合1');
                    sign.push(li.groupId);
                    return <GroupDetailTrShopAll groupOne={item} groupTwo={li} key={index}></GroupDetailTrShopAll>
                  } else if (item.groupId != li.groupId && sign.includes(li.groupId) == false){
                    console.log('进入组合2');
                    // sign.push(li.groupId);
                    // return  <SingleDetailTrShopAll singleData={li} key={index}></SingleDetailTrShopAll>
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
    //支付方式
    const payment = () => {
      console.log('支付方式');
      if(OrderDetailsData.paidInfo){
        console.log(OrderDetailsData.paidInfo.payType);
        let paymentCN = '----';
        switch (OrderDetailsData.paidInfo.payType) {
          case 'WX':
            paymentCN = '微信';
            break;
          case 'ZFB':
            paymentCN = '支付宝';
            break;
          case 'CASH':
            paymentCN = '现金';
            break;
          case 'CREDIT':
            paymentCN = '信用卡';
            break;
          case 'DEBIT':
            paymentCN = '借记卡';
            break;
        }
        return paymentCN;

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
              <div style={{flex:2}}>{this.state.OrderDetailsData.currentHanleViewName}</div>
          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 表格 */}
        {/* <DetailsTableWrapOne></DetailsTableWrapOne> */}
        <DetailsTableWrapShopAll OrderDetailsData={this.state.OrderDetailsData}>
            {/* <SingleDetailTr></SingleDetailTr>
            <SingleDetailTr></SingleDetailTr>
            <GroupDetailTr></GroupDetailTr>
            <GroupDetailTr></GroupDetailTr> */}
            {pageShow()}
        </DetailsTableWrapShopAll>


        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 尾部信息 */}
        <div className={styles.footer}>
            <div className={styles.td}>
                <h3>订单备注信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>{OrderDetailsData.mark?OrderDetailsData.mark :'暂无订单备注信息'}</div>
                  <span className={styles.line}></span>
                </div>
            </div>
            <div className={styles.td}>
                <h3>收货人信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>收货人：</span>
                      <span>{OrderDetailsData.consignee?OrderDetailsData.consignee :'----'}</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>手机号：</span>
                      <span>{OrderDetailsData.concatInfo?OrderDetailsData.concatInfo :'----'}</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>地址：</span>
                      <span>{OrderDetailsData.address?OrderDetailsData.address :'----'}</span>
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
                        <span>{payment()? payment() :'----'}</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>付款时间：</span>
                        <span>{OrderDetailsData.paidInfo? OrderDetailsData.paidInfo.timeEnd : '----'}</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>商品总额：</span>
                        <span>{OrderDetailsData.orderPrice? `￥${OrderDetailsData.orderPrice }` : '----'}</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>应支付金额：</span>
                        <span>{OrderDetailsData.paidInfo? `￥${OrderDetailsData.paidInfo.totalFee}` : '----'}</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>运费金额：</span>
                        <span>{OrderDetailsData.freight? OrderDetailsData.freight : '----'}</span>
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

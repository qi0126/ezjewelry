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



  class OrderDetails extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        orderId:'',
        OrderDetailsData:''
      }
    }

  componentDidMount() {
      console.log('详情');
      console.log(this.props.location.query.orderId);
      this.state.orderId = this.props.location.query.orderId
      this.getOrderDetails();
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
    this.context.router.push('/myShop/ownOrder');
  }
  
  //确认发货
  confirmGoods = () => {
    console.log('确认发货');
    if (this.state.OrderDetailsData.operator == true) {
      let params = {
        orderNo:this.state.OrderDetailsData.orderNo,
        mark:'',
        handleCode:this.state.OrderDetailsData.nextHandleCode,
      };
      app.$api.operateGeneral(params).then(res => {
        console.log('操作成功');
        console.log(res);
        message.success('发货成功，请耐心等待！');
        this.getOrderDetails();
      })
    }
  }

  render() {
    const {OrderDetailsData} = this.state
    return (
      <div className={styles.OrderDetailsWrap}>
        <div className={styles.OrderTitle}>
          <div className={styles.backWrap} onClick={this.backFun}>
            <span className={styles.backTilte}>＜</span> 返回
          </div>
          <div className={styles.numberWrap}>
              <div style={{flex:1}}>下单时间：{OrderDetailsData.createTime}</div>
              <div style={{flex:1}}>订单编号：{OrderDetailsData.orderNo}</div>
              <div style={{flex:2}}>{this.state.OrderDetailsData.currentHanleViewName} 
                {OrderDetailsData.operator? <Button style={{marginLeft:32}} onClick={this.confirmGoods} type="primary">确认发货</Button> : ''}
              </div>
          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 表格 */}
        <DetailsTableWrapOne  OrderDetailsData={OrderDetailsData}></DetailsTableWrapOne>
        {/* <DetailsTableWrapTwo>
            <SingleDetailTr></SingleDetailTr>
            <SingleDetailTr></SingleDetailTr>
            <GroupDetailTr></GroupDetailTr>
            <GroupDetailTr></GroupDetailTr>
        </DetailsTableWrapTwo> */}


        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 尾部信息 */}
        <div className={styles.footer}>
            <div className={styles.td}>
                <h3>订单备注信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>{OrderDetailsData.mark? OrderDetailsData.mark:'暂无订单备注信息'}</div>
                  <span className={styles.line}></span>
                </div>
            </div>
            <div className={styles.td}>
                <h3>收货人信息</h3>
                <div className={styles.contentWrap}>
                  <div className={styles.leftCont}>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>收货人：</span>
                      <span>{OrderDetailsData.consignee? OrderDetailsData.consignee : '----'}</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>手机号：</span>
                      <span>{OrderDetailsData.concatInfo? OrderDetailsData.concatInfo :'----'}</span>
                    </div>
                    <div className={styles.cols}>
                      <span className={styles.colTilte}>地址：</span>
                      <span>{OrderDetailsData.address? OrderDetailsData.address :'----'}</span>
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
                        <span>----</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>付款时间：</span>
                        <span>----</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>商品总额：</span>
                        <span>----</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>应支付金额：</span>
                        <span>----</span>
                      </div>
                      <div className={styles.cols}>
                        <span className={styles.colTilte}>运费金额：</span>
                        <span>----</span>
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

import React from 'react';
import { connect } from 'dva';
import { Select, Button, Icon, Table, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import SingleSimpleDetailTr from '../../../../components/customTable/singleSimpleDetailTr/singleSimpleDetailTr';
import GroupSimpleDetailTr from '../../../../components/customTable/groupSimpleDetailTr/groupSimpleDetailTr';

import styles from './OrderDetails.less';



class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      OrderDetailsData: '',
    };
  }


  componentDidMount() {
    // console.log('详情');
    // console.log(this.props.location.query.orderId);
    this.state.orderId = this.props.location.query.orderId;

    this.getOrderDetails();
  }

  // 获取订单详情数据
  getOrderDetails = () => {
    const params = {
      orderNo: this.state.orderId,
    };
    app.$api.receivedOrderDetail(params).then((res) => {
      // console.log('订单详细数据');
      // console.log(res.data);
      this.setState({
        OrderDetailsData: res.data,
      });
    });
  }

  // 返回
  backFun = () => {
    // console.log('返回');
    this.context.router.push('/MyFactory/OrderCenter');
  }


  render() {
    const { OrderDetailsData } = this.state;
    const self = this;
    const sign = [];
    const pageShow = () => {
      if (OrderDetailsData.orderNo == undefined) {
        return <div className={styles.noData}>暂无订单信息</div>;
      } else {
        const table = OrderDetailsData.proList.map((item, index) => {
          const lis = () => {
            if (item.groupId == undefined || item.groupId == '') {
                // console.log('进入组合0');
              return <SingleSimpleDetailTr singleData={item} key={index} />;
            } else {
              const groupTr = OrderDetailsData.proList.map((li) => {
                  if (item.groupId == li.groupId && item.proName != li.proName && sign.includes(li.groupId) == false) {
                    // console.log('进入组合1');
                    sign.push(li.groupId);
                    return <GroupSimpleDetailTr groupOne={item} groupTwo={li} key={index} />;
                  } else if (item.groupId != li.groupId && sign.includes(li.groupId) == false) {
                    // console.log('进入组合2');
                    // sign.push(li.groupId);
                    // return  <SingleSimpleDetailTr singleData={li} key={index}></SingleSimpleDetailTr>
                  }
                });
              return groupTr;
            }
          };
          return lis();
        });
        return table;
      }
    };

    // 支付方式
    const payment = () => {
      console.log('支付方式');
      console.log(OrderDetailsData);
      if (OrderDetailsData.paidInfo) {
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
    };

    return (
      <div className={styles.OrderDetailsWrap}>
        <div className={styles.OrderTitle}>
          <div className={styles.backWrap} onClick={this.backFun}>
            <span className={styles.backTilte} >＜</span> 返回
          </div>
          <div className={styles.numberWrap}>
            <div style={{ flex: 1 }}>下单时间：{OrderDetailsData.createTime}</div>
            <div style={{ flex: 1 }}>订单编号：{OrderDetailsData.orderNo}</div>
            <div style={{ flex: 2 }}>{OrderDetailsData.currentHanleViewName}</div>
          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 表格 */}
        <div className={styles.tableWrap}>
          <div className={styles.thead}>
            <div className={styles.leftStatuWrap}>
              <div style={{ flex: 2 }}>商品</div>
              <div style={{ flex: 1 }}>商品编号</div>
              <div style={{ flex: '0 1 50px' }}>数量</div>
              <div style={{ flex: 1 }}>款式类型</div>
              {/* <div style={{flex:1}}>零售价</div> */}
              <div style={{ flex: 1 }}>供应商批发价</div>
              <div style={{ flex: 1 }}>规格</div>
            </div>
            <div style={{ flex: 1 }}>状态</div>
          </div>
          <div className={styles.tbody}>
            {/* 商家 */}
            <div className={styles.table}>
              {/* <SingleSimpleDetailTr></SingleSimpleDetailTr>
                  <GroupSimpleDetailTr></GroupSimpleDetailTr>
                  <GroupSimpleDetailTr></GroupSimpleDetailTr>
                  <SingleSimpleDetailTr></SingleSimpleDetailTr>
                  <SingleSimpleDetailTr></SingleSimpleDetailTr> */}
              <div style={{ flex: 8 }}>
                  {pageShow()}
                </div>
              <div className={styles.rightStatuWrap}>{OrderDetailsData.nextHandleOperateName}</div>
            </div>

            <div className={styles.payment}>
              <span>总付金额：￥{OrderDetailsData.orderPrice}</span>
            </div>

          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 尾部信息 */}
        <div className={styles.footer}>
          <div className={styles.td}>
            <h3>订单备注信息</h3>
            <div className={styles.contentWrap}>
              <div className={styles.leftCont}>{OrderDetailsData.mark ? OrderDetailsData.mark : '暂无订单备注信息'}</div>
              <span className={styles.line} />
            </div>
          </div>
          <div className={styles.td}>
            <h3>收货人信息</h3>
            <div className={styles.contentWrap}>
              <div className={styles.leftCont}>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>收货人：</span>
                      <span>{OrderDetailsData.consignee ? OrderDetailsData.consignee : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>手机号：</span>
                      <span>{OrderDetailsData.concatInfo ? OrderDetailsData.concatInfo : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>地址：</span>
                      <span>{OrderDetailsData.address ? OrderDetailsData.address : '----'}</span>
                    </div>
                </div>
              <span className={styles.line} />
            </div>
          </div>
          <div className={styles.td}>
            <h3>付款信息</h3>
            <div className={`${styles.contentWrap} ${styles.noLeftBorder}`}>
              <div className={styles.leftCont}>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>付款方式：</span>
                      <span>{payment() ? payment() : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>付款时间：</span>
                      <span>{OrderDetailsData.paidInfo ? OrderDetailsData.paidInfo.timeEnd : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>商品总额：</span>
                      <span>{OrderDetailsData.orderPrice ? `￥${OrderDetailsData.orderPrice}` : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>应支付金额：</span>
                      <span>{OrderDetailsData.paidInfo ? `￥${OrderDetailsData.paidInfo.totalFee}` : '----'}</span>
                    </div>
                  <div className={styles.cols}>
                      <span className={styles.colTilte}>运费金额：</span>
                      <span>{OrderDetailsData.freight ? OrderDetailsData.freight : '----'}</span>
                    </div>
                </div>
              <span />
            </div>
          </div>




        </div>

        {/*  */}
      </div>
    );
  }
}

OrderDetails.propTypes = {

};

OrderDetails.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default OrderDetails;

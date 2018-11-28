import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs  } from 'antd';
import styles from './customTable.less';

class customTable extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    componentDidMount() {
      console.log('Wrap组件');
    }

    //跳转详情
    goDetailPage = () => {
      this.props.callback();
    }

    //确认发货
    confirmGoods =(orderData,e) => {
      e.stopPropagation();
      this.props.confirmGoods(orderData);

    }


    render() {
      console.log('表格wrap');
      const {orderData} = this.props
       return (
        <div className={styles.tableInfo} onClick={this.goDetailPage}>
        <div className={styles.tr} style={{ padding: '0 8px 0 24px' }}>
          <div className={styles.th}>
            <span className={styles.textColor}>{orderData.createTime}</span>
            <span style={{ marginLeft: 30 }} className={styles.textColor}>订单号： {orderData.orderNo}</span>
            {/* <span style={{ marginLeft: 30 }} className={styles.textColor}>待发货</span> */}
          </div>
          <div className={styles.th} style={{color:'red'}}>
            {orderData.operator? <Button type="primary" onClick={(e) => {this.confirmGoods(orderData,e)}}>确认发货</Button> : ''}
            
          </div>
        </div>
        {/* 商家 */}
        <div className={`${styles.tr} ${styles.split}`}>
          {/* 参数列表 */}
          <div className={styles.td} style={{ flex: 8, alignItems: 'flex-start' }}>
          {/* 品牌款 */}
            {this.props.children}
            {/* <div className={styles.itemTable}>
                  <div className={styles.itemTr}>
                      <div className={styles.leftTd}>
                          <div className={styles.itemTd} style={{ flex: 3 }} >
                            <img className={styles.img} src="" alt="" />
                            <p>纯银镶晶钻简约掌心环1</p>
                          </div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                          <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>
                            品牌款
                          </div>
                          <div className={styles.itemTd} style={{ flex: '0 1 146px' }}>
                              <div style={{marginLeft: '-28px'}}>
                                  <p>克重：0.46g</p>
                                  <p>材质：PT950</p>
                                  <p>尺寸：16</p>
                              </div>
                          </div>
                      </div>
                      
                  </div>
            
                  <div className={styles.itemPayTr}>
                    <p>在线支付</p>
                    <p>¥ 8978.00</p>
                  </div>
            </div> */}

            {/* 品牌款 */}
            {/* <div className={styles.itemTable}>
                  <div className={styles.itemTr}>
                      <div className={styles.leftTd}>
                          <div className={styles.itemTd} style={{ flex: 3 }} >
                            <img className={styles.img} src="" alt="" />
                            <p>纯银镶晶钻简约掌心环1</p>
                          </div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                          <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>
                            品牌款
                          </div>
                          <div className={styles.itemTd} style={{ flex: '0 1 146px' }}>
                              <div style={{marginLeft: '-28px'}}>
                                  <p>克重：0.46g</p>
                                  <p>材质：PT950</p>
                                  <p>尺寸：16</p>
                              </div>
                          </div>
                      </div>
                      
                  </div>

                  <div className={styles.itemPayTr}>
                    <p>在线支付</p>
                    <p>¥ 8978.00</p>
                  </div>
            </div> */}
          </div>

          <div className={styles.td} style={{ flex: 1 }}>
            <p>在线支付</p>
            <p>￥{orderData.orderPrice}</p>
          </div>

          <div className={styles.td} style={{ flex: 1 }}>
            <p>{orderData.currentHanleViewName}</p>
            <p style={{color:'red'}}>订单详情/备注</p>
          </div>
        </div>
      </div>
       )
    }
}  

export default customTable;
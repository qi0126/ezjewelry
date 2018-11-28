import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Slider, Tabs } from 'antd';
import styles from './detailsTableWrapThree.less';

class detailsTableWrapThree extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
      };
    }

    componentWillReceiveProps(nextProps) {
        console.log('子组件');
        console.log(nextProps);
    }

  render() {
      const { OrderDetailsData } = this.props;
      console.log('订单详情2');
      console.log(OrderDetailsData);
      return (
         <div className={styles.tableWrap}>
          <div className={styles.thead}>
                  <div style={{ flex: 3 }}>商品</div>
                  <div style={{ flex: 1 }}>商品编号</div>
                  <div style={{ flex: '0 1 50px' }}>数量</div>
                  <div style={{ flex: 1 }}>款式类型</div>
                  <div style={{ flex: 1 }}>零售价</div>
                  {/* <div style={{ flex: 1 }}>平台批发价</div>
                  <div style={{ flex: 1 }}>供应商批发价</div> */}
                  <div style={{ flex: 1 }}>规格</div>
                </div>
          <div className={styles.tbody}>
                  {/* 商家 */}
                  <div className={styles.table}>
                  {this.props.children}
                  {/* <div className={styles.tr}>
                    <div className={styles.leftWrap} style={{flex:1}}>
                        <div style={{width: '100%'}}>
                            <div style={{display:'flex'}} className={styles.tdWrap}>
                                <div className={styles.td}  style={{flex:3}}>
                                    <img className={styles.img} src="" alt="" />
                                    <p>纯银镶晶钻简约掌心环</p>
                                </div>
                                <div className={styles.td}  style={{flex:1}}>77008093354</div>
                                <div className={styles.td}  style={{ flex: '0 1 50px' }}>X1</div>
                                <div className={styles.td}  style={{flex:1}}>品牌款</div>
                                <div className={styles.td}  style={{flex:1}}>￥3166</div>
                                <div className={styles.td}  style={{flex:1}}>￥3166</div>
                                <div className={styles.td}  style={{flex:1}}>￥3166~￥3166</div>
                                <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                    <p>克重：0.46g</p>
                                    <p>材质：PT950</p>
                                    <p>尺寸：16</p>
                                </div>
                            </div>

                        </div>

                    </div>
                  </div> */}

                </div>


                  <div className={styles.payment}>
                  {/* <span>总付金额：￥000</span> */}
                  <span>总付金额：￥{OrderDetailsData.orderPrice}</span>
                </div>

                </div>
        </div>
       );
    }
}

export default detailsTableWrapThree;

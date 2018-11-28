import React from 'react';
import { connect } from 'dva';
import { Select, Button, Icon, Table, Row, Col } from 'antd';
import PropTypes from 'prop-types';

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
    }

  render() {
    return (
      <div>
        <div className={styles.OrderDetails}>
          <div className={styles.StepDes}>
            <div className={styles.backStyle}>
                <Icon type="left" theme="outlined" />返回
            </div>
            <div className={styles.OrderNumber}>
                  <span className={styles.OrderTime}>下单时间 2018-06-19 18:36:10</span>    <span className={styles.orderNumber}>订单号： 77008093354</span>
            </div>
            
            <div className={styles.step}>
                <div className={styles.li}>
                    <span className={styles.circle}>
                        <Icon type="check" theme="outlined" style={{fontSize: '32px', color: 'white'}}/>
                    </span>
                    <span className={styles.stepDes}>提交订单</span>
                </div>
                <span className={styles.line}></span>
                <div className={styles.li}>
                    <span className={styles.circle}>
                        <Icon type="check" theme="outlined" style={{fontSize: '32px', color: 'white'}}/>
                    </span>
                    <span className={styles.stepDes}>提交订单</span>
                </div>
                <span className={styles.line}></span>
                <div className={styles.li}>
                    <span className={styles.hollow}>
                        <img src={'../images/Bitmap Copy 2@2x.png'}/>
                    </span>
                    <span className={styles.stepDes}>提交订单</span>
                </div>
            </div>
          </div>
        </div>

        <div style={{ height: '20px', background: '#f8f8f8' }} />
        {/* 表格 */}
        <div className={styles.tabOne}>
          <Table
            columns={columns}
            {...tableState}
            dataSource={data}
          />
          <div className={styles.orderFooter}>
            <Row className={styles.remarks}>
              <Col span={3} className={styles.txtGoldThree}>
                买家备注：
              </Col>
              <Col span={21} className={styles.right}>
                首饰富有现代风格并带着优雅的摩纳哥气息， 设计灵感源自摩纳哥以及南法惬意悠然的乐活态度，是个深受爱戴的时尚首饰品牌。 凭着她对珠宝创作的满腔热枕，使品牌于珠宝界获得青睐、深受爱戴。
              </Col>
            </Row>
          </div>
          <div className={styles.hr} />
         </div>

        <div style={{height:'150px',paddingTop:'11px'}}>
            <div className={styles.moneyWrap}>
                <div className={styles.money}>
                  <span className={styles.title}>产品总额：</span>
                  <span className={styles.number}>¥ 4688.00</span>
                </div>

                <div className={styles.money}>
                  <span className={styles.title}>运费：</span>
                  <span className={styles.number}>¥ 0.00</span>
                </div>

                <div className={styles.money}>
                  <span className={styles.title} style={{color:'#B79044'}}>总付金额：</span>
                  <span className={styles.number} style={{color:'#B79044'}}>¥ 4698.00</span>
                </div>
            </div>
         </div>
         <div style={{ height: '20px', background: '#f8f8f8' }} />

         <div className={styles.infoWrap}>
            <div className={styles.infoContent}>
                <div className={styles.peopleInfo}>
                    <div className={styles.infoTitle}>收货人信息</div>
                    <div>
                      <span className={styles.leftTitle}>收货人：</span>
                      <span>李晴雯</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>手机号码：</span>
                      <span>136****3261</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>地址：</span>
                      <span>广东深圳市南山区前海湾金典公寓</span>
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.payInfo}>
                    <div className={styles.infoTitle}>付款信息</div>
                    <div>
                      <span className={styles.leftTitle}>付款方式：</span>
                      <span>在线支付</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>付款时间：</span>
                      <span>2018-04-21 01:50:22</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>商品总额：</span>
                      <span>￥33.90</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>应支付金额：</span>
                      <span>￥33.90</span>
                    </div>
                    <div>
                      <span className={styles.leftTitle}>运费金额：</span>
                      <span>￥0.00</span>
                    </div>
                </div>
            </div>
            <div className={styles.hr} />

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

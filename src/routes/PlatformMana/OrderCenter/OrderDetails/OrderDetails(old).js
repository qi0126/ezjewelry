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
        <div className={styles.OrderTitle}>
          <div className={styles.backWrap}>
            <span className={styles.backTilte}>＜</span> 返回
          </div>
          <div className={styles.numberWrap}>
              <div style={{flex:1}}>下单时间：2018-06-19 18:36:10</div>
              <div style={{flex:1}}>订单编号：77008093354</div>
              <div style={{flex:2}}>待发货</div>
          </div>
        </div>
        <div style={{ height: '20px', background: '#f8f8f8' }} />

        {/* 表格 */}
        <div className={styles.tableWrap}>
            <div className={styles.thead}>
                <div style={{flex:3}}>商品</div>
                <div style={{flex:1}}>商品编号</div>
                <div  style={{ flex: '0 1 50px' }}>数量</div>
                <div style={{flex:1}}>款式类型</div>
                <div style={{flex:1}}>零售价</div>
                <div style={{flex:1}}>平台批发价</div>
                <div style={{flex:1}}>规格</div>
                <div style={{flex:1}}>状态</div>
            </div>
            <div className={styles.tbody}>
              {/* 商家 */}
              <div className={styles.table}>
                  <div className={styles.tr}>
                    <div className={styles.leftWrap} style={{flex:8}}>
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
                                <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                    <p>克重：0.46g</p>
                                    <p>材质：PT950</p>
                                    <p>尺寸：16</p>
                                </div>
                            </div>
                            
                        </div>
                
                    </div>
                    <div className={styles.rightWrap} style={{flex:1}}>
                        <p>商家待发货</p>
                        <Button type="primary">确认发货</Button>
                    </div>
                  </div>
              </div>

              {/* 平台 */}
              <div className={styles.table}>
                  <div className={styles.tr}>
                    <div className={styles.leftWrap} style={{flex:8}}>
                        <div style={{width: '100%'}}>
                        {/* 品牌 */}
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
                                <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                    <p>克重：0.46g</p>
                                    <p>材质：PT950</p>
                                    <p>尺寸：16</p>
                                </div>
                            </div>
                            {/* 设计师 */}
                            <div style={{display:'flex'}} className={styles.tdWrap}>
                                <div className={styles.td}  style={{flex:3}}>
                                    <img className={styles.img} src="" alt="" />
                                    <p>纯银镶晶钻简约掌心环</p>
                                </div>
                                <div className={styles.td}  style={{flex:1}}>77008093354</div>
                                <div className={styles.td}  style={{ flex: '0 1 50px' }}>X1</div>
                                <div className={styles.td}  style={{flex:1}}>设计师款</div>
                                <div className={styles.td}  style={{flex:1}}>￥3166</div>
                                <div className={styles.td}  style={{flex:1}}>￥3166</div>
                                <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                    <p>克重：0.46g</p>
                                    <p>材质：PT950</p>
                                    <p>尺寸：16</p>
                                </div>
                            </div>
                            {/* 定制 */}
                            <div style={{display:'flex'}} className={styles.tdWrap}>
                                <div className={styles.td}  style={{flex:3}}>
                                      <img className={styles.img} src="" alt="" />
                                      <div>
                                          <p className={`${styles.td} ${styles.noBorderRigth}`}>纯银镶晶钻简约掌心环</p>
                                          <p className={`${styles.td} ${styles.noBorderRigth}`}>纯银镶晶钻简约掌心环</p>
                                      </div>
                              
                                </div>
                                <div className={styles.td}  style={{flex:1}}>77008093354</div>
                                <div className={styles.td}  style={{ flex: '0 1 50px' }}>X1</div>
                                <div className={styles.td}  style={{flex:1}}>品牌款</div>
                                <div className={styles.td}  style={{flex:1}}>
                                  <div>
                                      <p className={`${styles.td} ${styles.noBorderRigth}`}>￥3166</p>
                                      <p className={`${styles.td} ${styles.noBorderRigth}`}>￥3166</p>
                                  </div>
                                </div>
                                <div className={styles.td}  style={{flex:1}}>
                                    <div>
                                          <p className={`${styles.td} ${styles.noBorderRigth}`}>￥3166</p>
                                          <p className={`${styles.td} ${styles.noBorderRigth}`}>￥3166</p>
                                      </div>
                                </div>
                                <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                  <div>
                                      <div className={`${styles.td} ${styles.tdSize} ${styles.noBorderRigth}`}>
                                          <p>克重：0.46g</p>
                                          <p>材质：PT950</p>
                                          <p>尺寸：16</p>
                                      </div>  
                                      <div className={`${styles.td} ${styles.tdSize} ${styles.noBorderRigth}`}>
                                          <p>克重：0.46g</p>
                                          <p>材质：PT950</p>
                                          <p>尺寸：16</p>
                                      </div>  

                                  </div>
                                 
                                </div>
                            </div>
                            {/* 定制备注 */}
                            <div style={{display:'flex'}} className={styles.tdWrap}>
                                <div className={styles.note}>
                                  <div style={{marginBottom:14,marginTop:14}}> 
                                    <span className={styles.leftTitle}>字印：</span>
                                    <span className={styles.wordDes}>LOVE</span>
                                  </div>
                                  <div> 
                                    <span className={styles.leftTitle}>戒托备注：</span>
                                    <span className={styles.wordDes}>非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好</span>
                                  </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightWrap} style={{flex:1}}>
                        <p>平台发货</p>
                        {/* <Button type="primary">确认发货</Button> */}
                    </div>
                  </div>
              </div>
              
              <div className={styles.payment}>
                  <span>总付金额：￥46532</span>
              </div>

            </div>
        </div>
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

import React from 'react';
import { connect } from 'dva';
import { Select, Button,Slider,Tabs  } from 'antd';
import PropTypes from 'prop-types';

import styles from './OrderCenter.less';

// import './OrderCenter.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;



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
  val: '请选择',
  code: 1,
}, {
  val: '未付款',
  code: 2,
}, {
  val: '未发货',
  code: 333,
}, {
  val: '已发货',
  code: 4,
}, {
  val: '已完成',
  code: 5,
}];



const timeItems = timeOptions.map(number =>
  <Option key={number.code}>{number.val}</Option>,
);

const statusItems = statusOptions.map(number =>
  <Option key={number.code}>{number.val}</Option>,
);

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

// class UploadPro extends React.Component {
  class OrderCenter extends React.Component {
    // constructor
    constructor(props){
      super(props);
    }


  goDetailedPage() {
    console.log(this);
    this.context.router.push('/myShop/OrderDetails');
    // this.props.history.push("/platformMana/LogView");
  }

  render() {
    return (
      <div id={styles.orderCenter} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>订单中心（new）</div>
            <div className={styles.searchBox}>
              <input type="text" placeholder="商品名称/订单号/下单时间" className={styles.left} />
              <div className={styles.btn}>搜索</div>
            </div>
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="全部订单" key="1">
          <div className={styles.tableWrap}>
  
            {/* 订单 */}
            <div className={styles.table}>
              <div className={styles.tbTr}>
                <div className={styles.tbTh} style={{ width: 296, paddingRight: 10, justifyContent: 'flex-start' }}>
                  <Select defaultValue={timeOptions[0].val} style={{ width: 160 }} onChange={handleChange}>
                    {timeItems}
                  </Select>
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
                  <Select defaultValue={statusOptions[0].val} style={{ width: 100 }} onChange={handleChange}>
                    {statusItems}
                  </Select>
                </div>
              </div>
  
              <div className={styles.tableInfo}>
                <div className={styles.tr} style={{ padding: '0 8px 0 24px' }}>
                  <div className={styles.th}>
                    <span className={styles.textColor}>2018-06-19 18:36:10</span>
                    <span style={{ marginLeft: 30 }} className={styles.textColor}>订单号： 77008093354</span>
                    <span style={{ marginLeft: 30 }} className={styles.textColor}>待发货</span>
                  </div>
                  <div className={styles.th} style={{color:'red'}}>
                    订单详情/备注
                  </div>
                </div>
                {/* 商家 */}
                <div className={`${styles.tr} ${styles.split}`} onClick={this.goDetailedPage.bind(this)}>
                  {/* 参数列表 */}
                  <div className={styles.td} style={{ flex: 8, alignItems: 'flex-start' }}>
                  {/* 品牌款 */}
                    <div className={styles.itemTable}>
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
                    </div>
                    {/* 品牌款 */}
                    <div className={styles.itemTable}>
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
                    </div>
                  </div>
  
                  <div className={styles.td} style={{ flex: 1 }}>
                    <p>商家待发货</p>
                    <Button type="primary">确认发货</Button>
                  </div>
                </div>

                {/* 平台 */}
                <div className={`${styles.tr} ${styles.split}`} onClick={this.goDetailedPage.bind(this)}>
                  {/* 参数列表 */}
                  <div className={styles.td} style={{ flex: 8, alignItems: 'flex-start' }}>
                  {/* 品牌款 */}
                    <div className={styles.itemTable}>
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
                    </div>
                    {/* 设计师款 */}
                    <div className={styles.itemTable}>
                          <div className={styles.itemTr}>
                              <div className={styles.leftTd}>
                                  <div className={styles.itemTd} style={{ flex: 3 }} >
                                    <img className={styles.img} src="" alt="" />
                                    <p>纯银镶晶钻简约掌心环1</p>
                                  </div>
                                  <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                                  <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                                  <div className={styles.itemTd} style={{ flex: 1 }}>
                                    设计师款
                                  </div>
                                  <div className={styles.itemTd} style={{ flex: '0 1 146px' }}>
                                      <div style={{marginLeft: '-28px'}}>
                                          <p>克重：0.46g</p>
                                          <p>材质：PT950</p>
                                          <p>尺寸：16</p>
                                      </div>
                                  </div>
                              </div>
                              <div className={styles.leftTd}>
                                  <div className={styles.itemTd} style={{ flex: 3 }} >
                                    <img className={styles.img} src="" alt="" />
                                    <p>纯银镶晶钻简约掌心环1</p>
                                  </div>
                                  <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                                  <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                                  <div className={styles.itemTd} style={{ flex: 1 }}>
                                  设计师款
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
                    </div>
                    {/* 定制款 */}
                    <div className={styles.itemTable}>
                        <div className={styles.modeWrap}>
                            <div style={{ flex: 1}}>
                                <div style={{display:'flex'}}>
                                      <div className={styles.imgTd}>
                                            <img className={styles.img} src="" alt="" />
                                      </div>

                                      <div className={styles.secondWrap} style={{ flex: 1 }}>
                                          <div style={{display:'flex'}}>
                                              <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 2 }}>纯银镶晶钻简约掌心环1</div>
                                              <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                                          </div>

                                          <div style={{display:'flex'}}>
                                              <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 2 }}>纯银镶晶钻简约掌心环1</div>
                                              <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                                          </div>
                                      </div>

                                      <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                                      <div className={styles.itemTd} style={{ flex: '0 1 107px' }}> 钻石定制款</div>

                                      <div className={styles.thirdWrap} style={{ flex: '0 1 146px'}}>
                                          <div className={styles.itemTd}>
                                                    <div>
                                                        <p>克重：0.46g</p>
                                                        <p>材质：PT950</p>
                                                        <p>尺寸：16</p>
                                                    </div>
                                            </div>
                                            <div className={styles.itemTd}>
                                                    <div>
                                                        <p>克重：0.46g</p>
                                                        <p>材质：PT950</p>
                                                        <p>尺寸：16</p>
                                                    </div>
                                            </div>

                                            
                                      </div>
                                </div>
                                {/* 定制2 */}
                                <div className={styles.itemTr}>
                                    <div className={styles.leftTd}>
                                        <div className={styles.itemTd} style={{ flex: 3 }} >
                                          <img className={styles.img} src="" alt="" />
                                          <p>纯银镶晶钻简约掌心环1</p>
                                        </div>
                                        <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div>
                                        <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X1</div>
                                        <div className={styles.itemTd} style={{ flex: 1 }}>
                                        钻石定制款
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
                             </div>

                            <div className={styles.itemPayTr}>
                              <p>在线支付</p>
                              <p>¥ 8978.00</p>
                            </div>
                        </div>

                    </div>
                    
                  </div>
  
                  {/* <div className={styles.td} style={{ flex: 1 }}>
                    <p>在线支付</p>
                    <p>¥ 8978.00</p>
                  </div> */}
                  <div className={styles.td} style={{ flex: 1 }}>
                    <p>平台发货</p>
                    <Button type="primary">确认发货</Button>
                  </div>
                </div>
              </div>
  
            </div>
          </div>
          </TabPane>
          <TabPane tab="品牌款" key="2">品牌款</TabPane>
          <TabPane tab="设计师款" key="3">设计师款</TabPane>
          <TabPane tab="钻石定制款" key="4">钻石定制款</TabPane>
          </Tabs>
        </div>

      </div>
    );
  }
};

OrderCenter.propTypes = {

};

OrderCenter.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default OrderCenter;

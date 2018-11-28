import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs  } from 'antd';
import app from 'app';
import styles from './detailsTableWrapOne.less';

class DetailsTableWrapOne extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
        const { OrderDetailsData } = this.props;
        console.log('参数');
        console.log(OrderDetailsData);
        const spec = (specInfo) => {
            const lis = JSON.parse(specInfo).map((item, index) => {
              return (
                  <div style={{marginLeft:10}} key={index}>{item.specView}：{item.specValue}</div>
                );
            });
            return lis;
          };
          const styleData = (proType) => {
            let res = '';
            switch (proType) {
                case 'BRAND-PRO':
                  res = '品牌款';
                  break;
                case 'DIAMOND':
                  res = '裸石';
                  break;
                case 'DIAMOND-CUS-PRO':
                  res = '戒托';
                  break;
                case 'DESIGNER-PRO':
                  res = '设计师款';
                  break;
              }
            return res;
          };
        const tr = () => {
            return (
                <div className={styles.tr}>
                <div className={styles.leftWrap} style={{flex:8}}>
                    {OrderDetailsData.proList != undefined? OrderDetailsData.proList.map((singleData,index) => {
                        return(
                            <div style={{width: '100%'}} key={index}>
                                <div style={{display:'flex'}} className={styles.tdWrap}>
                                    <div className={styles.td}  style={{flex:3,justifyContent:'flex-start',paddingLeft:24}}>
                                    {singleData.proType == 'DIAMOND' ? <img className={styles.img}  src="./images/Diamonds.png" alt="" /> 
                                        : 
                                        <img className={styles.img} src={app.$http.imgURL + singleData.picUrl} alt="" />
                                    }
                                        {/* <img className={styles.img} src="" alt="" /> */}
                                        <p>{singleData.proName}</p>
                                    </div>
                                    <div className={styles.td}  style={{flex:1}}><div style={{width:'140px',overflowWrap:'break-word'}}>{singleData.proId}</div></div>
                                    <div className={styles.td}  style={{ flex: '0 1 50px' }}>X{singleData.proNum}</div>
                                    <div className={styles.td}  style={{flex:1}}>
                                        {/* {styleData(singleData.proType)} */}
                                        <div className={styles.designWrap}>
                                            <p>{singleData.proTypeName}</p>
                                            <p className={styles.designCont}>{singleData.proTypeAd? `（${singleData.proTypeAd}）`: ''}</p>
                                        </div>
                                    </div>
                                    <div className={styles.td}  style={{flex:1}}>￥{singleData.salePrice}</div>
                                    {/* <div className={styles.td}  style={{flex:1}}>￥3166</div> */}
                                    <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                                        {/* <p>克重：0.46g</p>
                                        <p>材质：PT950</p>
                                        <p>尺寸：16</p> */}
                                        {spec(singleData.specInfo)}
                                    </div>
                                </div>
                                
                            </div>
                        )
                    }) : ''}
   
                </div>
                <div className={styles.rightWrap} style={{flex:1}}>
                    <p>{OrderDetailsData.currentHanleViewName}</p>
                </div>
              </div>
            )
        }
       return (
        <div className={styles.tableWrap}>
                <div className={styles.thead}>
                    <div style={{flex:3}}>商品</div>
                    <div style={{flex:1}}>商品编号</div>
                    <div  style={{ flex: '0 1 50px' }}>数量</div>
                    <div style={{flex:1}}>款式类型</div>
                    <div style={{flex:1}}>零售价</div>
                    {/* <div style={{flex:1}}>平台批发价</div> */}
                    <div style={{flex:1}}>规格</div>
                    <div style={{flex:1}}>状态</div>
                </div>
                <div className={styles.tbody}>
                {/* 商家 */}
                <div className={styles.table}>
                    {tr()}
                    {/* {tr()} */}
                  {/* <div className={styles.tr}>
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
                        <p>待发货</p>
                    </div>
                  </div> */}
                  
              </div>


                <div className={styles.payment}>
                    <span>总付金额：￥{OrderDetailsData.orderPrice}</span>
                </div>

                </div>
            </div>
       )
    }
}  

export default DetailsTableWrapOne;
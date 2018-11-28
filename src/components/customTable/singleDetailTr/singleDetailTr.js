import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs  } from 'antd';
import app from 'app';
import styles from './singleDetailTr.less';

class SingleDetailTr extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
        const { singleData } = this.props;
        console.log('单个tr');
        console.log(singleData);
        const spec = () => {
            const lis = JSON.parse(singleData.specInfo).map((item, index) => {
            return (
                <p key={index}>{item.specView}：{item.specValue}</p>
                );
            });
            return lis;
        };
      const styleData = () => {
        let res = '';
        switch (singleData.proType) {
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

      const wholeSalePrice = () => {
          let res = '----'
          if (singleData.wholeSalePrice != undefined && singleData.wholeSalePrice != '') {
            res = `￥${singleData.wholeSalePrice}`;
          }
          return res;
      }

      const factoryPrice = () => {
          let res = '----'
          if (singleData.factoryPrice != undefined && singleData.factoryPrice != '') {
              res = singleData.factoryPrice;
          }
          return res;
      }
       return (
        <div className={styles.tr}>
            <div className={styles.leftWrap} style={{flex:1}}>
                <div style={{width: '100%'}}>
                    <div style={{display:'flex'}} className={styles.tdWrap}>
                        <div className={styles.td}  style={{flex:3,justifyContent:'flex-start',paddingLeft:24}}>
                            {singleData.proType == 'DIAMOND' ? <img className={styles.img}  src="./images/Diamonds.png" alt="" /> 
                                    : 
                                    <img className={styles.img}  src={app.$http.imgURL + singleData.picUrl} alt="" />
                            }
                            
                            <p>{singleData.proName}</p>
                        </div>
                        <div className={styles.td}  style={{flex:'1'}}><div style={{width:100,overflowWrap: 'break-word'}}>{singleData.proId}</div></div>
                        {/* <div className={styles.td} style={{flex:'1'}}>
                            <div style={{}}>121323sdfsdfsdfsdfsdfsdsdfsdf</div>
                        </div> */}
                        <div className={styles.td}  style={{ flex: '0 1 50px' }}>X{singleData.proNum}</div>
                        <div className={styles.td}  style={{flex:1}}>
                        {/* {styleData()} */}
                            <div className={styles.designWrap}>
                                <p>{singleData.proTypeName}</p>
                                <p className={styles.designCont}>{singleData.proTypeAd? `（${singleData.proTypeAd}）`: ''}</p>
                            </div>
                        </div>
                        <div className={styles.td}  style={{flex:1}}>￥{singleData.salePrice}</div>
                        <div className={styles.td}  style={{flex:1}}>{wholeSalePrice()}</div>
                        <div className={styles.td}  style={{flex:1}}>{factoryPrice()}</div>
                        <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                            {/* <p>克重：0.46g</p>
                            <p>材质：PT950</p>
                            <p>尺寸：16</p> */}
                            {spec()}
                        </div>
                    </div>
                    
                </div>
        
            </div>
        </div>
       )
    }
}  

export default SingleDetailTr;
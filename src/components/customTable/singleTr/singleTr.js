import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Slider, Tabs  } from 'antd';
import app from 'app';
import styles from './singleTr.less';

class SingleTr extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
      };
    }

  render() {
      const { singleData } = this.props;
      // console.log('单个tr');
      // console.log(singleData);
      const spec = () => {
        const lis = JSON.parse(singleData.specInfo).map((item, index) => {
          return (
              <div key={index}>{item.specView}：{item.specValue}</div>
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
      return (
         <div className={styles.itemTable}>
              <div className={styles.itemTr}>
                    <div className={styles.leftTd}>
                        <div className={styles.itemTd} style={{ flex: 3 }} >
                            {singleData.proType == 'DIAMOND' ? <img className={styles.img}  src="./images/Diamonds.png" alt="" /> 
                                : 
                              <img className={styles.img} src={app.$http.imgURL + singleData.picUrl} alt="" />
                            }
                            
                            <p>{singleData.proName}</p>
                          </div>
                        <div className={styles.itemTd} style={{ flex: 1 }}>￥ {singleData.salePrice}</div>
                        <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X{singleData.proNum}</div>
                        <div className={styles.itemTd} style={{ flex: 1}}>
                            {/* {styleData()} */}
                            <div className={styles.designWrap}>
                                <p>{singleData.proTypeName}</p>
                                <p className={styles.designCont}>{singleData.proTypeAd? `（${singleData.proTypeAd}）`: ''}</p>
                            </div>
            
                          </div>
                        <div className={styles.itemTd} style={{ flex: '0 1 146px',justifyContent:'flex-start',paddingLeft:20}}>
                            <div style={{ padding: '0px' }}>
                                {/* <p>克重：0.46g</p>
                                  <p>材质：PT950</p>
                                  <p>尺寸：16</p> */}
                                {spec()}
                              </div>
                          </div>
                      </div>

                </div>

              {/* <div className={styles.itemPayTr}>
                    <p>在线支付</p>
                    <p>¥ {singleData.subTotal}</p>
              </div> */}
            </div>
       );
    }
}

export default SingleTr;

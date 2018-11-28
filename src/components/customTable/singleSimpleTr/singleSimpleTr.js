import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs,} from 'antd';
import app from 'app';
import styles from './singleSimpleTr.less';

class SingleSimpleTr extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
        const {singleData} = this.props
        console.log('我是tr');
        console.log(singleData);
        const spec =  () => {
          let lis = JSON.parse(singleData.specInfo).map((item,index) => {
              return(
                  <p key={index}>{item.specView}：{item.specValue}</p>
              )
          })
          return lis
        }
        const styleData = () => {
            let res = '';
            switch (singleData.proType) {
              case 'BRAND-PRO':
                  res = "品牌款";
                  break;
              case 'DIAMOND':
                  res = "裸石";
                  break;
              case 'DIAMOND-CUS-PRO':
                  res = "戒托";
                  break;
              case 'DIAMOND-CUS-PRO':
                  res = "设计师款";
                  break;
          }
          return res;
        }
       return (

            <div className={styles.itemTable}>
                  <div className={styles.itemTr}>
                      <div className={styles.leftTd}>
                          <div className={styles.itemTd} style={{ flex: 2 }} >
                          {singleData.proType == 'DIAMOND' ? <img className={styles.img}  src="./images/Diamonds.png" alt="" /> 
                                : 
                                <img className={styles.img} src={app.$http.imgURL + singleData.picUrl} alt="" />
                            }
                            
                            <p>{singleData.proName}</p>
                          </div>
                          {/* <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div> */}
                          <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X{singleData.proNum}</div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>
                            {/* {styleData()} */}
                            <div className={styles.designWrap}>
                                <p>{singleData.proTypeName}</p>
                                <p className={styles.designCont}>{singleData.proTypeAd? `（${singleData.proTypeAd}）`: ''}</p>
                            </div>
                          </div>
                          <div className={styles.itemTd} style={{ flex: 1 }}>
                            ￥ {singleData.salePrice}
                          </div>
                          <div className={styles.itemTd} style={{ flex: '0 1 146px',justifyContent:'flex-start', paddingLeft:20}}>
                              <div>
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

export default SingleSimpleTr;
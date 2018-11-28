import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs  } from 'antd';
import app from 'app';
import styles from './groupDetailTrShopAll.less';

class GroupDetailTr extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
        const {groupOne,groupTwo} = this.props
        console.log('组合tr');
        console.log(groupOne);
        console.log(groupTwo);
        const specOne = () => {
            const lis = JSON.parse(groupOne.specInfo).map((item, index) => {
              return (
                  <p key={index}>{item.specView}：{item.specValue}</p>
                );
            });
            return lis;
        };

        const specTwo = () => {
            const lis = JSON.parse(groupTwo.specInfo).map((item, index) => {
              return (
                  <p key={index}>{item.specView}：{item.specValue}</p>
                );
            });
            return lis;
        };

        //平台批发价
        const wholeSalePriceOne = () => {
            let res = '----';
            if (groupOne.wholeSalePrice != undefined && groupOne.wholeSalePrice != '') {
                res = `￥${groupOne.wholeSalePrice}`
            }
            return res;
        };
        const wholeSalePriceTwo = () => {
            let res = '----';
            if (groupTwo.wholeSalePrice != undefined && groupTwo.wholeSalePrice != '') {
                res = `￥${groupTwo.wholeSalePrice}`
            }
            return res;
        }
        //供应商批发价
        const factoryPriceOne = () => {
            let res ='----';
            if (groupOne.factoryPrice != undefined && groupOne.factoryPrice != '') {
                res = groupOne.factoryPrice;
            }
            return res;
        }

        const factoryPriceTwo = () => {
            let res ='----';
            if (groupTwo.factoryPrice != undefined && groupTwo.factoryPrice != '') {
                res = groupTwo.factoryPrice;
            }
            return res;
        }

        const picUrl = () => {
            if (groupOne.proType != 'DIAMOND') {
                return <img className={styles.img} src={app.$http.imgURL + groupOne.picUrl} alt="" /> 
            } else if (groupTwo.proType != 'DIAMOND') {
                return <img className={styles.img} src={app.$http.imgURL + groupTwo.picUrl} alt="" /> 
            } else {
                return <img className={styles.img}  src="./images/Diamonds.png" alt="" />
            }
        }

       return (
        <div className={styles.tr}>
            <div className={styles.leftWrap} style={{flex:1}}>
                <div style={{width: '100%'}}>
                    {/* 定制 */}
                    <div style={{display:'flex'}} className={styles.tdWrap}>
                        <div className={styles.td}  style={{flex:3,justifyContent:'flex-start',paddingLeft:24}}>
                            {/* <img className={styles.img} src={app.$http.imgURL + groupTwo.picUrl} alt="" /> */}
                            {picUrl()}
                            <div>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{groupOne.proName}</p>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{groupTwo.proName}</p>
                            </div>
                    
                        </div>
                        <div className={styles.td}  style={{flex:1}}><div style={{width:'140px',overflowWrap:'break-word'}}>{groupTwo.proId}</div></div>
                        <div className={styles.td}  style={{ flex: '0 1 50px' }}>X{groupOne.proNum}</div>
                        <div className={styles.td}  style={{flex:1}}>
                            <div className={styles.designWrap}>
                                <p>{groupOne.proTypeName}</p>
                                <p className={styles.designCont}>{groupOne.proTypeAd? `（${groupOne.proTypeAd}）`: ''}</p>
                            </div>
                        </div>
                        <div className={styles.td}  style={{flex:1}}>
                        <div>
                            <p className={`${styles.td} ${styles.noBorderRigth}`}>￥{groupOne.salePrice}</p>
                            <p className={`${styles.td} ${styles.noBorderRigth}`}>￥{groupTwo.salePrice}</p>
                        </div>
                        </div>
                        <div className={styles.td}  style={{flex:1}}>
                            <div>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{wholeSalePriceOne()}</p>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{wholeSalePriceTwo()}</p>
                            </div>
                        </div>
                        {/* <div className={styles.td}  style={{flex:1}}>
                            <div>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{factoryPriceOne()}</p>
                                <p className={`${styles.td} ${styles.noBorderRigth}`}>{factoryPriceTwo()}</p>
                            </div>
                        </div> */}
                        <div className={`${styles.td} ${styles.tdSize}`}  style={{flex:1}}>
                        <div>
                            <div className={`${styles.td} ${styles.tdSize} ${styles.noBorderRigth}`}>
                                {/* <p>克重：0.46g</p>
                                <p>材质：PT950</p>
                                <p>尺寸：16</p> */}
                                {specOne()}
                            </div>  
                            <div className={`${styles.td} ${styles.tdSize} ${styles.noBorderRigth}`}>
                                {/* <p>克重：0.46g</p>
                                <p>材质：PT950</p>
                                <p>尺寸：16</p> */}
                                {specTwo()}
                            </div>  

                        </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
       )
    }
}  

export default GroupDetailTr;
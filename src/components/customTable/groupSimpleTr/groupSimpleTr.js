import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs,} from 'antd';
import app from 'app';
import styles from './groupSimpleTr.less';

class groupTr extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
       const {groupOne,groupTwo} = this.props
       console.log('组合套装');
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
        <div className={styles.itemTable}>
            <div className={styles.modeWrap}>
                <div style={{ flex: 1}}>
                    <div style={{display:'flex'}}>
                        <div className={styles.imgTd}>
                                {/* <img className={styles.img} src="" alt="" /> */}
                                {picUrl()}
                        </div>

                        <div className={styles.secondWrap} style={{ flex: 1.48 }}>
                            <div style={{display:'flex'}}>
                                <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 1 }}>{groupOne.proName}</div>
                                {/* <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div> */}
                            </div>

                            <div style={{display:'flex'}}>
                                <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 1 }}>{groupTwo.proName}</div>
                                {/* <div className={styles.itemTd} style={{ flex: 1 }}>￥ 2342.00</div> */}
                            </div>
                        </div>

                        <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X{groupOne.proNum}</div>
                        <div className={styles.itemTd} style={{ flex: 1}}> 
                            <div className={styles.designWrap}>
                                <p>{groupOne.proTypeName}</p>
                                <p className={styles.designCont}>{groupOne.proTypeAd? `（${groupOne.proTypeAd}）`: ''}</p>
                            </div>
                        </div>
                        <div className={styles.itemTd} style={{ flex: 1}}> ￥{groupOne.salePrice}</div>

                        <div className={styles.thirdWrap} style={{ flex: '0 1 146px', justifyContent:'flex-start'}}>
                            <div className={styles.itemTd} style={{justifyContent:'flex-start',paddingLeft:20}}>
                                        <div>
                                            {/* <p>克重：0.46g</p>
                                            <p>材质：PT950</p>
                                            <p>尺寸：16</p> */}
                                            {specOne()}
                                        </div>
                                </div>
                                <div className={styles.itemTd} style={{justifyContent:'flex-start',paddingLeft:20}}>
                                        <div>
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

export default groupTr;
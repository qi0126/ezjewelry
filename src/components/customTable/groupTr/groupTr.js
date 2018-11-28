import React ,{Fragment}from 'react';
import PropTypes from 'prop-types';
import { Select, Button,Slider,Tabs,} from 'antd';
import app from 'app';
import styles from './groupTr.less';

class groupTr extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render() {
        const {groupOne,groupTwo} = this.props
        console.log('组合tr1111111111111');
        console.log(groupOne);
        console.log(groupTwo);

        const specOne = () => {
            const lis = JSON.parse(groupOne.specInfo).map((item, index) => {
              return (
                  <div key={index}>{item.specView}：{item.specValue}</div>
                );
            });
            return lis;
        };

        const specTwo = () => {
            const lis = JSON.parse(groupTwo.specInfo).map((item, index) => {
              return (
                  <div key={index}>{item.specView}：{item.specValue}</div>
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
                        <div className={styles.imgTd} style={{marginRight:20}}>
                      
                                {picUrl()}
                        </div>

                        {/* <div className={styles.secondWrap} style={{ flex: 1 }}>
                            <div>
                                <div style={{display:'flex'}}>
                                    <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 2 }}>{groupOne.proName}</div>
                                    <div className={styles.itemTd} style={{ flex: 1 }}>￥ {groupOne.salePrice}</div>
                                </div>

                                <div style={{display:'flex'}}>
                                    <div className={`${styles.itemTd} ${styles.noBoder}`} style={{ flex: 2 }}>{groupTwo.proName}</div>
                                    <div className={styles.itemTd} style={{ flex: 1 }}>￥ {groupTwo.salePrice}</div>
                                </div>
                            </div>
                        </div> */}

                         <div className={styles.secondWrap} style={{ flex: 1}}>
                            <div style={{display:'flex',height:'100%'}}>
                                <div style={{height:'100%',flex:9}}>
                                    <div style={{height:'50%',display:'flex',alignItems:'center'}}>{groupOne.proName}</div>
                                    <div style={{height:'50%',display:'flex',alignItems:'center'}}>{groupTwo.proName}</div>
                                    
                                    {/* 1 */}
                                </div>

                                <div style={{height:'100%',flex:4,borderLeft:'1px solid #e8e8e8'}}>
                                    <div style={{height:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>￥ {groupTwo.salePrice}</div>
                                    <div style={{height:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>￥ {groupOne.salePrice}</div>
                                    {/* 2 */}
                                </div>
                            </div>
                        </div>


                        {/* <div style={{  }}>
                            <div className={styles.itemTd} style={{ flex: 1 }}>￥ {groupOne.salePrice}</div>
                             <div className={styles.itemTd} style={{ flex: 1 }}>￥ {groupTwo.salePrice}</div>
                        </div> */}

                        <div className={styles.itemTd} style={{ flex: '0 1 50px' }}>X{groupOne.proNum}</div>
                        <div className={styles.itemTd} style={{ flex: '0 1 107px',display:'flex',flexDirection:'column'}}> 
                            {/* <p>{groupOne.proTypeName}</p>
                            <p style={{color:'#C09E57', fontSize:13}}>{groupOne.proTypeAd? `（${groupOne.proTypeAd}）`: ''}</p> */}
                            <div className={styles.designWrap}>
                                <p>{groupOne.proTypeName}</p>
                                <p className={styles.designCont}>{groupOne.proTypeAd? `（${groupOne.proTypeAd}）`: ''}</p>
                            </div>
                        </div>

                        <div className={styles.thirdWrap} style={{ flex: '0 1 146px',justifyContent:'flex-start'}}>
                                <div className={styles.itemTd} style={{paddingLeft:20,justifyContent:'flex-start'}}>
                                        <div>
                                            {/* <p>克重：0.46g</p>
                                            <p>材质：PT950</p>
                                            <p>尺寸：16</p> */}
                                            {specOne()}
                                        </div>
                                </div>
                                <div className={styles.itemTd} style={{paddingLeft:20,justifyContent:'flex-start'}}>
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

                {/* <div className={styles.itemPayTr}>
                    <p>在线支付</p>
                    <p>¥ 1978.00</p>
                </div> */}
            </div>

        </div>
       )
    }
}  

export default groupTr;
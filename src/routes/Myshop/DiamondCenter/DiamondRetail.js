import React from 'react';
import { connect } from 'dva';
import { Select, Button,Slider, Row, Col, Input,Form,message, Pagination,Spin } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';
import $$ from 'jquery';

import styles from './DiamondRetail.less';


const marksColor = {
   0: 'D',
  14: 'E',
  28: 'F',
  42: 'G',
  56: 'H',
  70: 'I',
  84: 'J',
  100: '',
};

const marksCut = {
  0: 'EX',
  33:'VG',
  66:'GD',
  100:''
}

const marksClean = {
  0: 'VVS1',
  20: 'VVS2',
  40: 'VS1',
  60: 'VS2',
  80: 'SI1',
  100: ''

}


  class DiamondRetail extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        list:[],
        startColor:0,
        endColor:100,

        startCut:0,
        endCut:100,

        startClarity:0,
        endClarity:100,

        startWeight:0,
        endWeight:5,
        startPrice:0,
        endPrice:100001,
        colorList:'',
        clarityList:'',
        cutList:'',
        pageIndex:1,//当前页
        pageSize:10,//每页展示条数
        totalNum:0,//总条数
        sliderStepOne:0.5,//滑块克重步长
        sliperArr:[0,5],
        proLoading: true, // 产品加载中属性
        proLoadingSilder: true, // 筛选条件加载中属性
      }
    }

    componentDidMount() {
      this.getlist(1,10);
      this.sliderInit();
    }
    
    getlist = (pageIndex,pageSize) => {
      this.setState({
        proLoading: true,
      });
      let endNum = '';
      if (this.state.startWeight != 5 && this.state.endWeight == 5) {
        endNum = 5.1
      } else if (this.state.startWeight == 5 && this.state.endWeight == 5) {
        endNum = 5
      } else {
        endNum = this.state.endWeight
      }
      let params = {
        pageSize:pageSize,
        pageIndex:pageIndex,
        startWeight:this.state.startWeight,
        endWeight:endNum,
        startPrice:this.state.startPrice,
        endPrice:this.state.endPrice,
        colorList:this.state.colorList + '',
        clarityList:this.state.clarityList + '',
        cutList:this.state.cutList + '',
      };
      app.$api.getDiamondList(params).then(res => {
        let allData = res.data.list;
        allData.forEach(item => {
          item.updatetime = app.$tool.day(item.updatetime).format('MMDD');
        })
        this.setState(() => ({
          list:allData,
          totalNum:res.data.paging.totalNum,
          proLoading:false
        }), () => {
          this.props.form.resetFields();
        })
      })
    }

    //slider初始化
    sliderInit = () => {
      this.setState({
        proLoadingSilder: true,
      });
      $$('#fisrt .numberTipFirst').remove();
      $$('#fisrt .numberTipSecond').remove();
      $$('#fisrt').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>0</div>`)
      $$('#fisrt').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>5以上</div>`)

      $$('#Second .numberTipFirst').remove();
      $$('#Second .numberTipSecond').remove();
      $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>0</div>`)
      $$('#Second').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>10万以上</div>`)
      this.setState({
        proLoadingSilder: false,
      });
    }

    //计算加价
    computePrice = (item,index) => {
      let priceFactor = this.props.form.getFieldValue(`priceFactor_${index}`);
      let sellingPrice = this.props.form.getFieldValue(`sellingPrice_${index}`);
      let keyFactor = `priceFactor_${index}`;
      let keySelling = `sellingPrice_${index}`;

      if (isNaN(priceFactor) || priceFactor == '') {
        message.warning('请输入数字！');
        return;
      }

      if ( priceFactor == 0 || priceFactor < 0) {
        message.warning('加价系数不能小于0！');
        let jsonData = {};
        jsonData[keyFactor] = '';
        jsonData[keySelling] = '';
        this.props.form.setFieldsValue(jsonData);
        return;
      }

      let params = {
        proCode:item.codeNo,
        rule:priceFactor
      }
      app.$api.addFareLevel(params).then(res => {
        if (!isNaN(priceFactor)) {
          let nwList = [...this.state.list];
          //let money = nwList[index].sellingPrice = (item.price * priceFactor).toFixed(1);
          let money = (item.price * priceFactor).toFixed(1);
          nwList[index].sellingPrice = parseInt(money);
          let jsonData = {};
          jsonData[keyFactor] = priceFactor;
          jsonData[keySelling] = parseInt(money);
          this.props.form.setFieldsValue(jsonData);
          this.setState(() => ({
            list:nwList
          }))
        }
      })
    }
    //计算价格系数
    computeRatio = (item,index) => {
      let sellingPrice = this.props.form.getFieldValue(`sellingPrice_${index}`);
      let keyFactor = `priceFactor_${index}`;
      let keySelling = `sellingPrice_${index}`;
      if (isNaN(sellingPrice) || sellingPrice == '') {
        message.warning('请输入数字！');
        return;
      }

      if (sellingPrice == 0 || sellingPrice < 0) {
        message.warning('请不能小于0！');
        let jsonData = {};
        jsonData[keyFactor] = '';
        jsonData[keySelling] = '';
        this.props.form.setFieldsValue(jsonData);
        return;
      }

      let nwList = [...this.state.list];
      let rule = (sellingPrice / item.price).toFixed(1);
      nwList[index].priceFactor = rule;
      let params = {
        proCode:item.codeNo,
        rule:rule
      }
      let jsonData = {};
      jsonData[keyFactor] = rule;
      jsonData[keySelling] = parseInt(sellingPrice);
      this.props.form.setFieldsValue(jsonData);

      app.$api.addFareLevel(params).then(res => {
        this.setState(() => ({
          list:nwList
        }))
      });
    }

    onChangeFisrt = (value) => {
      // console.log('滑动1');
      // console.log(value);
      let self = this;
      let diffValu = value[1]-value[0];
      let num = '';
      this.state.sliperArr.forEach((item, indexOne)=> {
        value.forEach((sign, indexTwo) => {
          if (indexOne == indexTwo && item != sign) {
            // console.log(indexOne)
            num = indexOne;
            self.state.sliperArr[indexOne] = sign;
            self.setState({
              sliperArr:self.state.sliperArr
            })
            // return;
          }
        })
      })
      // console.log(diffValu);
      // console.log('小标');
      // console.log(num);
      // console.log(this.state.sliperArr);

      if (num == 0) {
        // console.log('我是0');
        if (value[0] < 1) {
          // console.log('11111111111')
          this.setState({
            sliderStepOne:0.1
          })
        } else {
          // console.log('122222222')
          this.setState({
            sliderStepOne:0.5
          })
        }
      } else if (num == 1) {
        // console.log('我是1');
        if (value[1] < 1) {
          // console.log('3333333333')
          this.setState({
            sliderStepOne:0.1
          })
        } else {
          // console.log('4444444444')
          this.setState({
            sliderStepOne:0.5
          })
        }
      }

      $$('#fisrt .numberTipFirst').remove();
      $$('#fisrt .numberTipSecond').remove();
      $$('#fisrt .numberTipSecondTop').remove();
      // $$('#fisrt').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>${value[0]}</div>`)
      if (diffValu <= 0.2 && diffValu != 0) {
        $$('#fisrt').find('.ant-slider-handle-1').append(`<div class='numberTipSecondTop'>${value[0]}</div>`)
      } else if (diffValu == 0) {
        // console.log('进来');
      } else {
        $$('#fisrt').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>${value[0]}</div>`)
      }
      if (value[1] == 5) {
        $$('#fisrt').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>5以上</div>`)
        this.setState({
          startWeight:value[0],
          endWeight:5,
        })
      } else {
        $$('#fisrt').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>${value[1]}</div>`)
        this.setState({
          startWeight:value[0],
          endWeight:value[1],
        })
      }
    }

    onChangeSecond = (value) => {
      let diffValu = value[1]-value[0];
      $$('#Second .numberTipFirst').remove();
      $$('#Second .numberTipSecond').remove();
      $$('#Second .numberTipSecondTop').remove();
      // $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>${value[0]}</div>`)
      if (diffValu < 13800 && 800 < diffValu) {
        $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipSecondTop'>${value[0]}</div>`)
      } else if (diffValu <= 800) {
        // console.log('合拼');
        this.setState({
          startPrice:value[1],
          endPrice:value[1]
        })
      } else {
        $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>${value[0]}</div>`)
      }
      
      if (value[1] == 100000) {
        $$('#Second').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>10万以上</div>`)
        this.setState({
          startPrice:value[0],
          endPrice:1000001,
        })
      } else {
        $$('#Second').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>${value[1]}</div>`)
        this.setState({
          startPrice:value[0],
          endPrice:value[1],
        })
      }
      
    }

    onChangeThird = (value) => {
      let res = [];
      if (value[0] != value[1] && value[0] == '0') {
        res.push('D');
      }
      if (value[0] != value[1] && value[0] == '14') {
        res.push('E');
      }
      if (value[0] != value[1] && value[0] == '28') {
        res.push('F');
      }
      if (value[0] != value[1] && value[0] == '42') {
        res.push('G');
      }
      if (value[0] != value[1] && value[0] == '56') {
        res.push('H');
      }
      if (value[0] != value[1] && value[0] == '70') {
        res.push('I');
      }
      if (value[0] != value[1] && value[0] == '84') {
        res.push('J');
      }
      
      if (value[0] != value[1] && value[1] == '100') {
        res.push('J');
      }
      if (value[0] != value[1] && value[1] == '84') {
        res.push('I');
      }
      if (value[0] != value[1] && value[1] == '70') {
        res.push('H');
      }
      if (value[0] != value[1] && value[1] == '56') {
        res.push('G');
      }
      if (value[0] != value[1] && value[1] == '42') {
        res.push('F');
      }
      if (value[0] != value[1] && value[1] == '28') {
        res.push('E');
      }
      if (value[0] != value[1] && value[1] == '14') {
        res.push('D');
      }

      this.setState({
        colorList:res,
        startColor:value[0],
        endColor:value[1]
      })
    }

    onChangeFourth = (value) => {
      let res = [];
      if (value[0] != value[1] && value[0] == '0') {
        res.push('EX');
      }
      if (value[0] != value[1] && value[0] == '33') {
        res.push('VG');
      }
      if (value[0] != value[1] && value[0] == '66') {
        res.push('GD');
      }

      if (value[0] != value[1] && value[1] == '100') {
        res.push('GD');
      }

      if (value[0] != value[1] && value[1] == '66') {
        res.push('VG');
      }

      if (value[0] != value[1] && value[1] == '33') {
        res.push('EX');
      }

      this.setState({
        cutList:res,
        startCut:value[0],
        endCut:value[1]
      })
    }

    onChangeFifth = (value) => {
      let res = [];
      if (value[0] != value[1] && value[0] == '0') {
        res.push('VVS1');
      }

      if (value[0] != value[1] && value[0] == '20') {
        res.push('VVS2');
      }

      if (value[0] != value[1] && value[0] == '40') {
        res.push('VS1');
      }

      if (value[0] != value[1] && value[0] == '60') {
        res.push('VS2');
      }

      if (value[0] != value[1] && value[0] == '80') {
        res.push('SI1');
      }

      if (value[0] != value[1] && value[1] == '100') {
        res.push('SI1');
      }

      if (value[0] != value[1] && value[1] == '80') {
        res.push('VS2');
      }

      if (value[0] != value[1] && value[1] == '60') {
        res.push('VS1');
      }

      if (value[0] != value[1] && value[1] == '40') {
        res.push('VVS2');
      }

      if (value[0] != value[1] && value[1] == '20') {
        res.push('VVS1');
      }
      this.setState({
        clarityList:res,
        startClarity:value[0], 
        endClarity:value[1]
      })
    }

    //搜索事件
    searchBtn = () => {
      this.setState(() => ({
        pageIndex:1,
        pageSize:10
      }), () => {
        this.getlist(1,10);
      })
    }

    // 重新筛选
    resetSearch = () => {
      this.setState(() => ({
        startWeight:0,
        endWeight:5,
        startPrice:0,
        endPrice:100001,
        startColor:0,
        endColor:100,
        startCut:0, 
        endCut:100, 
        startClarity:0, 
        endClarity:100,
        // 颜色、切工、净度
        colorList:'',
        clarityList:'',
        cutList:'',
        pageIndex:1,//当前页
        pageSize:10,//每页展示条数
        totalNum:0,//总条数
      }), () => {
        this.sliderInit();
        this.getlist(1,10);
      });
      
    }
    
    //分页
    onShowSizeChange = (current, pageSize) => {
      // console.log(pageSize);
      this.getlist(1,pageSize);
      this.setState({
        pageSize
      })
    }

    onChangPage = (page, pageSize) => {
      // console.log(page, pageSize);
      this.setState(() => ({
        pageIndex:page
      }),() => {
        this.getlist(page,pageSize);
      })
    }



  render() {
    const { startWeight, endWeight, startPrice, endPrice, startColor, endColor,  startCut, endCut, startClarity, endClarity, pageIndex, pageSize, totalNum,sliderStepOne} = this.state;
    const { getFieldDecorator } = this.props.form;
    const trList = () => {
      if (this.state.list.length == 0 || this.state.list.length == undefined) {
        return (
            <div className={styles.tr}>
                <div className={styles.td}>暂无数据</div>
            </div> 
        )
      } else {
        let res = this.state.list.map((item,index) => {
          return (
            <div className={styles.tr} key={index}>
                <div className={styles.td}>{item.shape}</div>
                <div className={styles.td}>{item.carat}</div>
                <div className={styles.td}>{item.color}</div>
                <div className={styles.td}>{item.clarity}</div>
                <div className={styles.td}>{item.cut}</div>
                {/* <div className={styles.td}>{item.fluor}</div> */}
                <div className={styles.td}>{item.polish}</div>
                <div className={styles.td}>{item.symmetry}</div>
                <div className={styles.td}>{item.fluor}</div>
                <div className={styles.td}>{item.lab}</div>
                <div className={styles.td}>{item.price}</div>
                <div className={styles.td}>
                    {getFieldDecorator(`priceFactor_${index}`, {
                                initialValue:item.priceFactor,
                                rules: [{ required: true}]
                            })(
                                <Input placeholder="请输入" className={styles.InputFirst} onBlur={() => {this.computePrice(item,index)}}/>
                    )}
                  {/* <Input placeholder=""  className={styles.InputFirst}/> */}
                </div>
                <div className={styles.td}>
                    {getFieldDecorator(`sellingPrice_${index}`, {
                                initialValue:item.sellingPrice,
                                rules: [{ required: true}]
                            })(
                                <Input placeholder="请输入" className={styles.InputSecond} onBlur={() => {this.computeRatio(item,index)}}/>
                    )}
                {/* <Input placeholder="" className={styles.InputSecond}/> */}
                </div>
                <div className={styles.td}>{item.updatetime}</div>
            </div> 
          )
        })
        return res;
      }
    }
    return (
      <div id={styles.diamondWrap} >
        <div className={styles.titleWrap}>
           <div className={styles.pricTitle}>零售钻石库</div>
        </div>
        <Spin size="large" spinning={this.state.proLoadingSilder} >
          <Row className={styles.topContent}>
            <Col span={12} className={styles.leftWrap}>
              <span className={styles.leftTitle}>克重(ct)</span>
              <div className={styles.outerWrap}>
                <div className="sliderWrap" id="fisrt">
                  <Slider range  step={sliderStepOne} value={[startWeight,endWeight]}  onChange={this.onChangeFisrt} tipFormatter={null}   
                          min={0} max={5} />
                </div>
              </div>
              
            </Col>
            <Col span={12} className={styles.leftWrap}>
              <span className={styles.leftTitle}>价格(￥)</span>
              <div className={styles.outerWrap}>
                <div className="sliderWrap">
                  <div className="sliderWrap" id="Second">
                    <Slider range value={[startPrice,endPrice]}  onChange={this.onChangeSecond} tipFormatter={null}   
                            min={0} max={100001}  step={100} />
                  </div>
                </div>
              </div>
              
            </Col>
            <Col span={12} className={styles.leftWrap}>
              <span className={styles.leftTitle}>颜色</span>
              <div className={styles.outerWrap}>
                <div className="sliderWrap" id="third">
                  <Slider dots={false} range marks={marksColor} step={null} value={[startColor,endColor]}  tipFormatter={null} onChange={this.onChangeThird}/>
                </div>
              </div>
              
            </Col>
            <Col span={12} className={styles.leftWrap}>
              <span className={styles.leftTitle}>切工</span>
              <div className={styles.outerWrap}>
                <div className="sliderWrap" id="fourth">
                  <Slider range marks={marksCut} step={null} value={[startCut,endCut]} tipFormatter={null} onChange={this.onChangeFourth}/>
                </div>
              </div>
              
            </Col>
            <Col span={12} className={styles.leftWrap}>
              <span className={styles.leftTitle}>净度</span>
              <div className={styles.outerWrap}>
                <div className="sliderWrap" id="fifth">
                  <Slider range marks={marksClean} step={null} value={[startClarity, endClarity]} tipFormatter={null} onChange={this.onChangeFifth}/>
                </div>
              </div>
            </Col>
          </Row>
        </Spin>

        <Row className={styles.btnWrap}>
          <Col span={12} className={styles.leftBtnWrap}>
            <span className={styles.btnL} onClick={this.searchBtn}>搜索</span>
          </Col>
          <Col span={12} className={styles.rightBtnWrap}>
          <span className={styles.btnR} onClick={this.resetSearch}>重新筛选</span>
          </Col>
        </Row>

         <Row className={styles.tableTitle}>
            <Col span={6} className={styles.leftTitle}>
                裸钻搜索结果<span>({totalNum})</span>
            </Col>
            <Col span={18} className={styles.rightTitle}>
             <div className={styles.pagWrap}>
                  <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} current={pageIndex} total={totalNum} 
                  onChange={this.onChangPage} pageSize={pageSize}/>
             </div>
            </Col>
        </Row>
        {/* 表格 */}
        <div className={styles.tabelWrap}>
            <div className={styles.thead}>
              <div className={styles.tr}>
                <div className={styles.td}>形状</div>
                <div className={styles.td}>克重</div>
                <div className={styles.td}>颜色</div>
                <div className={styles.td}>净度</div>
                <div className={styles.td}>切工</div>
                {/* <div className={styles.td}>荧光</div> */}
                <div className={styles.td}>抛光</div>
                <div className={styles.td}>对称</div>
                <div className={styles.td}>荧光</div>
                <div className={styles.td}>证书</div>
                <div className={styles.td}>批发价</div>
                <div className={styles.td}>加价系数</div>
                <div className={styles.td}>售价</div>
                <div className={styles.td}>更新时间</div>
              </div>
            </div>
            <Spin size="large" spinning={this.state.proLoading} >
              <div className={styles.tbody}>
                <Form>
                  {trList()}
                </Form>
              </div>
            </Spin>
        </div>

        {/*  */}
        {/* <div className="sliderWrap">
            <Slider range marks={marks} step={null} defaultValue={[26,37]}/>
        </div> */}
        {/*  */}
      </div>
    );
  }
};

DiamondRetail.propTypes = {

};

DiamondRetail.contextTypes = {
  router: PropTypes.object.isRequired,
};

const DiamondRetailForm = Form.create({})(DiamondRetail);

export default DiamondRetailForm;

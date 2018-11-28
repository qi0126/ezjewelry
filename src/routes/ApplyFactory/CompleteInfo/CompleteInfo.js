import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './CompleteInfo.less';

import StepView from '../acommon/step';
import ShopData from '../acommon/shopData';
import CompleteInfoFirst from '../acommon/completeInfo';

class CompleteInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 当前步骤
      pageIndex: 4,
      stepIndex: 0,
      backData: {},
      propsStatus: false,
    };
  }

  componentDidMount() {
    this.getUserInfo().then((res) => {
      this.backDataEvent();
    });
  }

  // 数据回填
  getUserInfo() {
    return app.$api.userMyInfo().then((res) => {
      const { step } = res.data;
      const { pageIndex, stepIndex } = this.changePage(step);
      this.setState({
        pageIndex,
        stepIndex,
        backData: res.data,
      });
    });
  }

  changePage(step) {
    let pageIndex = 3,
      stepIndex = 0;
    switch (step) {
      case 3:
        pageIndex = 0;
        stepIndex = 1;
        break;
      case 2:
        pageIndex = 1;
        stepIndex = 2;
        break;
      case 1:
        pageIndex = 2;
        stepIndex = 3;
        break;
      case 0:
        pageIndex = 3;
        stepIndex = 3;
        break;
      default:
        break;
    }
    return {
      pageIndex,
      stepIndex,
    };
  }

  // 数据回填
  backDataEvent() {
    const { backData } = this.state;
    this.backDataHandle(backData);
  }

  // 回填数据处理
  backDataHandle(options) {
    const { country, region = '', imgOne = '', headPic, produceType } = options;
    const otherData = {
      region: region.split(','),
    };
    const cardImg = imgOne.split(',');
    Object.assign(options, otherData);

    // 回填图片处理
    this.setState({
      country,
      ctype: (produceType !== 'k金' && produceType !== '素金' && produceType !== '镶嵌') ? 4 : produceType,
      produceTypeValue: (produceType !== 'k金' && produceType !== '素金' && produceType !== '镶嵌') ? produceType : '',
      logoImg: headPic,
      cardTrueImg: cardImg[0],
      cardFalseImg: cardImg[1],
      backData: options,
      propsStatus: true,
    });
  }

  // 基础信息
  comTrue() {
    const { pageIndex, stepIndex } = this.changePage(2);
    this.setState({
      pageIndex,
      stepIndex,
    });
  }

  // 店铺信息
  dataTrue() {
    const { pageIndex, stepIndex } = this.changePage(1);
    this.setState({
      pageIndex,
      stepIndex,
    });
  }

  render() {
    const { pageIndex, stepIndex } = this.state;
    return (
      <div className={styles.bg}>
        <div className={styles.createWrap} >
          <StepView result={stepIndex} />

          <div className={pageIndex === 0 ? 'gShow' : 'gHide'}><CompleteInfoFirst result={this.state} comTrue={this.comTrue.bind(this)} /></div>

          <div className={pageIndex === 1 ? 'gShow' : 'gHide'}><ShopData result={this.state} backPage={() => { this.setState({ pageIndex: 0 }); }} dataTrue={this.dataTrue.bind(this)} /></div>

          {pageIndex === 2 && (
          <div className={styles.submitSucces}>
            <div>
              <p>您申请资料已提交成功，请耐心等待平台审核结果！！</p>
            </div>
          </div>
)}
          {pageIndex === 3 && (
          <div className={styles.auditSucces}>
            <div className={styles.name}>您好， Jennifer；</div>
            <div className={styles.info}>
              <p>恭喜您审核已通过，</p>
              <p>您已成功创建平台店铺，赶快去平台库挑选产品或上传发布销售吧！</p>
            </div>
          </div>
)}
        </div>

      </div>
    );
  }
}

CompleteInfo.propTypes = {

};

CompleteInfo.contextTypes = {
  router: PropTypes.object.isRequired,
};

const CompleteInfoFrom = Form.create()(CompleteInfo);


export default CompleteInfoFrom;

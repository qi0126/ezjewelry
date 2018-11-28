import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './ModalShop.less';


class ModalShop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className={styles.modalShop}>
        <div className={styles.datumWrap}>
          <div className={styles.tit}>个人信息</div>
          <div className={styles.datum}>
            <div className={styles.datumRow}>
              <p className={styles.name}>姓名:</p>
              <p className={styles.value}>李小君</p>
              <p className={styles.name}>性别:</p>
              <p className={styles.value}>女</p>
            </div>
          </div>
          <div className={styles.datum}>
            <div className={styles.datumRow}>
              <p className={styles.name}>手机号:</p>
              <p className={styles.value}>15623413601</p>
              <p className={styles.name}>邮箱:</p>
              <p className={styles.value}>15623413601@gmail.com</p>
            </div>
          </div>
          <div className={styles.datum}>
            <div className={styles.datumRow}>
              <p className={styles.name}>您目前的职业:</p>
              <p className={styles.value}>自由职业</p>
              <p className={styles.name}>实体珠宝门店:</p>
              <p className={styles.value}>江苏省苏州市相城区观前街36号</p>
            </div>
          </div>
          <div className={styles.datum}>
            <div className={styles.datumRow}>
              <p className={styles.name}>您目前所在地区:</p>
              <p className={styles.value}>江苏省 苏州市</p>
              <p className={styles.name}>详细地址:</p>
              <p className={styles.value}>江苏省苏州市相城区观前街36号</p>
            </div>
          </div>
        </div>

        <div className={styles.imgCol}>
          <div className={styles.imgTop}>身份证件</div>
          <div className={styles.imgWrap}>
            <div className={styles.imgItem}>
              <img src="" alt="" />
            </div>
            <div className={styles.imgItem}>
              <img src="" alt="" />
            </div>
          </div>
        </div>

        <div className={styles.shopDatumWrap}>
          <div className={styles.tit}>店铺资料</div>
          <div className={styles.oneList}>
            <p className={styles.oLeft}>店铺名称:</p>
            <p className={styles.oRight}>深圳市施华洛珠宝</p>
          </div>
          <div className={styles.oneList}>
            <p className={styles.oLeft}>店铺logo:</p>
            <p className={styles.oRight}><img src="" alt="" width="100" height="100" /></p>
          </div>
          <div className={styles.oneList}>
            <p className={styles.oLeft}>店铺介绍:</p>
            <p className={styles.oRight}>首饰富有现代风格并带着优雅的摩纳哥气息，</p>
          </div>
        </div>
      </div>
    );
  }
}

ModalShop.propTypes = {
  result: PropTypes.object.isRequired,
};

ModalShop.defaultProps = {
  result: { aa: 111 },
};

ModalShop.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default ModalShop;

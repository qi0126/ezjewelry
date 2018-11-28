import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './ModalPlat.less';


class ModalPlat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className={styles.modalPlat}>
        <div className={styles.datumWrap}>
          <div className={styles.tit}>我的资料</div>
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
              <p className={styles.name}>您目前所在地区:</p>
              <p className={styles.value}>江苏省 苏州市</p>
              <p className={styles.name}>详细地址:</p>
              <p className={styles.value}>江苏省苏州市相城区观前街36号</p>
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
              <p className={styles.name}>固定联系电话:</p>
              <p className={styles.value}>0755-23455555</p>
              <p className={styles.name} />
              <p className={styles.value} />
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

      </div>
    );
  }
}

ModalPlat.propTypes = {
  result: PropTypes.object.isRequired,
};

ModalPlat.defaultPropTypes = {
  result: {},
};


ModalPlat.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default connect()(ModalPlat);

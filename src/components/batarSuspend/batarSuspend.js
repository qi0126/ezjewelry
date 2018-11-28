
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input, Tabs, Table } from 'antd';
import app from 'app';

import styles from './batarSuspend.less';

class indexSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShop: false,
    };
  }

  componentDidMount() {

  }

  handleCancel() {
    this.setState({
      visibleShop: false,
    });
  }

  viewGold() {
    app.$api.selectGoldlist().then((res) => {
      Modal.info({
        content: (
          <div className={styles.propWrap}>
            <div className={styles.tit}>
              <p className={styles.tLeft}>今日金价</p>
              {/* <p className={styles.tRight}>2018.06.20日更新</p> */}
            </div>
            {res.data.map((data) => {
              return (<div className={styles.col}>
                <p className={styles.tLeft}>{data.textureName}</p>
                <p className={styles.tRight}>¥ {data.goldPrice}元/g</p>
              </div>);
            })}
          </div>
        ),
        onOk() {},
      });
    });
  }

  render() {
    return (
      <div className={styles.suspend}>
        {app.$tool.judAuth(',product-gold-price,') &&
        <div className={styles.wrap}>
          <div onClick={this.viewGold.bind(this)}>今日金价</div>
        </div>}
      </div>
    );
  }
}

indexSlide.propTypes = {

};


indexSlide.defaultProps = {

};

export default indexSlide;

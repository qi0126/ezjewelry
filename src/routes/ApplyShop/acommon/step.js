import React from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';
import styles from './step.less';

const Step = Steps.Step;

class step extends React.Component {

  render() {
    const { result } = this.props;
    return (
      <div>
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={`${styles.tit} ${styles.dot}`}>店铺申请进度</div>
          </div>
          <div >
            <Steps current={result}>
              <Step title="注册账号" />
              <Step title="完善信息" />
              <Step title="店铺资料" />
              <Step title="平台审核" />
            </Steps>
          </div>
        </div>
        <div style={{ height: 10, background: '#f8f8f8' }} />
      </div>
    );
  }
}

step.propTypes = {
  result: PropTypes.number.isRequired,
};

export default step;

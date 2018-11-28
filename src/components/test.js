import React from 'react';
import { connect } from 'dva';
import styles from './test.less';

const Test = () => {
  return (
    <div className={styles.test} >
      <div className={styles.sAudit}>
        <div className={styles.top}>
          <div className={styles.tit}>店铺信息</div>
        </div>
      </div>
    </div>
  );
};

Test.propTypes = {

};

export default connect(({ test }) => ({
  test,
}))(Test);

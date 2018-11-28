import React from 'react';
import { Input, Button, message } from 'antd';
import app from 'app';
import MessageModal from './common/messageModal';

import styles from './messageSend.less';

class MessegaSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {

  }

  uploadModal() {
    this.setState({
      visible: true,
    });
  }

  onOK() {
    this.setState({
      visible: false,
    });
  }

  onCancel() {
    this.setState({
      visible: false,
    });
  }


  render() {
    const { visible } = this.state;
    return (
      <div className={styles.messageSend} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>生日信息推送</div>
            {/* <div className={styles.searchBox}>
    <Input style={{ width: 300 }} size="large" placeholder="输入供应商名称查询" />
    <Button className={styles.btn} type="primary">搜索</Button>
  </div> */}
          </div>
        </div>

        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>活动信息推送</div>
            {/* <div className={styles.searchBox}>
    <Input style={{ width: 300 }} size="large" placeholder="输入供应商名称查询" />
    <Button className={styles.btn} type="primary">搜索</Button>
  </div> */}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.btn}>
            <Button type="primary" size="large" onClick={this.uploadModal.bind(this)} >选择推送客户</Button>
          </div>
        </div>

        <MessageModal visible={visible} onOk={this.onOK.bind(this)} onCancel={this.onCancel.bind(this)} />
      </div>
    );
  }
}

MessegaSend.propTypes = {

};

export default MessegaSend;

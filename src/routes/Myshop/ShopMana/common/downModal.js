import React from 'react';
import { Input, Button, message, Modal, Progress } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';

import styles from './downModal.less';

class DownModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      exProStatus: 'normal',
      exProgress: 0,
      uploadText: '',
    };
  }

  componentDidMount() {
    this.setState({
      visible: this.props.visible,
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk(e) {
    this.setState({
      visible: false,
    });
  }

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  getFile(e) {
    const self = this;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('excelFile', file);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
        if (complete) {
          this.setState({
            exProgress: complete,
          });
        } else {
          this.setState({
            exProgress: complete,
          });
        }
      },
    };
    // 添加请求头
    app.$http.instance
      .post(
        `${app.$http.URL}/client/uploadFile`,
        formData,
        config,
      )
      .then((res) => {
        if (res.data.code === 200) {
          message.success(res.data.msg);
          self.setState({
            uploadText: res.data.msg,
            exProStatus: 'success',
          });
        } else {
          message.error(res.data.msg);
          self.setState({
            exProStatus: 'exception',
          });
        }
      });
  }

  render() {
    const { onOk, onCancel } = this.props;
    const { visible, exProStatus, exProgress, uploadText } = this.state;
    return (
      <Modal
        title="批量新增vip用户"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={900}
      >
        <div>
          <div className={styles.box}>
            <p className={styles.boxTit}>请先下载EXCEL用户模版，直接填入用户资料，轻松上传</p>
            <div className={styles.boxBt}>
              <img className={styles.img} src="/images/img-col.png" width="68" height="64" />
              <a
                href={`${app.$http.URL}/excel/vip_user_model.xlsx`} target="_blank"
              ><div className={styles.customBtn} style={{ margin: '10px 0' }}>下载模板</div></a>
            </div>
            <div className={styles.boxBt}>
              <div className={styles.boxBtt}>
                <img className={styles.img} src="/images/img-col.png" width="68" height="64" />
                {exProgress !== 0 && <Progress style={{ width: 100 }} percent={exProgress} status={exProStatus} />}
                <input type="file" id="file" onChange={this.getFile.bind(this)} style={{ display: 'none' }} />
              </div>
              <div className={styles.boxtr}>
                <label htmlFor="file"><div className={styles.customBtn} style={{ margin: '10px 0' }}>选择文件</div></label>
                <div className={styles.customBtn} style={{ margin: '10px 30px' }}>上传</div>
              </div>
            </div>
            <div className={styles.uploadText}><p dangerouslySetInnerHTML={{ __html: uploadText }} /></div>
          </div>

        </div>

      </Modal>
    );
  }
}

DownModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

DownModal.defaultPropTypes = {
  visible: false,
};

// DownModal.contextTypes = {
//   router: PropTypes.object.isRequired,
// };


export default DownModal;

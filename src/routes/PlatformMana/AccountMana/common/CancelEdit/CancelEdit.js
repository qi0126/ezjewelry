import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './CancelEdit.less';


class CancelEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  // 动态修改组件
  componentWillReceiveProps() {

  }

  cancel() {
    this.context.router.goBack();
  }

  edit() {
    this.props.getEditStatu(false);
  }

  render() {
    return (<div className={styles.box}>
      <div className={styles.left} onClick={this.cancel.bind(this)} >{this.props.cancelStatu && <span><Icon type="left" /> <span>返回</span> </span> }</div>
      {this.props.children}
      <div className={styles.right} onClick={this.edit.bind(this)}>{this.props.editStatu && <span>编辑</span> }</div>
    </div>);
  }
}

CancelEdit.propTypes = {
  cancelStatu: PropTypes.bool,
  editStatu: PropTypes.bool,
};

CancelEdit.defaultPropTypes = {
  cancelStatu: true,
  editStatu: true,
};

CancelEdit.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default CancelEdit;

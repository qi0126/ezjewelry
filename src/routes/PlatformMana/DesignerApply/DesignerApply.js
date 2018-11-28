import React from 'react';
import { Table } from 'antd';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import styles from './DesignerApply.less';

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
  address: '西湖区湖底公园1号',
  job: 'xxx',
  startTime: 'xxx',
  endTime: 'xxx',
  status: 'xxx',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
  job: 'xxx',
  startTime: 'xxx',
  endTime: 'xxx',
  status: 'xxx',
}];

const columns = [{
  title: '申请人',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '地区',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '实体店',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '职业',
  dataIndex: 'job',
  key: 'job',
}, {
  title: '申请时间',
  dataIndex: 'startTime',
  key: 'startTime',
}, {
  title: '权限到期',
  dataIndex: 'endTime',
  key: 'endTime',
}, {
  title: '审核状态',
  dataIndex: 'status',
  key: 'status',
}];


const DesignerApply = ({ dispatch, designerApply }) => {
  const showModal = () => {
    dispatch({
      type: 'designerApply/showModal',
      payload: true,
    });
  };

  const handleOk = () => {
    dispatch({
      type: 'designerApply/handleOk',
      payload: true,
    });
    setTimeout(() => {
      dispatch({
        type: 'designerApply/handleOk',
        payload: false,
      });
    }, 3000);
  };

  const handleCancel = () => {
    dispatch({
      type: 'designerApply/showModal',
      payload: false,
    });
  };

  return (
    <div className={styles.designerApply} >
      <div className={styles.sAudit}>
        <div className={styles.top}>
          <div className={styles.tit}>设计师申请</div>
          <div className={styles.searchBox}>
            <input type="text" placeholder="输入供应商名称查询" className={styles.left} />
            <div className={styles.btn}>搜索</div>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <div className={styles.paginaNumWrap}>
            <span>每页展示数量</span>
            <div className={styles.paginaNum}>
              <p>20</p>
              <p>40</p>
              <p>60</p>
            </div>
          </div>
          <div className={styles.table}>
            <Table dataSource={dataSource} columns={columns} className={styles.row} bordered />
          </div>
        </div>
      </div>
      {/* 弹窗 */}

      <div>
        <Button type="primary" onClick={showModal}>
          Open
        </Button>
        <Modal
          visible={designerApply.visible}
          title="店铺审核"
          onOk={handleOk}
          onCancel={handleCancel}
          width="1100"
          footer={[
            <Button key="back" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={designerApply.loading} onClick={handleOk}>
              审核通过
            </Button>,
          ]}
        >
          <div />

        </Modal>
      </div>
    </div>
  );
};

DesignerApply.propTypes = {

};

export default connect(({ designerApply }) => ({
  designerApply,
}))(DesignerApply);

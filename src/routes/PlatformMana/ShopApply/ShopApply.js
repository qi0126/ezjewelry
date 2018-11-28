import React from 'react';
import { Table } from 'antd';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import styles from './ShopApply.less';

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


const ShopApply = ({ dispatch, shopApply }) => {

  const showModal = () => {
    dispatch({
      type: 'shopApply/showModal',
      payload: true,
    });
  };

  const handleOk = () => {
    dispatch({
      type: 'shopApply/handleOk',
      payload: true,
    });
    setTimeout(() => {
      dispatch({
        type: 'shopApply/handleOk',
        payload: false,
      });
    }, 3000);
  };

  const handleCancel = () => {
    dispatch({
      type: 'shopApply/showModal',
      payload: false,
    });
  };

  return (
    <div className={styles.shopApply} >
      <div className={styles.sAudit}>
        <div className={styles.top}>
          <div className={styles.tit}>店铺申请审核</div>
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
          visible={shopApply.visible}
          title="个人信息"
          onOk={handleOk}
          onCancel={handleCancel}
          width="1100"
          footer={[
            <Button key="back" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={shopApply.loading} onClick={handleOk}>
              审核通过
            </Button>,
          ]}
        >

          <div className={styles.me}>
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
                  <p className={styles.name}>您目前的职业:</p>
                  <p className={styles.value}>自由职业</p>
                  <p className={styles.name}>实体珠宝门店:</p>
                  <p className={styles.value}>江苏省苏州市相城区观前街36号</p>
                </div>
              </div>
            </div>
            <div className={styles.cardWrap}>
              <div className={styles.tit}>身份证件</div>
              <div className={styles.card} />
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


        </Modal>
      </div>
    </div>
  );
};

ShopApply.propTypes = {

};

export default connect(({ shopApply }) => ({
  shopApply,
}))(ShopApply);

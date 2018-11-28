import React from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import styles from './orderCenter.less';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select } from 'antd';

const Option = Select.Option;

const { Column, ColumnGroup } = Table;// 表格属性


const columns = [
  { title: '产品详情', key: 'name', render: (text, record) => <span style={{ paddingLeft: 30 }}><img src={record.imgUrl} className={styles.imgSmall} />{record.name}</span> },
  { title: '数量', dataIndex: 'num', key: 'num' },
  { title: '供应商批发价', dataIndex: 'priceOne', key: 'priceOne' },
  { title: '克重', dataIndex: 'weight', key: 'weight' },
  { title: '材质', dataIndex: 'mater', key: 'mater' },
  { title: '尺寸', dataIndex: 'size', key: 'size' },
];

const data = [
  { key: 1, name: '纯银镶晶钻简约掌心环', imgUrl: '../images/pro01.png', num: 'X1', priceOne: '￥3166.00~￥3566.00', weight: '0.35g~0.46g', mater: 'PT950', size: '16', description: '商品编号：326435778' },
  { key: 2, name: '纯银镶晶钻简约掌心环', imgUrl: '../images/pro02.png', num: 'X2', priceOne: '￥3166.00~￥3566.00', weight: '0.35g~0.46g', mater: 'PT950', size: '16', description: '商品编号：326435779' },
  { key: 3, name: '纯银镶晶钻简约掌心环', imgUrl: '../images/pro03.png', num: 'X3', priceOne: '￥3166.00~￥3566.00', weight: '0.35g~0.46g', mater: 'PT950', size: '16', description: '商品编号：326435780' },
];
function handleChange(value) {
  console.log(`selected ${value}`);
}

const orderDetail = ({ dispatch, myfamOrderCenter }) => {
  const tableState = {

    expandRowByClick: false,
    pagination: false,
  };
  return (
    <div className={styles.saleData}>
      <div className={styles.tit}>订单详情
      </div>
      <div className={styles.hr} />
      <Row className={styles.boxAlignCenter}>
          <Col span={6}>
            下单时间：2018-08-15 15:22:10
          </Col>
          <Col span={6}>
            订单号：77008093354
          </Col>
        </Row>
      <div className={styles.hr} />
      <div className={styles.tabOne}>
        <Table
          columns={columns}
          {...tableState}
          dataSource={data}
        />
        <div className={styles.orderFooter}>
          <Row>
            <Col span={3} className={styles.txtGoldThree}>
              买家备注：
            </Col>
            <Col span={21}>
              首饰富有现代风格并带着优雅的摩纳哥气息， 设计灵感源自摩纳哥以及南法惬意悠然的乐活态度，是个深受爱戴的时尚首饰品牌。 凭着她对珠宝创作的满腔热枕，使品牌于珠宝界获得青睐、深受爱戴。
            </Col>
          </Row>
        </div>
        <div className={styles.hr} />
      </div>
    </div>
  );
};

orderDetail.propTypes = {

};


export default connect(({ myfamOrderCenter }) => ({
  myfamOrderCenter,
}))(orderDetail);

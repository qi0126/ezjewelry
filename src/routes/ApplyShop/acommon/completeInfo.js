import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './completeInfo.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;


class completeInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdLoading: false,
      cardTrueImg: '',
      cardFalseImg: '',
      shop: '无',
      country: 'China',
      introLength: 0,

      // 编辑方法begin
      backData: {}, // 编辑回填数据
      // 编辑方法end

      // 工作状态
      jobStatus: false,
      occupationVal: '',

      count: 0,

      // 当前步骤
      pageIndex: 0,

      // 第一次拿到数据
      dataFlag: true,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { dataFlag } = this.state;

    if (!dataFlag) {
      return;
    }
    if (nextProps.result.propsStatus) {
      console.log(nextProps.result);
      this.backDataEvent(nextProps.result);
      this.setState({
        dataFlag: false,
      });
    }
  }

  /**
   *  编辑方法begin
   */

  // 数据回填
  backDataEvent(options) {
    const refObj = JSON.stringify(options);
    const obj = JSON.parse(refObj);
    for (const i in obj) {
      this.setState({
        [i]: obj[i],
      });
    }
  }

  /**
   *  编辑方法end
   */

  vali(params) {
    // 公用验证begin
    if (!params.name) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.name.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.sex) {
      message.error('请输入性别');
      return false;
    }

    if (!params.addr && params.addr.toString().trim()) {
      message.error('请输入详细地址');
      return false;
    }

    if (params.phone) {
      if (!app.$v.verifyPhone(params.phone)) {
        message.error('请输入正确的固定电话');
        return false;
      }
    }


    if (params.email) {
      if (!app.$v.verifyEmail(params.email)) {
        message.error('邮箱格式不正确');
        return false;
      }
    }

    if (this.state.country === 'China') {
      if (!params.area) {
        message.error('请选择地址');
        return false;
      }
    }

    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      area: params.area ? params.area.join(',') : '',
      pic: `${this.state.cardTrueImg},${this.state.cardFalseImg}`,
      sname: params.sname ? params.sname : '无',
      occ: params.occ === '其它职业' ? params.occupationVal : params.occ,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });
    app.$api.shopStep1(params).then((res) => {
      this.props.comTrue(params);
      this.setState({ createdLoading: false });
    }).catch((err) => {
      this.setState({ createdLoading: false });
    });
  }

  // 获取身份证正面
  cartTrue(e) {
    const self = this;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      self.setState({
        cardTrueImg: res.data,
      });
      setTimeout(() => {
        self.setState({
          cardTrueImg: `${res.data}`,
        });
      }, 2000);
    });
  }

  // 获取身份证反面
  cartFalse(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardFalseImg: res.data,
      });
    });
  }

  // 获取logo
  changeLogo(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        logoImg: res.data,
      });
    });
  }

  // 改变店铺控制显示隐藏
  changeShop(e) {
    this.setState({
      shop: e.target.value,
    });
  }

  // 改变国家
  changeCountry(e) {
    this.setState({
      country: e,
    });
  }

  // 计算文字长度
  computeWord(e) {
    const val = e.target.value;
    this.setState({
      introLength: val && val.length,
    });
  }

  // 改变工作状态
  changeJobStatus(e) {
    this.setState({
      occ: e,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { occ, occupationVal } = this.state;
    return (
      <div className={styles.createShop} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          {/* 店铺申请进度 */}

          {/* 完善信息 */}
          <div className={`${styles.sAudit} ${styles.completeInfo}`} >
            <div className={styles.top}>
              <div className={`${styles.tit} ${styles.dot}`}>完善信息</div>
              <div className={styles.right} style={{ fontSize: 14 }}>请尽快完善您的个人信息，“<span>*</span>”为必填项</div>
            </div>


            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>姓名：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('name', { initialValue: this.state.backData.realName })(
                  <Input placeholder="请输入您的姓名" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>性别：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('sex', { initialValue: this.state.backData.sex || '男' })(
                  <RadioGroup >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>您所在的国家及地区：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('country', { initialValue: this.state.backData.country || 'China' })(
                  <Select style={{ width: 120 }} onChange={this.changeCountry.bind(this)}>
                    {app.$tool.country.map((item) => {
                      return <Option value={item.cityEndName} key={item.cityEndName}>{item.cityName}</Option>;
                    })}
                  </Select>,
              )}
                </FormItem>

                {this.state.country === 'China' && <FormItem style={{ marginLeft: '20px' }}>{getFieldDecorator('area', { initialValue: this.state.backData.region || '' })(
                  <Cascader options={app.$tool.city} style={{ border: '1px solid #d9d9d9' }} onChange={this.changeCity} placeholder="请选择省市区" />,
                  )}
                  </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>详细地址：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('addr', { initialValue: this.state.backData.addrDetail })(
                  <Input style={{ width: 400 }} placeholder="请输入您的详细地址" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>您目前的职业：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('occ', { initialValue: occ || '' })(
                  <Select style={{ width: 120 }} onChange={this.changeJobStatus.bind(this)}>
                    <Option value="">请选择</Option>
                    <Option value="珠宝设计师">珠宝设计师</Option>
                    <Option value="珠宝商">珠宝商</Option>
                    <Option value="网红" >网红</Option>
                    <Option value="博主">博主</Option>
                    <Option value="其它职业">其它职业</Option>
                  </Select>,
              )}
                </FormItem>
                {this.state.occ === '其它职业' && <FormItem >{getFieldDecorator('occupationVal', { initialValue: occupationVal })(
                  <Input style={{ border: '1px solid #eee', marginLeft: '20', width: 300 }} placeholder="请输入您的实体珠宝店名称" />,
              )}
                  </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>实体珠宝门店：</div>
              <div className={styles.right}>
                <RadioGroup value={this.state.shop} style={{ width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onChange={this.changeShop.bind(this)}>
                  <Radio value="无">无</Radio>
                  <Radio value={2}>有</Radio>
                </RadioGroup>
                {this.state.shop !== 2 ? null : <FormItem >{getFieldDecorator('sname', { initialValue: this.state.sname })(
                  <Input style={{ border: '1px solid #eee' }} placeholder="请输入您的实体店铺名称" />,
              )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>固定电话：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('phone', { initialValue: this.state.backData.phone })(
                  <Input placeholder="请输入您的固定电话" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.left}>邮箱：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('email', { initialValue: this.state.backData.email })(
                  <Input placeholder="请输入您的常用邮箱" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>身份证</div>
              <div className={styles.imgWrap}>

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}>
                    <label htmlFor="cardTrue">
                      {this.state.cardTrueImg ? (<img src={`${app.$http.imgURL}${this.state.cardTrueImg}`} alt="身份证正面照" />) : (<img src="./images/img-normal.png" alt="身份证正面照" />) }
                    </label>
                    {this.state.cardTrueImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证正面照</p>
                </div>
                <input type="file" id="cardTrue" onChange={this.cartTrue.bind(this)} style={{ display: 'none' }} />

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardFalse"><img src={this.state.cardFalseImg ? `${app.$http.imgURL}${this.state.cardFalseImg}` : './images/img-normal.png'} alt="身份证反面照" /></label>
                    {this.state.cardFalseImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证反面照</p>
                </div>
                <input type="file" id="cardFalse" onChange={this.cartFalse.bind(this)} style={{ display: 'none' }} />

              </div>
            </div>

          </div>
          <div className={styles.bottom}>
            <div className={styles.btn}>
              <FormItem>
                <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>下一步</Button>
              </FormItem>
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

completeInfo.propTypes = {

};

completeInfo.contextTypes = {
  router: PropTypes.object.isRequired,
};

const completeInfoFrom = Form.create()(completeInfo);


export default completeInfoFrom;

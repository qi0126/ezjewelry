import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './completeInfo.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class CompleteInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdLoading: false,
      country: 'China', // 国家
      changeBrand: '无', // 个人品牌
      mode: '手绘平面稿', // 设计
      cardTrueImg: '', // 身份证
      cardFalseImg: '', // 身份证

      // 编辑回填数据
      backData: {},

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
      // console.log(nextProps.result);
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

  changeSex(e) {
    this.state.params.sex = e.target.value;
    this.setState({
      params: this.state.params,
    });
  }

  changemode(e) {
    this.setState({
      mode: e.target.value,
    });
  }

  // 个人品牌
  changeBrand(e) {
    this.setState({
      changeBrand: e.target.value,
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

  // 改变国家
  changeCountry(e) {
    this.setState({
      country: e,
    });
  }

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
    // 公用验证end


    if (!params.headPic) {
      message.error('请上传您的头像');
      return false;
    }

    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();

    const otherParams = {
      area: params.region ? params.region.join(',') : '',
      headPic: this.state.logoImg,
      pic: `${this.state.cardTrueImg},${this.state.cardFalseImg}`,
      mode: params.mode !== 3 ? params.mode : params.modeValue,
      bname: params.bname ? params.bname : this.state.changeBrand,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });

    app.$api.designStep1(params).then((res) => {
      this.props.comTrue(params);
      this.setState({ createdLoading: false });
    }).catch((err) => {
      this.setState({ createdLoading: false });
    });
  }

  // 获取身份证正面
  cartTrue(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardTrueImg: res.data,
      });
    });
  }

  // 获取身份证反面
  cartFalse(e)　{
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardFalseImg: res.data,
      });
    });
  }

    // 计算文字长度
  computeWord(e) {
    const val = e.target.value;
    this.setState({
      introLength: val && val.length,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.createDesigner} >
        <Form onSubmit={this.handleSubmit.bind(this)}>

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

                {this.state.country === 'China' && <FormItem style={{ marginLeft: '20px' }}>{getFieldDecorator('region', { initialValue: this.state.backData.region || '' })(
                  <Cascader options={app.$tool.city} style={{ border: '1px solid #d9d9d9' }} onChange={this.changeCity} placeholder="请选择省市区" />,
                  )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>详细地址：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('addr', { initialValue: this.state.backData.addrDetail })(
                  <Input placeholder="请输入您的详细地址" />,
              )}
                </FormItem>
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
                  <div className={styles.imgBox}> <label htmlFor="cardTrue"><img src={this.state.cardTrueImg ? `${app.$http.imgURL}${this.state.cardTrueImg}` : './images/img-normal.png'} alt="毕业证书" /></label>
                    {this.state.cardTrueImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证正面照</p>
                </div>
                <input type="file" id="cardTrue" onChange={this.cartTrue.bind(this)} style={{ display: 'none' }} />

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardFalse"><img src={this.state.cardFalseImg ? `${app.$http.imgURL}${this.state.cardFalseImg}` : './images/img-normal.png'} alt="毕业证书" /></label>
                    {this.state.cardFalseImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证反面照</p>
                </div>
                <input type="file" id="cardFalse" onChange={this.cartFalse.bind(this)} style={{ display: 'none' }} />

              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>你的艺名</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('cname', { initialValue: this.state.backData.nickName })(
                  <Input placeholder="请输入您的艺名" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}  ${styles.alignSelf} ${styles.dot}  `} style={{ paddingTop: 20 }}>上传你的头像：</div>
              <div className={`${styles.right} ${styles.logo}`} >
                <label htmlFor="logo">
                  {this.state.logoImg ? <img className={styles.logoImg} src={`${app.$http.imgURL}${this.state.logoImg}`} alt="logo" /> : <img src="./images/img-normal2.png" alt="logo" />}
                </label>
                <input type="file" id="logo" onChange={this.changeLogo.bind(this)} style={{ display: 'none' }} />
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} `}>你的设计领域</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('field', { initialValue: this.state.backData.designField })(
                  <Input placeholder="请输入您的设计领域" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.left}>你是否拥有个人品牌</div>
              <div className={styles.right}>
                <RadioGroup value={this.state.changeBrand} style={{ width: '200px', display: 'flex', alignItems: 'center' }} onChange={this.changeBrand.bind(this)}>
                  <Radio value="无">还没有</Radio>
                  <Radio value={1}>有个人品牌</Radio>
                </RadioGroup>
                {this.state.changeBrand === '无' ? null : <FormItem >{getFieldDecorator('bname', { initialValue: this.state.brandName })(
                  <Input style={{ border: '1px solid #eee' }} placeholder="请输入品牌名称" />,
              )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>你常用的珠宝设计方式是</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('mode', { initialValue: this.state.mode })(
                  <RadioGroup onChange={this.changemode.bind(this)}>
                    <Radio value="手绘平面稿">手绘平面稿</Radio>
                    <Radio value="3D建模软件">3D建模软件</Radio>
                    <Radio value={3}>其它方式</Radio>
                  </RadioGroup>,
              )}
                </FormItem>
                {this.state.mode !== 3 ? null : <FormItem >{getFieldDecorator('modeValue', { initialValue: this.state.modeValue })(
                  <Input style={{ border: '1px solid #eee' }} placeholder="请输入设计方式" />,
              )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}  ${styles.alignSelf}`} style={{ paddingTop: 30 }} >个人介绍/品牌介绍：</div>
              <div className={`${styles.right} ${styles.textArea}`}>
                <div className={styles.text}>
                  <FormItem >{getFieldDecorator('desc', { initialValue: this.state.backData.introduce })(
                    <textarea onInput={this.computeWord.bind(this)} placeholder="请输入介绍内容" cols="30" rows="10" />,
              )}
                  </FormItem>
                </div>
                <p>({this.state.introLength}/200字节）</p>
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

CompleteInfo.propTypes = {

};

CompleteInfo.contextTypes = {
  router: PropTypes.object.isRequired,
};

const CompleteInfox = Form.create()(CompleteInfo);


export default CompleteInfox;

import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './CreateShop.less';

import CancelEdit from '../common/CancelEdit/CancelEdit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

// 城市格式示例
// const cityOptions = [{
//   value: 'zhejiang',
//   label: 'Zhejiang',
//   children: [{
//     value: 'hangzhou',
//     label: 'Hangzhou',
//     children: [{
//       value: 'xihu',
//       label: 'West Lake',
//     }],
//   }],
// }, {
//   value: 'jiangsu',
//   label: 'Jiangsu',
//   children: [{
//     value: 'nanjing',
//     label: 'Nanjing',
//     children: [{
//       value: 'zhonghuamen',
//       label: 'Zhong Hua Men',
//     }],
//   }],
// }];

class CreateShop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pwdSlide: false, // 密码显示隐藏
      createdLoading: false,
      cardTrueImg: '',
      cardFalseImg: '',
      headPic: '',
      shop: '无',
      country: 'China',
      introLength: 0,

      // 编辑方法begin
      backData: {}, // 编辑回填数据
      pageEdit: false, // 是否处于编辑页面
      editBtnStatu: false, // 编辑按钮是否显示
      editStatu: true, // 是否处于编辑状态
      // 编辑方法end

      // 工作状态
      jobStatus: false,
      occupationVal: '',

      count: 0,

      // 是否是审批状态
      auditStatu: false,
    };
  }

  componentDidMount() {
    this.backDataEvent();
  }

  // 判断是否是未审批状态 true未审批 false已审批
  getAuditStatu(options) {
    if (options.audit === 0 || options.audit === 1) {
      return true;
    }
    return false;
  }
  /**
   *  编辑方法begin
   */

  // 数据回填
  backDataEvent() {
    const { handle, backData } = this.props.location.state;
    if (handle === 'edit') {
      this.backDataHandle(backData);
      this.setState({
        editStatu: false,
        editBtnStatu: true,
        pageEdit: true,
        backData,
      });
    }
  }

  // 回填数据处理
  backDataHandle(options) {
    const { id, region, storeName, imgOne, country, headPic, introduce, occupation, account } = options;
    const otherData = {
      region: (region && typeof region === 'string') ? region.split(',') : region,
    };
    const cardImg = imgOne.split(',');
    Object.assign(options, otherData);
    // 回填图片处理
    this.setState({
      backAccount: account,
      id,
      auditStatu: this.getAuditStatu(options),
      country,
      introLength: introduce ? introduce.length : 0,
      shop: storeName !== '无' ? 2 : storeName,
      storeName: storeName !== '无' ? storeName : '',
      logoImg: headPic,
      cardTrueImg: cardImg[0],
      cardFalseImg: cardImg[1],
      occupation: occupation !== '珠宝设计师' && occupation !== '珠宝商' && occupation !== '网红' && occupation !== '博主' ? '其它职业' : occupation,
      occupationVal: occupation !== '珠宝设计师' && occupation !== '珠宝商' && occupation !== '网红' && occupation !== '博主' ? occupation : '',
      backData: options,
    }, () => {
      // console.log(this.state.backData, this.state);
    });
  }

  // 验证编辑密码方法
  pageEditValiPWD(params) {
    if (params.password && params.password.toString().trim()) {
      return true;
    }
    return false;
  }

  /**
   *  编辑方法end
   */

  // 验证密码
  inputPWd(e) {
    const option = e.target.value;
    app.$v.verifyPassword(option);
    // console.log(app.$v.verifyPassword(option));
  }

  vali(params) {
    // 新建状态
    if (!this.state.pageEdit) {
      // if (params.password !== params.password2) {
      //   message.error('两次输入密码不一致');
      //   return false;
      // }

      if (!app.$v.verifyMobile(params.account)) {
        message.error('帐号请输入手机格式');
        return false;
      }
    } else {
    // 编辑状态
      // if (this.pageEditValiPWD(params)) {
      //   if (params.password !== params.password2) {
      //     message.error('两次输入密码不一致');
      //     return false;
      //   }
      // }
    }

    // 公用验证begin
    if (!params.realName) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.realName.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.sex) {
      message.error('请输入性别');
      return false;
    }

    if (!params.addrDetail && params.addrDetail.toString().trim()) {
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

    if (!params.occupation) {
      message.error('请输入您目前的职业');
      return false;
    }

    if (this.state.country === 'China') {
      if (!params.region) {
        message.error('请选择地址');
        return false;
      }
    }
    // 公用验证end

    if (!params.nickName) {
      message.error('请输入店铺名称');
      return false;
    }

    return true;
  }

  backPage() {
    this.context.router.goBack();
  }

  handleSubmit(e) {
    e.preventDefault();

    const params = this.props.form.getFieldsValue();
    const otherParams = {
      region: params.region ? params.region.join(',') : '',
      headPic: this.state.logoImg,
      imgOne: `${this.state.cardTrueImg},${this.state.cardFalseImg}`,
      storeName: params.storeName ? params.storeName : '无',
      occupation: params.occupation === '其它职业' ? params.occupationVal : params.occupation,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });

    if (!this.state.pageEdit) {
      app.$api.shopAdd(params).then((res) => {
        this.setState({ createdLoading: false });
        message.success('店铺创建成功');
        this.context.router.goBack();
      }).catch((err) => {
        this.setState({ createdLoading: false });
      });
    } else {
      Object.assign(params, { id: this.state.backData.id });
      this.setPassWord(params);
      app.$api.shopUpdate(params).then((res) => {
        this.setState({ createdLoading: false });
        message.success('店铺修改成功');
        this.context.router.goBack();
      }).catch((err) => {
        this.setState({ createdLoading: false });
      });
    }
  }

  // 设置密码
  setPassWord(options) {
    if (!this.pageEditValiPWD(options)) {
      return;
    }
    const params = {
      phone: this.state.backAccount,
      pwd: options.password,
    };
    app.$api.userChangPwd2(params);
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

  // 改变编辑状态
  getEditStatu(e) {
    this.setState({
      editStatu: !e,
      editBtnStatu: e,
    });
  }

  // 取消编辑状态
  cancelEditStatu() {
    this.setState({
      editStatu: false,
      editBtnStatu: true,
    });
  }

  // 改变工作状态
  changeJobStatus(e) {
    this.setState({
      occupation: e,
    });
  }

  userExamine(e) {
    const { id } = this.state;
    const params = {
      id,
      statu: e,
    };
    app.$api.userExamine(params).then((res) => {
      // message.success('操作成功');
      if (e === 2) {
        message.success('审核通过');
      } else if (e === 3) {
        message.success('审核未通过');
      }
      this.backPage();
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { auditStatu, editStatu, pageEdit } = this.state;
    return (
      <div className={styles.createShop} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <CancelEdit cancelStatu editStatu={this.state.editBtnStatu} getEditStatu={this.getEditStatu.bind(this)} />
          {/* 店铺申请进度 */}
          <div className={`${styles.sAudit}`}>
            <div className={styles.top}>
              {this.state.pageEdit ? (<div className={styles.tit}>店铺帐号资料</div>) : (<div className={styles.tit}>创建店铺帐号</div>)}
            </div>

            <div className={styles.inWrap} >
              <div className={`${styles.left} ${!this.state.pageEdit && styles.dot}`}>账户名: <span style={{ fontSize: '12px' }} >(手机号格式)</span> </div>
              <div className={styles.right}>
                {!this.state.pageEdit ? (<FormItem >{getFieldDecorator('account', {})(
                  <Input disabled={!this.state.editStatu} style={{ width: 234 }} placeholder="请输入账户名称" />)}
                </FormItem>) : this.state.backAccount }
              </div>
            </div>

            <div className={styles.inWrap}>
              <div className={`${styles.left} ${!this.state.pageEdit && styles.dot}`}>密码：</div>
              <div className={styles.right}>
                {this.state.editStatu ? (<FormItem >{getFieldDecorator('password', {})(
                  <Input type={this.state.pwdSlide ? 'text' : 'password'} style={{ width: 234 }} onInput={this.inputPWd.bind(this)} placeholder="请输入密碼" />,
              )}
                </FormItem>) : ('************')}

                {this.state.editStatu && (<div style={{ marginLeft: '30px' }}> <img
                  className="cursor"
                  onClick={() => {
                    this.setState({
                      pwdSlide: !this.state.pwdSlide,
                    });
                  }}
                  src={this.state.pwdSlide ? './images/icon-showpwd.png' : './images/icon-hidepwd.png'}
                  alt="show"
                  width="20"
                />
                </div>)}

              </div>
            </div>

          </div>

          <div style={{ height: 10, weight: 10, background: '#f8f8f8' }} />

          {/* 完善信息 */}
          <div className={`${styles.sAudit} ${styles.completeInfo}`} >
            <div className={styles.top}>
              <div className={`${styles.tit}`} style={{ fontSize: 14 }}>个人信息</div>
              {/* <div className={styles.right} style={{ fontSize: 14 }}>请完善您的个人信息，“<span>*</span>”为必填项</div> */}
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>姓名：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('realName', { initialValue: this.state.backData.realName })(
                  <Input disabled={!this.state.editStatu} placeholder="请输入您的姓名" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>性别：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('sex', { initialValue: this.state.backData.sex || '男' })(
                  <RadioGroup disabled={!this.state.editStatu} >
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
                  <Select disabled={!this.state.editStatu} style={{ width: 120 }} onChange={this.changeCountry.bind(this)}>
                    {app.$tool.country.map((item) => {
                      return <Option value={item.cityEndName} key={item.cityEndName}>{item.cityName}</Option>;
                    })}
                  </Select>,
              )}
                </FormItem>

                {this.state.country === 'China' && <FormItem style={{ marginLeft: '20px' }}>{getFieldDecorator('region', { initialValue: this.state.backData.region || '' })(
                  <Cascader disabled={!this.state.editStatu} options={app.$tool.city} style={{ border: '1px solid #d9d9d9' }} onChange={this.changeCity} placeholder="请选择省市区" />,
                  )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>详细地址：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('addrDetail', { initialValue: this.state.backData.addrDetail })(
                  <Input disabled={!this.state.editStatu} style={{ width: 400 }} placeholder="请输入您的详细地址" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>您目前的职业：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('occupation', { initialValue: this.state.occupation || '' })(
                  <Select disabled={!this.state.editStatu} style={{ width: 120 }} onChange={this.changeJobStatus.bind(this)}>
                    <Option value="">请选择</Option>
                    <Option value="珠宝设计师">珠宝设计师</Option>
                    <Option value="珠宝商">珠宝商</Option>
                    <Option value="网红" >网红</Option>
                    <Option value="博主">博主</Option>
                    <Option value="其它职业">其它职业</Option>
                  </Select>,
              )}
                </FormItem>
                {this.state.occupation === '其它职业' && <FormItem >{getFieldDecorator('occupationVal', { initialValue: this.state.occupationVal })(
                  <Input disabled={!this.state.editStatu} style={{ border: '1px solid #eee', marginLeft: '20', width: 300 }} placeholder="请输入您目前的职业" />,
              )}
                </FormItem> }

              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>实体珠宝门店：</div>
              <div className={styles.right}>
                <RadioGroup disabled={!this.state.editStatu} value={this.state.shop} style={{ width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onChange={this.changeShop.bind(this)}>
                  <Radio value="无">无</Radio>
                  <Radio value={2}>有</Radio>
                </RadioGroup>
                {this.state.shop !== 2 ? null : <FormItem >{getFieldDecorator('storeName', { initialValue: this.state.storeName })(
                  <Input disabled={!this.state.editStatu} style={{ border: '1px solid #eee' }} placeholder={(!pageEdit || editStatu) ? '请输入您的实体店铺名称' : '暂未填写'} />,
              )}
                </FormItem> }
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>固定电话：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('phone', { initialValue: this.state.backData.phone })(
                  <Input disabled={!this.state.editStatu} placeholder={(!pageEdit || editStatu) ? '请输入您的固定电话' : '暂未填写'} />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.left}>邮箱：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('email', { initialValue: this.state.backData.email })(
                  <Input disabled={!this.state.editStatu} placeholder={(!pageEdit || editStatu) ? '请输入您的常用邮箱' : '暂未填写'} />,
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
                    {this.state.cardTrueImg && this.state.editStatu && (<div className={styles.delImg} onClick={() => { this.setState({ cardTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证正面照</p>
                </div>
                <input type="file" disabled={!this.state.editStatu} id="cardTrue" onChange={this.cartTrue.bind(this)} style={{ display: 'none' }} />

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardFalse"><img src={this.state.cardFalseImg ? `${app.$http.imgURL}${this.state.cardFalseImg}` : './images/img-normal.png'} alt="身份证反面照" /></label>
                    {this.state.cardFalseImg && this.state.editStatu && (<div className={styles.delImg} onClick={() => { this.setState({ cardFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证反面照</p>
                </div>
                <input type="file" disabled={!this.state.editStatu} id="cardFalse" onChange={this.cartFalse.bind(this)} style={{ display: 'none' }} />

              </div>
            </div>

          </div>

          <div className={`${styles.sAudit} ${styles.shopData}`} >
            <div className={styles.top}>
              <div className={styles.tit}>完善信息</div>
              {this.state.editStatu && (<div className={styles.right}>您所命名的店铺名称及logo只做临时申请，待平台审核后方可生效</div>) }
            </div>
            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`} >店铺名称：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('nickName', { initialValue: this.state.backData.nickName })(
                  <Input disabled={!this.state.editStatu} placeholder={(!pageEdit || editStatu) ? '请输入您的店铺名称' : '暂未填写'} />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}  ${styles.alignSelf}`} style={{ paddingTop: 20 }}>店铺logo：</div>
              <div className={`${styles.right} ${styles.logo} ${styles.imgItem}`} >

                <div className={styles.imgBox}> <label htmlFor="logo"><img className={styles.logoImg} src={this.state.logoImg ? `${app.$http.imgURL}${this.state.logoImg}` : './images/img-normal2.png'} alt="logo" /></label>
                  {this.state.logoImg && this.state.editStatu && (<div className={styles.delImg} onClick={() => { this.setState({ logoImg: '' }); }}><span>-</span></div>)}</div>

                {/* <label htmlFor="logo">
                 {this.state.logoImg ? <img className={styles.logoImg} src={`${app.$http.imgURL}${this.state.logoImg}`} alt="logo" /> : <img src="./images/img-normal2.png" alt="logo" />}
                </label> */}

                <input type="file" disabled={!this.state.editStatu} id="logo" onChange={this.changeLogo.bind(this)} style={{ display: 'none' }} />
                {this.state.editStatu && (<p>请上传格式为JPG或png格式的图片，大小3Mb以内</p>)}
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.alignSelf}`} style={{ paddingTop: 30 }} >店铺介绍：</div>
              <div className={`${styles.right} ${styles.textArea}`}>
                <div className={styles.text}>
                  <FormItem >{getFieldDecorator('introduce', { initialValue: this.state.backData.introduce })(
                    <textarea onInput={this.computeWord.bind(this)} disabled={!this.state.editStatu} maxLength="300" placeholder={(!pageEdit || editStatu) ? '请输入店铺介绍信息......' : '暂未填写'} cols="30" rows="10" />,
              )}
                  </FormItem>
                </div>
                <p>({this.state.introLength}/300字节）</p>
              </div>
            </div>

          </div>

          <div className={styles.bottom}>
            {/* pageEdit true 编辑页面 false 新建页面 */}
            {/* editStatu true 编辑状态 false 未编辑状态  */}
            {/* auditStatu true  未审核 false 已审核状态 */}
            <div className={styles.btn}>
              {/* {pageEdit ? 1 : 0}
              {auditStatu ? 1 : 0}
              {editStatu ? 1 : 0} */}

              {/* 新建页面 */}
              {!pageEdit && <p onClick={this.cancelEditStatu.bind(this)}>取消</p>}
              {!pageEdit && (<Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>完成创建</Button>)}

              {/* 未审核状态 */}
              {pageEdit && auditStatu && !editStatu && (<Button type="primary" size="large" style={{ marginRight: 20 }} onClick={this.userExamine.bind(this, 3)} loading={this.state.createdLoading}>拒绝通过</Button>)}
              {pageEdit && auditStatu && !editStatu && (<Button type="primary" size="large" onClick={this.userExamine.bind(this, 2)} loading={this.state.createdLoading}>审核通过</Button>)}
              {/* 未审核状态编辑 */}
              {pageEdit && auditStatu && editStatu && <p onClick={this.cancelEditStatu.bind(this)}>取消编辑</p>}
              {pageEdit && auditStatu && editStatu && <Button type="primary" disabled={!this.state.editStatu} size="large" htmlType="submit" loading={this.state.createdLoading}>保存</Button>}

              {/* 已审核状态 */}
              {/* 已审核状态编辑 */}
              {pageEdit && !auditStatu && editStatu && <p onClick={this.cancelEditStatu.bind(this)}>取消编辑</p>}
              {pageEdit && !auditStatu && editStatu && (<Button type="primary" disabled={!this.state.editStatu} size="large" htmlType="submit" loading={this.state.createdLoading}>保存</Button>)}
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

CreateShop.propTypes = {

};

CreateShop.contextTypes = {
  router: PropTypes.object.isRequired,
};

const CreateShopFrom = Form.create()(CreateShop);


export default CreateShopFrom;

import React from 'react';
import { Input, Button, Checkbox, Form, message, Modal } from 'antd';
import styles from './ShopInfo.less';
import PropTypes from 'prop-types';
import app from 'app';
import { join } from 'redux-saga/effects';

const { TextArea } = Input;
const FormItem = Form.Item;

class ShopInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: { str: '' },
      shopName: 'EZJEWELPY',
      advertise: '至臻至简，向自然美态致敬；',
      banner: '',
      remark: '',
      goldList: [],
      info: '海瑞温斯顿珠宝设计团队在皇家花园系列(royal gardens)的创作过程中，被发表过的珍贵设计草图，其中包括跟随了海瑞温斯顿先生长达40余年的首席珠宝设计师辛德先生(mr. ambaji v. shinde)的创造手稿。他的创作灵感源自于大自然万物最原始纯真的天然美感，就如花草树木的生活轮廓及优雅流畅的天然形态。时至今日，大自然依然是海瑞温斯顿历久不衰的灵感缪斯，通过珠宝设计团队与技艺精湛的工匠协力合作，雕琢出颗颗璀璨的宝石，更使这些稀世珍宝能随着佩戴者举手投足的光影流动，绽放出绚烂夺目的光彩',
    };
  }

  componentDidMount() {
    app.$api.userMyInfo().then((res) => {
      const data = res.data;
      this.setState({
        shopName: data.nickName ? data.nickName : 'EZJEWELPY',
        advertise: data.advertise ? data.advertise : '至臻至简，向自然美态致敬；',
        banner: data.banner,
        remark: data.introduce ? data.introduce : this.state.introduce,
        result: data,
      });
    });

    app.$api.selectHotgunStoreProduct().then((res) => {
      this.setState({
        goldList: res.data,
      });
    });
  }

    // 获取背景
  changeBg(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        banner: res.data,
      });
    });
  }
  // EZJEWELPY
  // 至臻至简，向自然美态致敬；
  goShop() {
    app.$storage.set('urlHistory', '/myShop/myShopFinishProduct');
    app.$storage.set('urlHistoryTwo', '/myShop/myShopFinishProduct');
    this.context.router.push('/myShop/myShopFinishProduct');
  }

  changeName(e) {
    this.setState({
      shopName: e.target.value,
    });
  }

  vali(params) {
    return true;
  }

  saveShop(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    Object.assign(params, { banner: this.state.banner });

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });
    app.$api.shopEdit(params).then((res) => {
      this.setState({ createdLoading: false });
      message.success('创建成功');
    }).catch((err) => {
      this.setState({ createdLoading: false });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.shopInfo} >
        <Form onSubmit={this.saveShop.bind(this)} >
          <div className={styles.sAudit}>
            <div className={styles.top}>
              <div className={styles.tit}>店铺信息 <span>更改或升级店铺首页内容</span></div>
            </div>

            {this.state.result.str && (<div className={styles.oneList}>
              {/* <div className={styles.oLeft}>店铺二维码:</div> */}
              <div className={styles.oRight}>
                <img src={this.state.result.str} alt="店铺二维码" style={{ width: 140, height: 140, marginLeft: '-24px' }} />
                <div className={`${styles.orRight}`}>
                  <p>扫一扫二维码，进入小程序店铺</p>
                  <p>您可将二维码转发给更多的人关注您的店铺</p>
                </div>
              </div>
            </div>)}

            <div className={styles.content} style={{ marginTop: 28 }} >
              <div className={styles.left}>
                {this.state.banner && <img className={styles.lBanner} src={`${app.$http.imgURL}${this.state.banner}`} width="500" height="651" alt="banner" />}
                <div className={styles.cLeft}>
                  <img className={styles.lPack} src="./images/img-pack.png" width="500" alt="bg" />
                  <div className={styles.clEZJ}>
                    <div className={`${styles.shopNameInfo} `}>
                      <FormItem >{getFieldDecorator('shopName', { initialValue: this.state.shopName })(
                        <Input onChange={this.changeName.bind(this)} />)}
                      </FormItem>
                    </div>
                    <div className={`${styles.advertiseInfo}`}>
                      <FormItem >{getFieldDecorator('advertise', { initialValue: this.state.advertise })(
                        <Input />)}
                      </FormItem>
                    </div>
                  </div>

                  <div className={`${styles.remarkInfo}`}>
                    <span className={styles.rName}>{this.state.shopName}</span>
                    <span className={styles.rInfo}>
                      <FormItem >{getFieldDecorator('remark', { initialValue: this.state.remark })(
                        <TextArea
                          style={{ width: '90%', height: '387px', background: 'transparent', border: '1px solid red' }}
                        />)}
                      </FormItem>
                    </span>
                  </div>
                  {this.state.goldList.map((item) => {
                    return (
                      <div className={`${styles.recommendInfo}`} style={{ marginTop: '30px' }} key={item.productId}>
                        <div className={styles.reImg}>
                          <img src={`${app.$http.imgURL}${item.productImageUrl}`} alt="示例" />
                        </div>
                        <div className={styles.reTit}>{item.productName}</div>
                        <div className={styles.reExtend}> {item.textureNumber.split(',').join('  |  ')} </div>
                        <div className={styles.reBtn}> > Buy Now </div>
                      </div>
                    );
                  })}

                  {this.state.goldList.length === 0 && (<div className={`${styles.recommendInfo}`}>
                    <div className={styles.reImg}>
                      <img src="./images/img-shopxxxxx.jpg" alt="示例" />
                      <div className={styles.reImgExample}>示例款式</div>
                    </div>
                    <div className={styles.reTit}>Serpenti灵蛇耳环耳饰崇自然的设计洋溢极致灵动</div>
                    <div className={styles.reExtend}> K金 <span>|</span> PT950 </div>
                    <div className={styles.reBtn}> > Buy Now </div>
                    </div>)}

                  {this.state.goldList.length >= 10 && <div className={`${styles.noRecomm}`}>您可添加 <span>10</span> 款 [甄选推荐] 款式</div>}
                </div>
              </div>

              <div className={styles.right}>
                <div className={`${styles.shopName} ${styles.hrLeft} ${styles.ft18}`}>
                店铺名称
              </div>
                <div className={`${styles.advertise} ${styles.hrLeft} ${styles.ft18}`}>
                  <span>店铺广告宣传语</span>
                  <span className={styles.adsmall}>（16字以内）</span>
                </div>
                <div className={`${styles.banner} ${styles.hrLeft} ${styles.ft18}`}>
                  <div >店铺形象banner图</div>
                  <label htmlFor="bg"> <div className={styles.customBtn} style={{ margin: '10px 0' }}>选择图片</div> </label>
                  <input id="bg" type="file" onChange={this.changeBg.bind(this)} />
                  <span className={styles.basmall}>（请选择大小为1000KB以内， 格式为jpg,png的图片）</span>
                </div>
                <div className={`${styles.remark} ${styles.hrLeft} ${styles.ft18}`}>
                  <div>店铺介绍</div>
                  <div style={{ fontSize: '12px' }}>（200字以内）</div>
                </div>
                <div className={`${styles.recommend} ${styles.hrLeft} ${styles.ft18}`}>
                  <span className={styles.recTop}>新品/热卖/推荐板块</span>
                  <span className={styles.recInfo}>
                    <div>可前往: <a onClick={this.goShop.bind(this)}><span style={{ color: 'red', textDecoration: 'underline' }}>“产品管理”</span></a>  选择更换</div>
                    <div>[ 甄选推荐 ]款式</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.hr} />
          <div className={styles.bottom}>
            <div className={styles.btn}>
              <div className={styles.cancal}>取消更改</div>
              <Button style={{ marginLeft: '35px' }} type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>保存店铺设置</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

ShopInfo.propTypes = {

};

ShopInfo.contextTypes = {
  router: PropTypes.object.isRequired,
};

const ShopInfoFrom = Form.create()(ShopInfo);

export default ShopInfoFrom;

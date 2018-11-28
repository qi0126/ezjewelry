import React from 'react';
import { connect } from 'dva';
import styles from './Me.less';
import app from 'app';


class Me extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: {
        imgOne: ',',
      },
    };
  }

  componentDidMount() {
    app.$api.userMyInfo().then((res) => {
      if (res.data.roleType === 'SHOP') {

      } else if (res.data.roleType === 'DESIGNER') {
        res.data.imgList = `${res.data.imgTwo},${res.data.imgThree},${res.data.imgFour}`;
        res.data.imgList = res.data.imgList.split(',');
        res.data.imgList = res.data.imgList.filter((item) => {
          return item !== '';
        });

      } else if (res.data.roleType === 'FACTORY') {

      } else if (res.data.roleType === 'SYS') {

      }
      // 转换国家
      if (res.data.country) {
        app.$tool.country.forEach((item) => {
          if (item.cityEndName === res.data.country) {
            res.data.country = item.cityName;
          }
        });
      }
      this.setState({
        result: res.data,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.result.roleType === 'SHOP' && <div className={styles.me}>
          <div className={styles.datumWrap}>
            <div className={styles.tit}>我的资料</div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>姓名:</p>
                <p className={styles.value}>{this.state.result.realName}</p>
                <p className={styles.name}>性别:</p>
                <p className={styles.value}>{this.state.result.sex}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>手机号:</p>
                <p className={styles.value}>{this.state.result.account}</p>
                <p className={styles.name}>邮箱:</p>
                <p className={styles.value}>{this.state.result.email ? this.state.result.email : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>实体珠宝门店:</p>
                <p className={styles.value}>{this.state.result.storeName}</p>
                <p className={styles.name}>您目前的职业:</p>
                <p className={styles.value}>{this.state.result.occupation ? this.state.result.occupation : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>您目前所在地区:</p>
                <p className={styles.value}>{this.state.result.country} {this.state.result.region}</p>
                <p className={styles.name}>详细地址:</p>
                <p className={styles.value}>{this.state.result.addrDetail}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>固定联系电话:</p>
                <p className={styles.value}>{this.state.result.phone}</p>
                <p className={styles.name} />
                <p className={styles.value} />
              </div>
            </div>
          </div>

          {this.state.result.imgOne.split(',')[0] && (<div className={styles.imgCol}>
            <div className={styles.imgTop}>身份证件</div>
            <div className={styles.imgWrap}>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[0]}`} alt="身份证件正面" />
              </div>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[1]}`} alt="身份证件反面" />
              </div>
            </div>
          </div>) }

          <div className={styles.shopDatumWrap}>
            <div className={styles.tit}>店铺资料</div>
            <div className={styles.oneList}>
              <p className={styles.oLeft}>店铺名称:</p>
              <p className={styles.oRight}>{this.state.result.nickName}</p>
            </div>

            {this.state.result.headPic && (<div className={styles.oneList}>
              <p className={styles.oLeft}>店铺logo:</p>
              <p className={styles.oRight}><img src={`${app.$http.imgURL}${this.state.result.headPic}`} alt="店铺logo正面" style={{ width: 100, height: 100 }} /></p>
            </div>)}

            {this.state.result.str && (<div className={styles.oneList}>
              <div className={styles.oLeft}>店铺二维码:</div>
              <div className={styles.oRight}>
                <img src={this.state.result.str} alt="店铺二维码" style={{ width: 140, height: 140, marginLeft: '-24px' }} />
                <div className={`${styles.orRight}`}>
                  <p>扫一扫二维码，进入小程序店铺</p>
                  <p>您可将二维码转发给更多的人关注您的店铺</p>
                </div>
              </div>
            </div>)}

            {this.state.result.introduce && (<div className={styles.oneList}>
              <p className={styles.oLeft}>店铺介绍:</p>
              <p className={styles.oRight}>{this.state.result.introduce}</p>
            </div>)}

          </div>
        </div>}

        {this.state.result.roleType === 'DESIGNER' && <div className={styles.me}>
          <div className={styles.datumWrap}>
            <div className={styles.tit}>我的资料</div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>姓名:</p>
                <p className={styles.value}>{this.state.result.realName}</p>
                <p className={styles.name}>性别:</p>
                <p className={styles.value}>{this.state.result.sex ? this.state.result.sex : '无'}</p>
              </div>
            </div>

            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>手机号:</p>
                <p className={styles.value}>{this.state.result.account}</p>
                <p className={styles.name}>邮箱:</p>
                <p className={styles.value}>{this.state.result.email ? this.state.result.email : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>设计师领域:</p>
                <p className={styles.value}>{this.state.result.designField ? this.state.result.designField : '无'}</p>
                <p className={styles.name}>个人品牌:</p>
                <p className={styles.value}>{this.state.result.brandName ? this.state.result.brandName : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>设计珠宝方式:</p>
                <p className={styles.value}>{this.state.result.designMode ? this.state.result.designMode : '无'}</p>
                <p className={styles.name}>设计师艺名:</p>
                <p className={styles.value}>{this.state.result.nickName ? this.state.result.nickName : '无'}</p>
              </div>
            </div>

            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>您目前所在地区:</p>
                <p className={styles.value}>{this.state.result.country} {this.state.result.region}</p>
                <p className={styles.name}>详细地址:</p>
                <p className={styles.value}>{this.state.result.addrDetail}</p>
              </div>
            </div>

            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>固定联系电话:</p>
                <p className={styles.value}>{this.state.result.phone}</p>
                <p className={styles.name} />
                <p className={styles.value} />
              </div>
            </div>

            {this.state.result.headPic && (<div className={styles.oneList}>
              <p className={styles.oLeft}>设计师头像:</p>
              <p className={styles.oRight}><img src={`${app.$http.imgURL}${this.state.result.headPic}`} alt="" width="100" height="100" /></p>
            </div>)}

            {this.state.result.introduce && (<div className={styles.oneList}>
              <p className={styles.oLeft}>个人介绍/品牌介绍:</p>
              <p className={styles.oRight}>{this.state.result.introduce}</p>
            </div>)}

          </div>

          {this.state.result.imgOne.split(',')[0] && (<div className={styles.imgCol}>
            <div className={styles.imgTop}>身份证件</div>
            <div className={styles.imgWrap}>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[0]}`} alt="身份证件正面" />
              </div>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[1]}`} alt="身份证件反面" />
              </div>
            </div>
          </div>) }

          <div className={styles.imgCol}>
            <div className={styles.imgTop}>证书及作品</div>
            <div className={styles.imgWrap}>
              {this.state.result.imgList.map((item, index) => {
                return <div className={styles.imgItem} key={index} ><img src={`${app.$http.imgURL}${item}`} alt="证书及作品" /></div>;
              })}
            </div>
          </div>
        </div>}

        {this.state.result.roleType === 'FACTORY' && <div className={styles.me}>
          <div className={styles.datumWrap}>
            <div className={styles.tit}>我的资料</div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>姓名:</p>
                <p className={styles.value}>{this.state.result.realName}</p>
                <p className={styles.name}>性别:</p>
                <p className={styles.value}>{this.state.result.sex}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>手机号:</p>
                <p className={styles.value}>{this.state.result.account}</p>
                <p className={styles.name}>邮箱:</p>
                <p className={styles.value}>{this.state.result.email ? this.state.result.email : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>供应商生产类型:</p>
                <p className={styles.value}>{this.state.result.produceType}</p>
                <p className={styles.name} >公司名称:</p>
                <p className={styles.value}>{this.state.result.nickName}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>您目前所在地区:</p>
                <p className={styles.value}>{this.state.result.country} {this.state.result.region}</p>
                <p className={styles.name}>详细地址:</p>
                <p className={styles.value}>{this.state.result.addrDetail}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>固定联系电话:</p>
                <p className={styles.value}>{this.state.result.phone}</p>
                <p className={styles.name} />
                <p className={styles.value} />
              </div>
            </div>
          </div>

          {this.state.result.imgOne.split(',')[0] && (<div className={styles.imgCol}>
            <div className={styles.imgTop}>身份证件</div>
            <div className={styles.imgWrap}>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[0]}`} alt="身份证件正面" />
              </div>
              <div className={styles.imgItem}>
                <img src={`${app.$http.imgURL}${this.state.result.imgOne.split(',')[1]}`} alt="身份证件反面" />
              </div>
            </div>
          </div>) }

        </div>}

        {this.state.result.roleType === 'SYS' && (<div className={styles.me}>
          <div className={styles.datumWrap}>
            <div className={styles.tit}>我的资料</div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>姓名:</p>
                <p className={styles.value}>{this.state.result.realName}</p>
                <p className={styles.name}>性别:</p>
                <p className={styles.value}>{this.state.result.sex ? this.state.result.sex : '无' }</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>手机号:</p>
                <p className={styles.value}>{this.state.result.account}</p>
                <p className={styles.name}>邮箱:</p>
                <p className={styles.value}>{this.state.result.email ? this.state.result.email : '无'}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name} >公司名称:</p>
                <p className={styles.value}>{this.state.result.nickName ? this.state.result.nickName : '无'}</p>
                <p className={styles.name} />
                <p className={styles.value} />
              </div>
            </div>
            {/* <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>您目前所在地区:</p>
                <p className={styles.value}>{this.state.result.country} {this.state.result.region}</p>
                <p className={styles.name}>详细地址:</p>
                <p className={styles.value}>{this.state.result.addrDetail}</p>
              </div>
            </div>
            <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>固定联系电话:</p>
                <p className={styles.value}>{this.state.result.phone}</p>
                <p className={styles.name} />
                <p className={styles.value} />
              </div>
            </div> */}
          </div>
        </div>) }


      </div>
    );
  }
}

Me.propTypes = {

};

export default connect()(Me);

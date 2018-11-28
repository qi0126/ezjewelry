import React from 'react';
import PropTypes from 'prop-types';
import styles from './batarMain.less';

const batarMian = ({ products }) => {
  return (
    <div className={styles.mainWrap}>
      {products}
    </div>
  );
};

batarMian.PropTypes = {
  products: PropTypes,
};

export default batarMian;

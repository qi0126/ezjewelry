export default {
  namespace: 'applyShopComplete',
  state: {
    jobCustomShow: 1,
    params: {
      sex: 1,
      shop: 1,
    },
  },
  reducers: {
    changeSex(state, { payload: status }) {
      state.params.sex = status;
      return Object.assign({}, state);
    },

    changeShop(state, { payload: status }) {
      state.params.shop = status;
      return Object.assign({}, state);
    },
  },
};



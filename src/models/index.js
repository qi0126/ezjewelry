
export default {

  namespace: 'globalIndex',

  state: {
    platAccountProps: {},
    bbbb: 222,
  },

  reducers: {
    // 平台管理账号管理数据
    platAccountSave(state, { payload: obj }) {
      return Object.assign({}, state, { platAccountProps: obj });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'save' });
    },
  },


};


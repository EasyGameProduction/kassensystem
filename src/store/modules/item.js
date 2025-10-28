export default {
  namespaced: true,
  state: () => ({
    height: 100,
    width: 220,
    titleSize: 18,
    priceSize: 15,
  }),
  mutations: {
    SET_HEIGHT(state, px) {state.height = px; },
    SET_TITLE_SIZE(state, px) {state.titleSize = px; },
    SET_PRICE_SIZE(state, px) {state.priceSize = px; },
    SET_WIDTH(state, px) {state.width = px; },
  }
};

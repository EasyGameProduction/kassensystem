export default {
  namespaced: true,
  state: () => ({
    height: 100,
    width: 220,
    titleSize: 18,
    priceSize: 15,
    heightP: 100,
    widthP: 220,
    titleSizeP: 18,
    priceSizeP: 15,
  }),
  mutations: {
    SET_HEIGHT(state, px) {state.height = px; },
    SET_TITLE_SIZE(state, px) {state.titleSize = px; },
    SET_PRICE_SIZE(state, px) {state.priceSize = px; },
    SET_WIDTH(state, px) {state.width = px; },

    SET_HEIGHTP(state, px) {state.heightP = px; },
    SET_TITLE_SIZEP(state, px) {state.titleSizeP = px; },
    SET_PRICE_SIZEP(state, px) {state.priceSizeP = px; },
    SET_WIDTHP(state, px) {state.widthP = px; },
  }
};

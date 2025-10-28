// store/index.js
import { createStore } from 'vuex';
import kasse from './modules/kasse';
import item from './modules/item';
import merge from 'lodash.merge'; // <-- das ist das kleine Paket

const store = createStore({
  modules: { kasse, item }
});

const savedStateRaw = localStorage.getItem('vuex-state');
if (savedStateRaw) {
  try {
    const savedState = JSON.parse(savedStateRaw);
    store.replaceState(merge({}, store.state, savedState));
  } catch (e) {
    console.warn('Gespeicherten State konnte nicht geladen werden:', e);
  }
}

store.subscribe((mutation, state) => {
  localStorage.setItem('vuex-state', JSON.stringify(state));
});

export default store;

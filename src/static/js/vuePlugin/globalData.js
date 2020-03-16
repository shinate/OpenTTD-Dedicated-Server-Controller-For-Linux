import { merge } from 'lodash';

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$$data', {
            get: function () {
                return this.$root.$data
            }
        })
        Vue.prototype.$commitData = function (data = {}) {
            merge(this.$$data, data)
        }
    }
}
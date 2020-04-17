import { merge, set, get, isObject } from 'lodash';

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$$data', {
            get() {
                return this.$root.$data;
            },
            set(data) {
                this.$root.$data = data;
            }
        });

        Vue.prototype['$commitData'] = function (source, path = null) {
            let original;

            if (path) {
                original = get(this.$$data, path);
            } else {
                original = this.$$data;
            }
            if (isObject(original)) {
                merge(original, source);
            } else {
                set(this.$$data, path, source);
            }
        };
    }
}
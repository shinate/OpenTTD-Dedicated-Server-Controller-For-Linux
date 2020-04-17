export default {
    install(Vue) {
        Object.defineProperty(Vue, 'uniqueID', {
            get: function () {
                return `${(+new Date)}${parseInt(Math.random() * 1000)}`;
            }
        });
        Object.defineProperty(Vue.prototype, '$uniqueID', Object.getOwnPropertyDescriptor(Vue, 'uniqueID'));
    }
};
import '../style/main.scss';
import ServerHUB from './vueComponents/ServerHUB';
import globalData from './vuePlugin/globalData';
import uniqueID from './vuePlugin/uniqueID';
import io from './vuePlugin/io';
import { cloneDeep, merge } from 'lodash';

/* global Vue */

Vue.use(io);
Vue.use(globalData);
Vue.use(uniqueID);

const app = new Vue({
    data      : {
        servers: {}
    },
    created() {
        this.$io.connect(() => {
            this.$mount('#app');
        });
    },
    beforeMount() {
        this.$io.receive('servers', data => {
            this.servers = cloneDeep(data);
        });
        this.$io.receive('push', data => {
            merge(this.servers, data);
        });
        this.$io.receive('start', data => {
            merge(this.servers, data);
        });
        this.$io.receive('stop', data => {
            merge(this.servers, data);
        });
        this.$io.send('servers');
    },
    components: {
        ServerHUB
    }
});

window.app = app;

// document.querySelector('#test-server').addEventListener('click', function (e) {
//     e.preventDefault();
//     let el = this;
//
//     client.emit('start server', {name: 'test'});
// }, false)
import '../style/main.scss';
import ServerHUB from './vueComponents/ServerHUB';
import globalData from './vuePlugin/globalData';
import uniqueID from './vuePlugin/uniqueID';

Vue.use(globalData);
Vue.use(uniqueID);

const app = new Vue({
    data      : {
        servers: {}
    },
    beforeMount() {
        client.on('REP', (data) => {
            this.servers = data;
        });
        client.emit('REQ', {CMD: 'servers'});
    },
    components: {
        ServerHUB
    }
});


const client = io('/socket');

client.on('connect', (socket) => {
    console.log(client.id);

    client.on('REP', function (data) {
        console.log('REP', data);
    });

    app.$mount('#app');
});

window.client = client;

// document.querySelector('#test-server').addEventListener('click', function (e) {
//     e.preventDefault();
//     let el = this;
//
//     client.emit('start server', {name: 'test'});
// }, false)
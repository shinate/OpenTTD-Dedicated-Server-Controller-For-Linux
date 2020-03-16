const client = io('/socket');

client.on('news', function (data) {
    console.log(data);
});

document.querySelector('#test-server').addEventListener('click', function (e) {
    e.preventDefault();
    let el = this;

    client.emit('start server', {name: 'test'});
}, false)
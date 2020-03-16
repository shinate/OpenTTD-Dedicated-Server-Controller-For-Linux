<template>
    <b-button>{{ server.name }}</b-button>
</template>

<script>
    export default {
        props  : ['server'],
        data   : function () {
            return {
                server: this.props.server
            }
        },
        beforeMount() {
            client.on('REP', data => {
                this.servers = data;
            });
        },
        methods: {
            listServers() {
            }
        }
    }
</script>

<style scoped>

</style>
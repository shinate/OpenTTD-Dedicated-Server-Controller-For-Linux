<template>
    <b-container v-if="servers">
        <b-row>
            <b-col v-for="server in servers" :key="server.name">
                <open-t-t-d-servers :server="server"></open-t-t-d-servers>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import OpenTTDServers from './OpenTTDServers';

    export default {
        components: {
            OpenTTDServers
        },
        props     : ['servers']
    }
</script>
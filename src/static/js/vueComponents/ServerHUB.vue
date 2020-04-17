<template>
    <b-container class="pt-5" v-if="servers">
        <b-row cols="1" cols-lg="2" cols-md="2" cols-sm="1" cols-xl="3">
            <b-col class="mb-3" v-for="server in servers" v-if="server" :key="server.name">
                <open-t-t-d-server :server="server"></open-t-t-d-server>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import OpenTTDServer from './OpenTTDServer';

    export default {
        props     : ['servers'],
        components: {
            OpenTTDServer
        }
    }
</script>
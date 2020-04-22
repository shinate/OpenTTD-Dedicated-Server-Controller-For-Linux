<template>
    <b-card
            no-body
            :header-bg-variant="supTitle.type"
            :header="`server/${supTitle.text}`"
            header-text-variant="white">
        <template v-slot:header>
            <b-row class="flex-nowrap">
                <b-col>{{ `server/${server.name}` }}{{ server.stats.config ?
                    `:${server.configContent.network.server_port}` : '' }}
                </b-col>
            </b-row>
        </template>
        <b-card-body>
            <h6>
                {{ title }}
            </h6>
            <p v-if="server.stats.config">
                {{ server.configContent.version.version_string }} ({{ server.configContent.version.version_number }})
            </p>
            <p v-else>
                <b-badge variant="danger">Invalid config file</b-badge>
            </p>
            <p v-if="lastSave">
                {{ lastSave.file }}
                <b-badge v-if="lastSave.auto" variant="success">auto</b-badge>
                <b-button class="save-more" variant="light" size="sm" @click="showAllSaves">...</b-button>
                <b-modal ref="savesPanel" body-class="p-0" scrollable centered>
                    <template v-slot:modal-header>
                        <h6>{{ title }}</h6>
                    </template>
                    <b-list-group flush>
                        <b-list-group-item v-for="save in server.saves" :key="$unique"
                                           class="d-flex justify-content-between align-items-center">
                            {{ save.file }}
                            <b-button variant="success" :disabled="server.stats.code !== 1" size="sm"
                                      @click="start(save)">start
                            </b-button>
                        </b-list-group-item>
                    </b-list-group>
                    <template v-slot:modal-footer="{ hide }">
                        <b-button size="sm" variant="secondary" @click="hide()">CLOSE</b-button>
                    </template>
                </b-modal>
            </p>
        </b-card-body>
        <template v-slot:footer>
            <b-row class="flex-nowrap">
                <b-col class="d-flex align-items-center">
                    <b-list-group v-if="server.process" horizontal class="ml-1">
                        <b-list-group-item>CPU:{{ CPU }}</b-list-group-item>
                        <b-list-group-item>MEM:{{ MEM }}</b-list-group-item>
                    </b-list-group>
                </b-col>
                <b-col cols="auto">
                    <b-button-group class="controller">
                        <b-button
                                variant="start"
                                size="sm"
                                @click="start"
                                :disabled="server.stats.code !== 1">
                            <b-icon icon="play-fill" font-scale="2"></b-icon>
                        </b-button>
                        <b-button
                                variant="save"
                                size="sm"
                                @click="save"
                                :disabled="server.stats.code !== 2">
                            <b-icon icon="inboxes-fill" font-scale="2"></b-icon>
                        </b-button>
                        <b-button
                                variant="stop"
                                size="sm"
                                @click="stop"
                                :disabled="server.stats.code !== 2 && server.stats.code !== 3">
                            <b-icon icon="stop-fill" font-scale="2"></b-icon>
                        </b-button>
                    </b-button-group>
                </b-col>
            </b-row>
        </template>
    </b-card>
</template>

<script>
    import fileSize from 'file-size';
    import { round } from 'lodash';

    export default {
        props   : {
            server: {
                default: function () {
                    return {};
                }
            }
        },
        data    : function () {
            return {
                name: this.server.name
            }
        },
        computed: {
            lastSave() {
                return this.server.saves.length > 0 ? this.server.saves[0] : null;
            },
            title() {
                return this.server.configContent.hasOwnProperty('network') && this.server.configContent.network.server_name || this.server.name
            },
            supTitle() {

                let type = 'secondary';

                switch (this.server.stats.code) {
                    case 1:
                        type = 'info';
                        break;
                    case 2:
                        type = 'success';
                        break;
                    case 3:
                        type = 'warning';
                        break;
                }

                return {
                    type,
                    text: this.server.name
                }
            },
            CPU() {
                if (this.server.process) {
                    return `${round(this.server.process.cpu * 100, 2)}%`
                }

                return null;
            },
            MEM() {
                if (this.server.process) {
                    return fileSize(this.server.process.memory).human('jedec')
                }

                return null;
            }
        },
        methods : {
            start(withSave = null) {
                let params = { name: this.name };
                if (withSave) {
                    params = { ...params, ...withSave };
                }
                this.$io.send('start', { params });
            },
            stop() {
                this.$io.send('stop', { params: { name: this.name } });
            },
            save() {
                this.$io.send('save', { params: { name: this.name } });
            },
            showAllSaves() {
                this.$refs['savesPanel'].show();
            }
        }
    }
</script>

<style lang="scss" scoped>

    .card {
        border-radius: 0;
        border: 0 none;
        box-shadow: 0 3px 8px -4px rgba(0, 0, 0, 0.75);

        .card-header, .card-footer {
            border-radius: 0;
            border: 0 none;
        }

        .card-header {
            font-size: .75rem;
            padding-top: .2rem;
            padding-bottom: .2rem;
        }

        .card-footer {
            font-size: .75rem;
            padding: 0;

            .list-group-item {
                padding: 0 .25rem;
            }
        }

        .card-body {
            p {
                font-size: .75rem;
            }
        }
    }

    .controller {
        > .btn {
            border-radius: 0;
            border: 0 none;
            padding: 0 .1rem;
            box-shadow: none;

            /*&.btn-start, &.btn-stop {*/
            /*    background-color: transparent;*/
            /*    color: #cccccc;*/
            /*}*/

            background-color: transparent;
            color: #cccccc;

            &.btn-start {
                &:hover {
                    color: #18bf15;
                    text-shadow: 0 0 3px #18bf15;
                }
            }

            &.btn-stop {
                &:hover {
                    color: #b8151c;
                    text-shadow: 0 0 3px #b8151c;
                }
            }

            &.btn-save {
                font-size: .5rem;

                &:hover {
                    color: #2c64b8;
                    text-shadow: 0 0 3px #2c64b8;
                }
            }

            &.disabled, &:disabled {
                opacity: .25;

                /*&.btn-start, &.btn-stop {*/
                &:hover {
                    color: #cccccc !important;
                }

                /*}*/
            }

        }
    }

    .save-more {
        font-size: .75rem;
        padding: 0 .5rem 0.25rem;
        margin-top: -.25rem;
        line-height: 1;
    }

    .saves-panel {
        padding: 0;
    }
</style>
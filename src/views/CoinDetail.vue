<template>
    <div class="flex-col">
        <div class="flex justify-center">
            <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100"></bounce-loader>
        </div>
        <template v-if="!isLoading">
            <div class="flex flex-col sm:flex-row justify-around items-center">
                <div class="flex flex-col items-center">
                    <img
                        class="w-20 h-20 mr-5"
                        :src="
                            `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
                        "
                        :alt="asset.name"
                    />
                    <h1 class="text-5xl">
                        {{ asset.name }}
                        <small class="sm:mr-2 text-gray-500">
                            {{
                            asset.symbol
                            }}
                        </small>
                    </h1>
                </div>

                <div class="my-10 flex flex-col">
                    <ul>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Ranking</b>
                            <span>#{{ asset.rank }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
                            <span>{{ asset.priceUsd | dollar }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
                            <span>{{ min | dollar }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
                            <span>{{ max | dollar }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
                            <span>{{ avg | dollar }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
                            <span>{{ asset.changePercent24Hr | percent }}</span>
                        </li>
                    </ul>
                </div>

                <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
                    <button
                        @click="toggleConverted"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >{{fromUsd ? `USD A ${asset.symbol}`: `${asset.symbol} a USD`}}</button>

                    <div class="flex flex-row my-5">
                        <label class="w-full" for="convertValue">
                            <input
                                v-model="convertValue"
                                id="convertValue"
                                type="number"
                                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                :placeholder="`Valor en ${fromUsd ? 'USD': asset.symbol}`"
                            />
                        </label>
                    </div>

                    <span class="text-xl">{{covertResult}} {{fromUsd ? asset.symbol : 'USD'}}</span>
                </div>
            </div>
            <line-chart
                class="my-10"
                :colors="['orange']"
                :min="min"
                :max="max"
                :data="
                    history.map(h => [
                        h.date,
                        parseFloat(h.priceUsd).toFixed(2)
                    ])
                "
            />

            <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
            <table>
                <tr
                    class="border-b"
                    v-for="market in markets"
                    :key="`${market.exchangeId}-${market.priceUsd}`"
                >
                    <td>
                        <b>{{market.exchangeId}}</b>
                    </td>
                    <td>{{market.priceUsd | dollar}}</td>
                    <td>{{market.baseSymbol}} / {{market.quoteSymbol}}</td>
                    <td>
                        <px-button
                            :isLoading="market.isLoading || false"
                            v-if="!market.url"
                            @custom-click="getWebsite(market)"
                        >
                            <slot>Obtener Link</slot>
                        </px-button>
                        <a
                            v-else
                            class="hover:underline text-green-600"
                            target="_blank"
                            :href="market.url"
                        >{{market.url}}</a>
                    </td>
                </tr>
            </table>
        </template>
    </div>
</template>

<script>
import PxButton from '@/components/PxButton';
import api from '@/api';

export default {
    name: 'CoinDetail',
    components: {
        PxButton
    },
    data() {
        return {
            asset: {},
            history: [],
            markets: [],
            isLoading: false,
            fromUsd: true,
            convertValue: null
        };
    },
    watch: {
        $route() {
            this.getCoin();
        }
    },
    computed: {
        /**
         * Get min price value
         */
        min() {
            return Math.min(
                ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
            );
        },

        /**
         * Get max price velua
         */
        max() {
            return Math.max(
                ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
            );
        },

        /**
         * Get average price value
         */
        avg() {
            return Math.abs(
                ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
            );
        },
        /**
         * Get conversation
         */
        covertResult() {
            if (!this.convertValue) return 0;

            const result = this.fromUsd
                ? this.convertValue / this.asset.priceUsd
                : this.convertValue * this.asset.priceUsd;
            return result.toFixed(4);
        }
    },
    created() {
        this.getCoin();
    },
    methods: {
        /**
         * Get coin detail an history
         */
        getCoin() {
            this.isLoading = true;
            const coinId = this.$route.params.id;
            Promise.all([
                api.getAsset(coinId),
                api.getAssetHistory(coinId),
                api.getMarkets(coinId)
            ])
                .then(([asset, history, markets]) => {
                    this.asset = asset;
                    this.history = history;
                    this.markets = markets;
                })
                .finally(() => (this.isLoading = false));
        },

        /**
         * Get Website exchange
         * @param exchange
         */
        getWebsite(exchange) {
            this.$set(exchange, 'isLoading', true);
            return api
                .getEchange(exchange.exchangeId)
                .then(res => {
                    // Registrar dato agregado al objeto exchange y asi notificarle a Vue de esta nueva propiedad
                    this.$set(exchange, 'url', res.exchangeUrl);
                })
                .finally(() => {
                    this.$set(exchange, 'isLoading', false);
                });
        },

        /**
         * Change conversatio type
         */
        toggleConverted() {
            this.fromUsd = !this.fromUsd;
        }
    }
};
</script>

<style scoped>
td {
    padding: 10px;
    text-align: center;
}
</style>

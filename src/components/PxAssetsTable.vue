<template>
    <table>
        <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-400">
                <th></th>
                <th :class="{up: this.sortOrder === 1, down: this.sortOrder === -1}">
                    <span class="underline cursor-pointer" @click="changeSortOrder">Ranking</span>
                </th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cap. de Mercado</th>
                <th>Variación 24hs</th>
                <td class="hidden sm:block">
                    <input
                        class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
                        type="text"
                        id="filter"
                        placeholder="Buscar"
                        v-model="filter"
                    />
                </td>
            </tr>
        </thead>
        <tbody>
            <tr
                class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
                v-for="asset in filteresAssets"
                :key="asset.id"
            >
                <td>
                    <img
                        class="h-8 w-8"
                        :src="
                            `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
                        "
                        :alt="asset.name"
                    />
                </td>
                <td>
                    <b># {{ asset.rank }}</b>
                </td>
                <td>
                    <router-link
                        class="hover:underline text-green-600"
                        :to="{name: 'coin-detail', params: {id: asset.id}}"
                    >{{ asset.name }}</router-link>
                    <small class="ml-1 text-gray-500">{{asset.symbol}}</small>
                </td>
                <td>{{ asset.priceUsd | dollar }}</td>
                <td>{{ asset.marketCapUsd | dollar }}</td>
                <td
                    :class="
                        asset.changePercent24Hr.includes('-')
                            ? 'text-red-600'
                            : 'text-green-600'
                    "
                >{{ asset.changePercent24Hr | percent }}</td>
                <td class="hidden sm:block">
                    <px-button @custom-click="goToCoinDetail(asset.id)">
                        <span>Detalle</span>
                    </px-button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import PxButton from '@/components/PxButton';

export default {
    name: 'PxAssetsTable',
    components: {
        PxButton
    },
    data() {
        return {
            filter: '',
            sortOrder: 1
        };
    },
    props: {
        assets: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        filteresAssets() {
            const altOrder = this.sortOrder === 1 ? -1 : 1;

            return this.assets
                .filter(
                    asset =>
                        asset.name
                            .toLowerCase()
                            .includes(this.filter.toLowerCase()) ||
                        asset.symbol
                            .toLowerCase()
                            .includes(this.filter.toLowerCase())
                )
                .sort((a, b) => {
                    if (parseInt(a.rank) > parseInt(b.rank))
                        return this.sortOrder;

                    return altOrder;
                });
        }
    },
    methods: {
        /**
         * Go to coin detail component
         * @param id Coin ID
         */
        goToCoinDetail(id) {
            this.$router.push({ name: 'coin-detail', params: { id } });
        },

        /**
         * Change order
         */
        changeSortOrder() {
            this.sortOrder = this.sortOrder === 1 ? -1 : 1;
        }
    }
};
</script>

<style scoped>
.up::before {
    content: '👆';
}

.down::before {
    content: '👇';
}

td {
    padding: 20px 0px;
    font-size: 0.6rem;
    text-align: center;
}

th {
    padding: 5px;
    font-size: 0.6rem;
}

@media (min-width: 640px) {
    td,
    th {
        padding: 20px;
        font-size: 1rem;
    }

    th {
        padding: 12px;
    }
}
</style>

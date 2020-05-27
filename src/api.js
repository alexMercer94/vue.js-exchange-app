const url = 'https://api.coincap.io/v2';

/**
 * Get all coins
 */
function getAssets() {
    return fetch(`${url}/assets?limit=20`)
        .then(res => res.json())
        .then(res => res.data);
}

/**
 * Get coin detail by id
 * @param {*} coinId Coin ID
 */
function getAsset(coinId) {
    return fetch(`${url}/assets/${coinId}`)
        .then(res => res.json())
        .then(res => res.data);
}

/**
 * Get coin history
 */
function getAssetHistory(coin) {
    const now = new Date();
    const end = now.getTime();
    now.setDate(now.getDate() - 1);
    const start = now.getTime();

    return fetch(
        `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
    )
        .then(res => res.json())
        .then(res => res.data);
}

/**
 * Get coin's markets
 * @param {*} coin Coin ID
 */
function getMarkets(coin) {
    return fetch(`${url}/assets/${coin}/markets?limit=5`)
        .then(res => res.json())
        .then(res => res.data);
}

/**
 * Get exchange of a coin
 * @param {*} id Coin id
 */
function getEchange(id) {
    return fetch(`${url}/exchanges/${id}`)
        .then(res => res.json())
        .then(res => res.data);
}

export default {
    getAssets,
    getAsset,
    getAssetHistory,
    getMarkets,
    getEchange
};

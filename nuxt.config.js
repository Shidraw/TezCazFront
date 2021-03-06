export default {
    ssr: false,
    target: 'static',
    head: {
        title: "Tezos Casino",
        meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
        ]
    },
    modules: [
        "bootstrap-vue/nuxt",
        '@nuxtjs/axios',
    ],
    env: {
        CONTRACT_LOTO: 'KT1FtAYbrYFYmJB2CkcLAU9TCRTfiyh1L2eF',
        CONTRACT_ROULETTE: 'KT1CUjWjhZCCVvSJdNz5ULta64jUKHjAX6o5'
    },
    plugins:[
        '~/plugins/notify'
    ],
    axios: {
        baseURL: 'http://localhost:3001'
    },
};

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
        CONTRACT_ROULETTE: 'KT1QGEPXZzXavDJ6P4y5eX5P4RbCKs3TRPq2'
    },
    plugins:[
        '~/plugins/notify'
    ],
    axios: {
        baseURL: 'http://localhost:3001'
    },
};

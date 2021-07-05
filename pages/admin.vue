<template>
  <div>
    <div class="row">
        <div class="col-6">
            <h1>Loto</h1>
            <button @click="launchLoto">Lancer Loto</button>
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <h1>Roulette</h1>
            <button @click="launchRoulette">Lancer Roulette</button>
        </div>
    </div>
  </div>
</template>



<script>
    import { TempleWallet } from "@temple-wallet/dapp";
    import { TezosToolkit } from "@taquito/taquito";

    export default {
        data() {
            return {
                Tezos:null,
                storage_history_roulette: null,
                balance_history_roulette: null,
            }
        },
        methods: {
            async launchLoto() {
                let $vm = this
                let randomNumber = Math.floor(Math.random() * 1001)
                const wallet = new TempleWallet("TezosCasino");
                await wallet.connect("edo2net");
                this.Tezos.setWalletProvider(wallet);
                const contract = await this.Tezos.wallet.at(process.env.CONTRACT_LOTO);
                const operation = await contract.methods.startLoto(randomNumber).send();
                await operation.confirmation(1);
            },
            async launchRoulette() {
                let $vm = this
                let randomNumber = Math.floor(Math.random() * 37)
                const wallet = new TempleWallet("TezosCasino");
                await wallet.connect("edo2net");
                this.Tezos.setWalletProvider(wallet);
                const contract = await this.Tezos.wallet.at(process.env.CONTRACT_ROULETTE);
                const operation = await contract.methods.startRoulette(randomNumber.toString()).send();
                await operation.confirmation(1);
            }
        },
        async mounted () {
            var axiosInstance = this.$axios.create({
                baseURL: '',
                headers: {'X-Custom-Header': 'foobar'}
            });

            let $vm = this
            $vm.Tezos = new TezosToolkit("https://edonet.smartpy.io");
            const available = await TempleWallet.isAvailable();
            if (!available) {
                throw new Error("Thanos Wallet not installed");
            }
            const wallet = new TempleWallet("TezosCasino");
            await wallet.connect("edo2net");
            $vm.Tezos.setWalletProvider(wallet);

            // TENTATIVES DE RECUP D'INFOS
            $vm.storage_history_roulette = await axiosInstance.get('https://api.edo2net.tzkt.io/v1/contracts/'+process.env.CONTRACT_ROULETTE+'/storage/history')
            console.log("STORAGE HISTORY ROULETTE DATA BETS")
            console.log($vm.storage_history_roulette.data)
            let temp = $vm.storage_history_roulette.data
            console.log(temp[0].value.bets)
            //this.storage_history_roulette = this.storage_history_roulette.data
            $vm.balance_history_roulette = await axiosInstance.get('https://api.edo2net.tzkt.io/v1/accounts/'+process.env.CONTRACT_ROULETTE+'/balance_history')
            console.log("BALANCE HISTORY ROULETTE DATA")
            let temp2 = $vm.balance_history_roulette.data.reverse()
            console.log((temp2[0].balance/1000000).toFixed(2))
            //this.balance_history_roulette = this.balance_history_roulette.data
            $vm.balance_history_roulette = temp2
        },
    };
</script>
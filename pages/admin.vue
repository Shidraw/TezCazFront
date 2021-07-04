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
            let $vm = this
            $vm.Tezos = new TezosToolkit("https://edonet.smartpy.io");
            const available = await TempleWallet.isAvailable();
            if (!available) {
                throw new Error("Thanos Wallet not installed");
            }
            const wallet = new TempleWallet("TezosCasino");
            await wallet.connect("edo2net");
            $vm.Tezos.setWalletProvider(wallet);
        },
    };
</script>
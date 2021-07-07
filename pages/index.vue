<template>
  <div class="container mt-2">
        <h1>Bienvenue sur TezCaz !</h1>
            <div class="row">
                <div class="col-8">
                    <h6 class="opacity-7 text-uppercase font-weight-bolder text-sm fadeIn1 fadeInBottom">Comment jouer ?</h6>
                    <p class="pe-sm-5 me-sm-5 fadeIn1 fadeInBottom">
                        Notre Casino comporte deux jeux :
                        <br>- Un Loto
                        <br>- Une Roulette  
                    </p>
                    <p class="fadeIn1 fadeInBottom">
                        Pour jouer à l'un de ces deux jeux, il vous suffit de cliquer sur l'un ou sur l'autre depuis la barre de navigation.
                    </p>
                </div>
        </div>
  </div>
</template>

<script>
    import { TempleWallet } from "@temple-wallet/dapp";
    import { TezosToolkit } from "@taquito/taquito";

    export default {
    middleware:"connexion",
        data() {
            return {
                Tezos:null,
                form: {
                    name: ''
                }
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
            const accountPkh = await wallet.getPKH();
            const balance = await this.Tezos.tz.getBalance(accountPkh);
        },
    };
</script>
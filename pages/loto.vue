<template>
  <div>
    <div class="row">
        <div class="col-6">
            <h1>Loto</h1>
            <input type="numeric" v-model="form.number">
            <input type="numeric" v-model="form.betValue">
            <button @click="bet">Transaction</button>
        </div>
    </div>
  </div>
</template>

<script>
    import { TempleWallet } from "@temple-wallet/dapp";
    import { TezosToolkit } from "@taquito/taquito";
    import * as signalR from '@microsoft/signalr'

    export default {
        data() {
            return {
                Tezos:null,
                form: {
                    number: 1,
                    betValue: 2
                }
            }
        },
        methods: {
            async bet() {
                let $vm = this
                const wallet = new TempleWallet("TezosCasino");
                await wallet.connect("edo2net");
                this.Tezos.setWalletProvider(wallet);
                const contract = await this.Tezos.wallet.at(process.env.CONTRACT_LOTO);
                const operation = await contract.methods.bet($vm.form.number).send({amount:$vm.form.betValue});
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
            const accountPkh = await wallet.getPKH();

            

            const connection = new signalR.HubConnectionBuilder()
                  .withUrl("https://api.edo2net.tzkt.io/v1/events")
                  .build();
            async function init() {
                await connection.start();
                // Ecoute des opérations du contrat LOTO
                await connection.invoke("SubscribeToOperations", {
                    address: process.env.CONTRACT_LOTO,
                    types: 'transaction'
                });
            }

            var axiosInstance = this.$axios.create({
                baseURL: '',
                headers: {'X-Custom-Header': 'foobar'}
            });
            
            connection.onclose(init);
            connection.on("operations", async (msg) => {
                // Pour chaque opération on vérifie si la méthode startLoto a été call, puis on vérifie si le joueur connecté a gagné
                console.log(msg)
                if (msg.data !== undefined) {
                    let transaction = msg.data[0]
                    if (transaction.parameter.entrypoint === 'startLoto') {
                        let myBet = null
                        let storage_history_loto = await axiosInstance.get('https://api.edo2net.tzkt.io/v1/contracts/'+process.env.CONTRACT_LOTO+'/storage/history')
                        for (let index = 0; index < storage_history_loto.data[1].value.players.length; index++) {
                            const elem = storage_history_loto.data[1].value.players[index]
                            if (elem.addr === accountPkh) {
                                myBet = elem.value
                            }
                        }
                        if (myBet !== null) {
                            if(myBet === transaction.parameter.value) {
                                $vm.$toast.open({
                                    message: 'Vous avez gagné ! Le numéro gagnant est le <b>' + transaction.parameter.value + '</b>',
                                    type: 'info',
                                    position: 'top',
                                    duration: 15000
                                });
                            } else {
                                $vm.$toast.open({
                                    message: 'Vous avez perdu, le numéro gagnant est le <b>' + transaction.parameter.value + '</b>',
                                    type: 'info',
                                    position: 'top',
                                    duration: 15000
                                });
                            }
                        }
                    }
                }            
            });
            init()
        },
    };
</script>
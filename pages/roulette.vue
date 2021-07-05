<template>
    <div class="container">
        <h1>Roulette</h1>
        <div class="row">
            <div class="col-4">
                <div class="form-group text-left">
                    <label for="betType">Type de mise</label>
                    <select class="form-control" id="betType" v-model="form.betType">
                        <option value="0">Couleur</option>
                        <option value="1">Chiffre</option>
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group text-left">
                    <label for="">Votre choix</label>
                    <select class="form-control" id="betNumber" v-model="form.number" :disabled="form.betType===null" v-if="form.betType==1">
                        <option v-for="(n, i) in 37" :value="i" v-bind:key="i">{{ i }}</option>
                    </select>
                    <select class="form-control" id="betType" v-model="form.number" v-if="form.betType==0">
                        <option value="0">Rouge</option>
                        <option value="1">Noir</option>
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group text-left">
                    <label for="">Montant de la mise</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" v-model="form.betValue" disabled>
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon1">ꜩ</span>
                        </div>
                    </div>
                </div>
               
            </div>
            <button type="button" class="btn btn-primary" @click="bet">Transaction</button>
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
                    betType: null,
                    number: null,
                    betValue: 1
                }
            }
        },
        methods: {
            async bet() {
                let $vm = this
                const wallet = new TempleWallet("TezosCasino");
                await wallet.connect("edo2net");
                this.Tezos.setWalletProvider(wallet);
                const contract = await this.Tezos.wallet.at(process.env.CONTRACT_ROULETTE);
                const operation = await contract.methods.bet($vm.form.betType, $vm.form.number).send({amount:$vm.form.betValue});
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
                // Ecoute des opérations du contrat ROULETTE
                await connection.invoke("SubscribeToOperations", {
                    address: process.env.CONTRACT_ROULETTE,
                    types: 'transaction'
                });
            }

            var axiosInstance = this.$axios.create({
                baseURL: '',
                headers: {'X-Custom-Header': 'foobar'}
            });
            
            connection.onclose(init);
            connection.on("operations", async (msg) => {
                // Pour chaque opération on vérifie si la méthode startROULETTE a été call, puis on vérifie si le joueur connecté a gagné
                console.log("Message :")
                console.log(msg)
                if (msg.data !== undefined) {
                    let transaction = msg.data[0]
                    console.log("Msg.data[0]")
                    console.log(msg.data[0])
                    if (transaction.parameter.entrypoint === 'startRoulette') {
                        let transaction2 = msg.data[1]
                        console.log("Msg.data[1]")
                        console.log(transaction2)
                        console.log(transaction2.target)
                        if (msg.data[1] !== null) { 
                            console.log("Ma public key Tezos :")
                            console.log(accountPkh)
                            console.log(transaction2.target.address)
                            if(transaction2.target.address === accountPkh) {
                                $vm.$toast.open({
                                    message: 'Vous avez gagné !',
                                    type: 'info',
                                    position: 'top',
                                    duration: 15000
                                });
                            } else {
                                $vm.$toast.open({
                                    message: 'Vous avez perdu !',
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
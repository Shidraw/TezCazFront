<template>
    <div class="container mt-5">
        <h1>Roulette</h1>
        <Card type="simple" title="Roulette">
                        <div class="card-body pb-0">
                            <div class="row">
                                <div class="col-8">
                                    <h6 class="opacity-7 text-uppercase font-weight-bolder text-sm fadeIn1 fadeInBottom">Comment jouer ?</h6>
                                    <p class="pe-sm-5 me-sm-5 fadeIn1 fadeInBottom">
                                        La roue est composée de 37 numéros (0 à 36) et chaque numéro possède une couleur associée rouge ou noir, vert pour le 0.
                                    </p>
                                    <p class="fadeIn1 fadeInBottom">
                                        Dans ce jeu, la mise est fixe à 1ꜩ mais vous pouvez miser sur une ou plusieurs probabilités.
                                        <br>Vous allez donc parier sur la ou les cases sur lesquelles pourrait s'arrêter les billes.
                                        <br>Voici les règles concernant les mises :
                                    </p>
                                    <div class="fadeIn1 fadeInBottom">
                                        <ul>
                                            <li>Si vous misez sur un chiffre de 1 à 36 vous remportez 20 fois votre mise.</li>
                                            <li>Si vous misez sur une couleur et que la bille tombe dessus vous remportez 2 fois votre mise.</li>
                                            <li>La roulette est lancée par l'administrateur du Casino.</li>
                                        </ul>    
                                    </div>
                                </div>
                            </div>
                        </div>
        </Card>
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
                },
                red: [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35 ],
                black: [ 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 ]
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
                        if (msg.data[1] !== undefined) { 
                            let transaction2 = msg.data[1]
                            console.log("Msg.data[1]")
                            console.log(transaction2)
                            console.log("Ma public key Tezos :")
                            console.log(accountPkh)
                            console.log(transaction2.target.address)
                            console.log(transaction.parameter.value)
                            console.log($vm.form.number)
                            let redTest = $vm.red.indexOf(transaction.parameter.value)
                            console.log("Recherche dans tableau red")
                            console.log(redTest)
                            let blackTest = $vm.black.indexOf(transaction.parameter.value)
                            console.log("Recherche dans tableau black")
                            console.log(blackTest)
                            if((transaction2.target.address === accountPkh && redTest != -1 && $vm.form.number == 0) || (transaction2.target.address === accountPkh && blackTest != -1 && $vm.form.number == 1) ) {
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
            });
            init()
        },
    };
</script>
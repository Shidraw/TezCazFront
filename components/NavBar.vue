<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand href="#">TezCaz</b-navbar-brand>
    <b-navbar-nav>
      <nuxt-link class="nav-link text-danger" to="/admin">
        Admin
      </nuxt-link>
      <li class="nav-item px-3">
          <nuxt-link class="nav-link text-info" to="/loto">
              Loto
          </nuxt-link>
      </li>
      <li class="nav-item px-3">
          <nuxt-link class="nav-link text-info" to="/roulette">
              Roulette
          </nuxt-link>
      </li>
      <b-nav-item :href="'https://better-call.dev/edo2net/'+ wallet" target="_blank">{{wallet}}</b-nav-item>
      <b-nav-item href="#">{{balance}}</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
  import { TempleWallet } from "@temple-wallet/dapp";
  import { TezosToolkit } from "@taquito/taquito";

  export default {
    data() {
      return {
        Tezos: null,
        wallet: null,
        balance: null
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
      $vm.wallet = await wallet.getPKH();
      $vm.balance = parseFloat(await this.Tezos.tz.getBalance($vm.wallet)/1000000).toFixed(2);
    },
  }
</script>

<template>
  <div class="container mt-5">
    <div class="row">
        <div class="col-4"><input type="text" v-model="form.login" placeholder="Login" name="" id=""></div>
        <div class="col-4"><input type="password" v-model="form.password" placeholder="password" name="" id=""></div>
    </div>
    <div class="row">
        <div class="col-12">
            <button @click="login" type="button" class="btn btn-primary">Se connecter</button>
            <nuxt-link to="/register">S'enregistrer</nuxt-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    layout:"login",
    data() {
        return {
            form: {
                login: '',
                password: '',
            }
        }
    },
    methods: {
        async login() {
            if(this.form.password !== '' && this.form.login !== '') {
                let login = await this.$axios.$post('login', this.form)
                console.log(login)
                let account = login[0]
                if (account) {
                    this.$store.dispatch('setAccount', account);
                    this.$router.push('/')
                }
            }
        }
    },
}
</script>

<style>

</style>
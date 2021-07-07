<template>
  <div class="container mt-5">
    <div class="row">
        <div class="col-4"><input type="text" v-model="form.login" placeholder="Login" name="" id=""></div>
        <div class="col-4"><input type="password" v-model="form.password" placeholder="password" name="" id=""></div>
        <div class="col-4"><input type="password" v-model="form.confirmation_password" placeholder="password" name="" id=""></div>
    </div>
    <div class="row">
        <div class="col-12">
            <button @click="register" type="button" class="btn btn-primary">S'enregistrer</button>
            <nuxt-link to="/login">Se connecter</nuxt-link>
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
                confirmation_password: ''
            }
        }
    },
    methods: {
        async register() {
            if(this.form.password === this.form.confirmation_password) {
                let register = await this.$axios.$post('register', this.form)
                console.log(register)
                if(register === "ok") {
                    let account = await this.$axios.$post('login', this.form)
                    this.$store.dispatch('setAccount', account[0]);
                    this.$router.push('/')
                }
            }
        }
    },
}
</script>

<style>

</style>
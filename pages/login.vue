<template>
  <div class="container mt-2">
    <main class="form-signin">
    <form>
        <h1 class="h3 mb-3 fw-normal">Veuillez vous connecter</h1>

        <div class="form-floating">
        <label for="floatingInput">Login</label>
        <input type="text" class="form-control" id="floatingInput" v-model="form.login" placeholder="Votre login">
        </div>
        <div class="form-floating">
        <label for="floatingPassword">Password</label>
        <input type="password" class="form-control" id="floatingPassword" v-model="form.password" placeholder="Votre mot de passe">
        </div>

        <div class="ad mb-3">
        </div>
        <button @click="login" class="w-100 btn btn-lg btn-primary" type="button">Se connecter</button>
        <div class="register mb-5">
            <nuxt-link to="/register">Pas de compte ? Inscrivez-vous</nuxt-link>
        </div>
    </form>
    </main>
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
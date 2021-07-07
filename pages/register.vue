<template>
  <div class="container mt-2">
    <main class="form-signin">
        <div class="mt-4">
            <b-card img-src="https://image.freepik.com/vecteurs-libre/creation-logo-mascotte-casino_142989-268.jpg" img-alt="Card image" img-left class="mb-3">
                <b-card-text>
                    <form>
                        <h1 class="h3 mb-3 fw-normal">Veuillez vous inscrire</h1>

                        <div class="form-floating">
                        <label for="floatingInput">Login</label>
                        <input type="text" class="form-control" id="floatingInput" v-model="form.login" placeholder="Votre login">
                        </div>
                        <div class="form-floating">
                        <label for="floatingPassword">Password</label>
                        <input type="password" class="form-control" id="floatingPassword" v-model="form.password" placeholder="Votre mot de passe">
                        </div>
                        <div class="form-floating">
                        <label for="floatingPasswordConfirm">Password</label>
                        <input type="password" class="form-control" id="floatingPasswordConfirm" v-model="form.confirmation_password" placeholder="Confirmation de mot de passe">
                        </div>

                        <div class="ad mb-3">
                        </div>
                        <button @click="register" class="w-100 btn btn-lg btn-primary" type="button">S'inscrire</button>
                        <div class="register mb-5">
                            <nuxt-link to="/login">Déjà un compte ? Connectez-vous</nuxt-link>
                        </div>
                    </form>
                </b-card-text>
            </b-card>
        </div>
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
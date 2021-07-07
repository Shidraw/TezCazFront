export default function ({ store, redirect }) {
    if (store.state.account === null) {
      return redirect('/login')
    }
  }
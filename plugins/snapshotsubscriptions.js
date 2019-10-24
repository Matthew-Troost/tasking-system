export default ({ store }) => {
  store.dispatch("projects/getAll")
  store.dispatch("users/getAll")
}

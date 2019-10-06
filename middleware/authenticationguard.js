export default function({ store, route, redirect }) {
  // If the user is not authenticated
  const unauthorized_routes = [
    "/authentication/login",
    "/authentication/register"
  ]

  if (
    store.getters["users/current_user"] == null &&
    !unauthorized_routes.includes(route.fullPath)
  ) {
    return redirect("/authentication/login")
  }
}

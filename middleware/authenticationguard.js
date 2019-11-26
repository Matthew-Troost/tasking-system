export default function({ store, route, redirect }) {
  // If the user is not authenticated
  const unauthorized_routes = [
    "/authentication/login",
    "/authentication/register"
  ]

  if (
    !store.state.users.current_user &&
    !unauthorized_routes.includes(route.fullPath)
  ) {
    return redirect("/authentication/login")
  }

  switch (route.fullPath) {
    case "":
    case "/":
      return redirect("/overview")
  }
}

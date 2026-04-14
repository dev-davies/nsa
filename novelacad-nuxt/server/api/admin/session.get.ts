
export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  if (!session.data?.adminLoggedIn) {
    return { loggedIn: false }
  }
  return {
    loggedIn: true,
    username: session.data.adminUsername,
    role: session.data.adminRole,
  }
})


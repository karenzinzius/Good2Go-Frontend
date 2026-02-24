export const getUser = () => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    console.warn('Invalid user in localStorage, clearing it.')
    localStorage.removeItem('user')
    return null
  }
}

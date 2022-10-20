const API_URL = '/api/accounts/users/'

export const listUsers = async() => {
  return await fetch(API_URL)
}

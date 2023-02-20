import { API_URL } from "./config"
import axios from "axios"

export default ({email, password}) => {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Login failed')
      }
    })
}

// export const loginRequest = async({email, password}) => {
//   const res = await axios.post(`${API_URL}/auth/login`, {email, password})
// }
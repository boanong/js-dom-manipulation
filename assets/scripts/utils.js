import arrayOfUsers from '../data/data.js'
import { displayUsers } from './script.js'

export const getSessionData = () =>
  JSON.parse(window?.sessionStorage.getItem('users'))

const saveToSession = (update) =>
  window?.sessionStorage.setItem('users', JSON.stringify(update))

export const deleteUser = (name) => {
  const newUserData = getSessionData()?.filter((user) => user.name !== name)

  saveToSession(newUserData)
  document.querySelector('#search-name').value = ''

  displayUsers(newUserData)
}

export const resetAll = () => {
  document.querySelector('#search-name').value = ''
  document.querySelector('#search-age').value = ''
  window.sessionStorage.removeItem('users')

  saveToSession(arrayOfUsers)
  displayUsers(arrayOfUsers)
}

export const getInitials = (name) => {
  const arra = [...name]
  let final = arra[0]
  for (let j = 0; j < arra.length; j++) {
    if (arra[j].includes(' ') && typeof (arra[j + 1] === String)) {
      final += arra[j + 1]
    }
  }
  return final
}

export const renderMessage = (message) => {
  return `<div class="message">${message}</div>`
}

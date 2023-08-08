import {
  deleteUser,
  getSessionData,
  resetAll,
  renderMessage,
  getInitials
} from './utils.js'

const form = document.querySelector('form')
const userContainers = document.querySelector('.all-users')
const nameInput = document.querySelector('#search-name')
const reset = document.querySelector('#reset')
const stats = document.querySelector('#show-stats')

reset.addEventListener('click', resetAll)

function displayUser ({ age, name }, acronym, highlighted) {
  const userDiv = document.createElement('div')
  userDiv.className = 'user'

  const userProfile = document.createElement('div')
  userProfile.className = 'user-profile'
  userProfile.innerHTML = `${acronym}`

  const container = document.createElement('div')
  const text = document.createElement('div')
  text.className = 'text'

  const userName = document.createElement('p')
  userName.className = 'user-name'
  userName.innerHTML = `${
    nameInput.value.length === 0 ? name : getHilight(name, highlighted)
  }`

  const userAge = document.createElement('p')
  userAge.className = 'user-age'
  userAge.innerHTML = `${age} year${age > 1 ? 's' : ''}`

  text.appendChild(userName)
  text.appendChild(userAge)

  const removeBtn = document.createElement('button')
  removeBtn.className = 'remove-user'
  removeBtn.innerHTML = 'delete'
  removeBtn.title = `delete ${name}`
  removeBtn.addEventListener('click', () => deleteUser(name))

  container.appendChild(text)
  container.appendChild(removeBtn)

  userDiv.appendChild(userProfile)
  userDiv.appendChild(container)

  userContainers.appendChild(userDiv)
}

const getHilight = (name, keyWord) => {
  for (const i in name) {
    const keyWordLength = parseInt(keyWord.length) + parseInt(i)
    if (name.trim().toLowerCase() === keyWord.trim().toLowerCase()) {
      return name
    } else if (
      keyWord.length === 1 &&
      name.charAt(i).toLowerCase() === keyWord.charAt(0).toLowerCase()
    ) {
      return `${name.slice(0, i)}<span class="highlight">${name.slice(
        i,
        keyWordLength
      )}</span>${name.slice(keyWordLength, name.length)}`
    } else if (
      keyWord.length > 1 &&
      name.charAt(i).toLowerCase() +
        name.charAt(parseInt(i) + 1).toLowerCase() ===
        keyWord.charAt(0).toLowerCase() + keyWord.charAt(1).toLowerCase()
    ) {
      return `${name.slice(0, i)}<span class="highlight">${name.slice(
        i,
        keyWordLength
      )}</span>${name.slice(keyWordLength, name.length)}`
    }
  }
}

export function displayUsers (persons, highlight) {
  // for loop method of displaying
  stats.innerHTML = `showing ${persons.length} use${
    persons.length > 1 ? 'rs' : 'r'
  }`

  userContainers.innerHTML = ''
  let firsTwoLetters = ''

  persons.forEach(({ age, name }) => {
    firsTwoLetters = getInitials(name)
    displayUser({ age, name }, firsTwoLetters, highlight)
  })
}

function searchUsersLoop (name, age) {
  const results = []
  getSessionData()?.forEach((person) => {
    if (
      (!name || person.name.toLowerCase().includes(name.toLowerCase())) &&
      (!age || person.age === age)
    ) {
      results.push(person)
    }
  })

  displayUsers(results, name)
}

// boundary line

function searchUsers (name, age) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let bool = false
      getSessionData()?.forEach((user) => {
        if (
          (!name || user.name.toLowerCase().includes(name.toLowerCase())) &&
          (!age || user.age === age)
        ) {
          bool = true
        }
      })

      if (bool) resolve(searchUsersLoop(name, age))
      else reject(new Error('An error occured'))
    }, 1500)
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  userContainers.innerHTML = renderMessage('searching users...')
  searchUsers(e.target.name.value, +e.target.age.value) // this another way to pass these inputs
    .catch(() => {
      userContainers.innerHTML = renderMessage(
        'Error! no user matches your search, please try again'
      )
    })
});

(() => displayUsers(getSessionData() || []))()

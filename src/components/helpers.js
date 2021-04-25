const helpers = {
  getActiveLetters: arr => {
    let letterString = arr.map(word => word[0]).join('')
    let letterArrAll = letterString.split('')
    let letterArrUnique = [...new Set(letterArrAll.sort())]
    return letterArrUnique
  },
  findNames: (letter, list) => {
    let names = list.filter(name => name.startsWith(letter))
    return [...new Set(names.sort())]
  }
}

export default helpers

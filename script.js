const readline = require('readline')
const fs = require('fs')
const path = require('path')
const FILE_TO_READ = path.join(process.cwd(), 'test-data-10-exp-5.list')
const OUTPUT_FILE = path.join(process.cwd(), 'output.txt')
const TEMP_FILE = path.join(process.cwd(), 'temp.txt')

function run() {
  // prepare data
  parseFile()
}

function printResults() {
  // task 1
  printUniqueNamesCount()
  // task 2
  printCommonFirstNames()
  // task 3
  printCommonLastNames()
  // task 4
  printNewUniqueNames()
}

const fullNames = {}
const firstNames = {}
const lastNames = {}
const completelyUniqueNames = []

function parseFile() {
  fs.writeFileSync(OUTPUT_FILE, '')
  fs.writeFileSync(TEMP_FILE, '')
  const readInterface = readline.createInterface({
    input: fs.createReadStream(FILE_TO_READ),
    output: fs.createWriteStream(TEMP_FILE),
    console: false
  })

  readInterface.on('line', function(line) {
    parseLine(line)
  })

  readInterface.on('close', function() {
    printResults()
  })
}

function parseLine(line) {
  // check we are on a line that contains a name
  if (!line.startsWith(' ') && line.includes(' -- ')) {
    // extract name
    const fullName = line.split(' -- ')[0]
    if (fullName.includes(', ')) {
      const names = fullName.split(', ')
      const lastName = names[0]
      const firstName = names[1]
      let firstNameUnique = false
      let lastNameUnique = false

      if (typeof fullNames[fullName] === 'undefined') {
        fullNames[fullName] = 1
      } else {
        fullNames[fullName]++
      }

      if (typeof firstNames[firstName] === 'undefined') {
        firstNames[firstName] = 1
        firstNameUnique = true
      } else {
        firstNames[firstName]++
      }

      if (typeof lastNames[lastName] === 'undefined') {
        lastNames[lastName] = 1
        lastNameUnique = true
      } else {
        lastNames[lastName]++
      }

      if (
        completelyUniqueNames.length < 25 &&
        firstNameUnique &&
        lastNameUnique
      ) {
        completelyUniqueNames.push(fullName)
      }
    }
  }
}

function printUniqueNamesCount() {
  const message = `
There are ${Object.keys(fullNames).length} unique full names.
There are ${Object.keys(firstNames).length} unique first names.
There are ${Object.keys(lastNames).length} unique last names.

`
  console.log(message)
  fs.appendFileSync(OUTPUT_FILE, message, 'utf8')
}

function printCommonFirstNames() {
  const commonNames = Object.entries(firstNames)
    .sort((a, b) => {
      return b[1] - a[1]
    })
    .slice(0, 10)

  let message = 'The ten most common first names are: \n'
  message += commonNames.map(name => `${name[0]} (${name[1]})`).join('\n')
  message += '\n\n'
  console.log(message)
  fs.appendFileSync(OUTPUT_FILE, message, 'utf8')
}

function printCommonLastNames() {
  const commonNames = Object.entries(lastNames)
    .sort((a, b) => {
      return b[1] - a[1]
    })
    .slice(0, 10)

  let message = 'The ten most common last names are: \n'
  message += commonNames.map(name => `${name[0]} (${name[1]})`).join('\n')
  message += '\n\n'
  console.log(message)
  fs.appendFileSync(OUTPUT_FILE, message, 'utf8')
}

function printNewUniqueNames() {
  let newUniqueNames = []
  // to create new unique names, we just offset the first name and the last name by one
  // from the completely unique names list, since names from that list are already unique
  let firstNamesCombination = []
  let lastNamesCombination = []
  completelyUniqueNames
    .map(name => name.split(', '))
    .forEach(name => {
      lastNamesCombination.push(name[0])
      firstNamesCombination.push(name[1])
    })
  for (let i = 0; i < lastNamesCombination.length - 1; i++) {
    newUniqueNames.push(
      `${lastNamesCombination[i]}, ${firstNamesCombination[i + 1]}`
    )
  }
  newUniqueNames.push(
    `${lastNamesCombination[lastNamesCombination.length - 1]}, ${
      firstNamesCombination[0]
    }`
  )
  let message = 'The new 25 unique names are: \n'
  message += newUniqueNames.join('\n')
  message += '\n\n'
  console.log(message)
  fs.appendFileSync(OUTPUT_FILE, message, 'utf8')
}

run()

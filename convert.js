const fs = require('fs')

// A custom split-function that ignores commas inside quotation marks
function commaSplit(str){
  let output = []
  let val = ""
  let state = 'NO_QUOTES'

  for(let char of str){
    switch(state){
      case 'QUOTES':
        val += char; 
        if(char == '"'){ state = 'NO_QUOTES'}        
        break;
      case 'NO_QUOTES':
        if(char == '"'){ state = 'QUOTES'}
        else if(char == ','){ 
          output.push(val)
          val = ""
          break;
        }
        val += char
        break;
    }
  }
  output.push(val)
  return output
}

// A custom split-function using black magic regular expressions
function commaSplitWithRegExp(str){
  let values = Array.from( str.match(/(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g) ) // https://stackoverflow.com/questions/18144431/regex-to-split-a-csv
  values = values.map(val => val[0] == "," ? val.slice(1) : val) // erasing trailing commas for a few cases
  return values
}



// Read content of file
const data = fs.readFileSync('./albums.csv', {encoding:'utf8'})

// Separate each line into an array
const lines = data.split("\n")

// Extract the headers
const headers = lines[0].split(",")

// Extract data from each line
const parsedLines = lines.slice(1).map(line => commaSplit(line))

// Construct array using conventional loop
const json = []
for(let album of parsedLines){
  json.push({
    [headers[0]]: album[0],
    [headers[1]]: album[1],
    [headers[2]]: Number(album[2]),
  })
}

// Construct array using reduce
// const json = parsedLines.reduce( (acc,album) => {
//   acc.push({
//     [headers[0]]: album[0],
//     [headers[1]]: album[1],
//     [headers[2]]: Number(album[2]),
//   })
//   return acc
// }, [])



fs.writeFileSync("albums.json",JSON.stringify(json))
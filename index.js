import fs from 'fs';
import path from 'path';

const directoryPath = './review';
const wordIncludeMap = {
  korean: new Set(),
  'squid game': new Set(),
  vip: new Set(),
  life: new Set(),
}

const readDoc = () => {
  return new Promise((res, rej) => {
    fs.readdir(directoryPath, (err, files) => {

      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      // loop through each txt file and import it
      files.forEach((file, idx) => {
        const filePath = path.join(directoryPath, file);
        const data = fs.readFileSync(filePath, 'utf8');

        let isSquidExist = false;

        data.split(' ').forEach(maybeWord => {
          if (maybeWord.toLowerCase() === 'korean') {
            wordIncludeMap.korean.add(file);
          }
          if (maybeWord.toLowerCase() === 'squid') {
            isSquidExist = true;
          } else if (isSquidExist && maybeWord.toLowerCase() === 'game') {
            wordIncludeMap['squid game'].add(file);
          } else {
            isSquidExist = false;
          }

          if (maybeWord.toLowerCase() === 'vip') {
            wordIncludeMap.vip.add(file);
          }
          if (maybeWord.toLowerCase() === 'life') {
            wordIncludeMap.life.add(file);
          }
        })

      });
      res()
    });
  })
}

readDoc().then((res, rej) => {
  for (const setKey in wordIncludeMap) {
    console.log(setKey);
    console.log(Array.from(wordIncludeMap[setKey]));
  }
})

import fs from 'fs';
import path from 'path';
import similarity from 'compute-cosine-similarity';

const directoryPath = './review';
const wordIncludeMap = {
  korean: {},
  'squid game': {},
  vip: {},
  life: {},
}

const textFileNum = 264;

const tfidfList = {

}

const readDoc = () => {
  return new Promise((res, rej) => {
    fs.readdir(directoryPath, (err, files) => {

      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      // loop through each txt file and import it
      files.forEach((file, idx) => {
        tfidfList[file] = {
          korean: 0,
          'squid game': 0,
          vip: 0,
          life: 0,
        }
        const filePath = path.join(directoryPath, file);
        const data = fs.readFileSync(filePath, 'utf8');

        let isSquidExist = false;

        data.split(' ').forEach(maybeWord => {
          if (maybeWord.toLowerCase() === 'korean') {
            wordIncludeMap.korean[file] = wordIncludeMap.korean[file] ? wordIncludeMap.korean[file] + 1 : 1;
          }
          if (maybeWord.toLowerCase() === 'squid') {
            isSquidExist = true;
          } else if (isSquidExist && maybeWord.toLowerCase() === 'game') {
            wordIncludeMap['squid game'][file] = wordIncludeMap['squid game'][file] ? wordIncludeMap['squid game'][file] + 1 : 1;
          } else {
            isSquidExist = false;
          }

          if (maybeWord.toLowerCase() === 'vip') {
            wordIncludeMap.vip[file] = wordIncludeMap.vip[file] ? wordIncludeMap.vip[file] + 1 : 1;
          }
          if (maybeWord.toLowerCase() === 'life') {
            wordIncludeMap.life[file] = wordIncludeMap.life[file] ? wordIncludeMap.life[file] + 1 : 1;
          }
        })

      });
      res()
    });
  })
}

const rank = {
  korean: {},
  'squid game': {},
  vip: {},
  life: {},
}
readDoc().then((res, rej) => {

  const wordidf = {
    korean: [Math.log(textFileNum / Object.keys(wordIncludeMap.korean).length) / Math.log(2), 0, 0, 0],
    'squid game': [0, Math.log(textFileNum / Object.keys(wordIncludeMap['squid game']).length) / Math.log(2), 0, 0],
    vip: [0, 0, Math.log(textFileNum / Object.keys(wordIncludeMap.vip).length) / Math.log(2), 0],
    life: [0, 0, 0, Math.log(textFileNum / Object.keys(wordIncludeMap.life).length) / Math.log(2)],
  }
  console.log(wordidf);

  // console.log(wordIncludeMap)
  for (const fileName in tfidfList) {
    for (const wordKey in tfidfList[fileName]) {
      tfidfList[fileName][wordKey] = wordIncludeMap[wordKey][fileName] ? ((1 + Math.log(wordIncludeMap[wordKey][fileName])) *  (Math.log(textFileNum / Object.keys(wordIncludeMap[wordKey]).length) / Math.log(2))) : 0;
    }
  }
  // console.log(tfidfList);

  for (const wordKey in rank) {
    for (const fileName in tfidfList) {
      rank[wordKey][fileName] = similarity(Object.values(tfidfList[fileName]), wordidf[wordKey]) || 0;
    }
  }
  // console.log(rank)

  for (const wordKey in rank) {
    // console.log(wordKey)
    let result = {};
    for (const fileName in rank[wordKey]) {
      // console.log(fileName)
      if (rank[wordKey][fileName]) {
        result[fileName] = rank[wordKey][fileName]
      }
    }
    result = Object.entries(result)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    console.log(result)
  }
  // console.log(similarity([5, 23, 2, 5, 9], [3, 21, 2, 5, 14]));
})

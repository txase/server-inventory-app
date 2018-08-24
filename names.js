const fs = require('fs');
const dockerNames = require('docker-names');

const NAME_SIZE = 1827;
const nameSet = new Set();

while (nameSet.size < NAME_SIZE) {
  nameSet.add(dockerNames.getRandomName());
}

const sql = 'INSERT INTO servers (name) VALUES ' +
  Array.from(nameSet).map(name => `("${name}")`).join(', ')
  + ';';

fs.writeFileSync('names.sql', sql);

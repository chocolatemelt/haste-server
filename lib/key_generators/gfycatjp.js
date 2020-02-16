const fs = require('fs');

function conjugate(str) {
  const end = str.charAt(str.length - 1);
  return
    (end === 'a')
      ? str + 'de'
      : str.slice(0, -1) + 'kute';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function rakuda(str) {
  let split = str.split(' ');
  for (let i = 0; i < split.length; ++i) {
    split[i] = capitalize(split[i]);
  }
  return split.join('');
}

module.exports = class GfycatJPGenerator {

  constructor(options, readyCallback) {
    if (!options)      throw Error('No options passed to generator');
    if (!options.adj) throw Error('No adj path specified in options');
    if (!options.noun) throw Error('No noun path specified in options');

    fs.readFile(options.adj, 'utf8', (err, data) => {
      if (err) throw err;
      this.dict_adj = data.split(/[\n\r]+/);
      if (readyCallback) readyCallback();
    });

    fs.readFile(options.noun, 'utf8', (err, data) => {
      if (err) throw err;
      this.dict_noun = data.split(/[\n\r]+/);
      if (readyCallback) readyCallback();
    });
  }

  // we don't use keyLength since gfycat is 2 adj 1 noun
  // if possible i would just sample from a population,
  // but that is a lot of extra overhead i dont want to write.
  // so i'm just going to random choose until i get a unique number
  // or it goes to 10 iterations, which would be actually just
  // incredibly statistically insane...?
  createKey() {
    let text = '';

    let index = Math.floor(Math.random() * this.dict_adj.length);
    text += capitalize(this.dict_adj[index]);

    for (let i = 0; i < 10; ++i) {
      const new_index = Math.floor(Math.random() * this.dict_adj.length);
      if (index !== new_index) {
        index = new_index;
        break;
      }
    }
    text += capitalize(this.dict_adj[index]);

    index = Math.floor(Math.random() * this.dict_noun.length);
    text += rakuda(this.dict_noun[index]);

    return text;
  }
};

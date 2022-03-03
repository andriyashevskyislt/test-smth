const axios = require('axios');
const cheerio = require('cheerio');
const fse = require('fs-extra');

const SITE = 'https://cheerio.js.org/';
const FOLDER_NAME = 'cheerio';

axios.get(SITE).then(data => {
  const $ = cheerio.load(data.data);

// scripts
  const pathScripts = $('script[src]').map(function () {
    return this.attribs.src ;
  }).get();

  // styles
  const style = $('link[rel=stylesheet]').map(function () {
    return this.attribs.href ;
  }).get();

  // probably we should add images and other stuff
  const allRes = [...pathScripts, ...style];

  allRes.map(async ( file ) => {
    axios.get(`${ SITE }/${ file }`).then(async data => {
        await fse.outputFile(`${ FOLDER_NAME }/${file}`, data.data);
      })
      .catch(e => {
        console.log('eee', e);
      });
  });

  fse.outputFile(`${ FOLDER_NAME }/index.html`, data.data, err => {
    if ( err ) {
      console.error('fs write file', err);
    }
  });
}).catch(e => {
  console.log('ss', e);
});


const { execSync } = require('child_process');
const { SPELLCHECKER_LOCALES } = require('../build/i18n/languages');

const path = './build/dictionaries';

let packages = '';
Object.keys(SPELLCHECKER_LOCALES).forEach((key) => { packages = `${packages} hunspell-dict-${key}`; });

function exec(cmd) {
  execSync(cmd,
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}

exec(`
rm -rf ${path}
npm install --prefix ${path} ${packages}
mv ${path}/node_modules/* ${path}
rm -rf ${path}/node_modules ${path}/package-lock.json`);

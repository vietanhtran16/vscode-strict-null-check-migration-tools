// @ts-check
const path = require('path');
const ts = require('typescript');
const fs = require('fs');
module.exports.getImportsForFile = function getImportsForFile(file, srcRoot) {
    const fileInfo = ts.preProcessFile(fs.readFileSync(file).toString());
    return fileInfo.importedFiles
        .map(importedFile => importedFile.fileName)
        .filter(fileName => !/.\.css$/.test(fileName)) // remove css imports
        .filter(fileName => !/.\.json$/.test(fileName)) // remove css imports
        .filter(x => /\//.test(x)) // remove node modules (the import must contain '/')
        .filter(filename => !filename.startsWith("@serko")
            && !filename.startsWith("@zeno")
            && !filename.startsWith('recompose')
            && !filename.startsWith('@material')
            && !filename.startsWith('@storybook')
            && !filename.startsWith('react-day-picker')
            && !filename.startsWith('@splitsoftware')
            && !filename.startsWith('lodash')
            && !filename.startsWith('date-fns')
            && !filename.startsWith('rxjs')
            && !filename.startsWith('react-intl')
            && !filename.startsWith('moment')
        )
        .map(fileName => {
            if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
                return path.join(path.dirname(file), fileName);
            }
            if (/\//.test(fileName)) {
                return path.join(srcRoot, fileName);
            }
            return fileName;
        }).map(fileName => {
            if (fs.existsSync(`${fileName}.tsx`)) {
                return `${fileName}.tsx`;
            }
            if (fs.existsSync(`${fileName}.ts`)) {
                return `${fileName}.ts`;
            }
            if (fs.existsSync(`${fileName}`)) {
                return `${fileName}/index.ts`;
            }
            if (fs.existsSync(`${fileName}.js`)) {
                return `${fileName}.js`;
            }
            if (fs.existsSync(`${fileName}.d.tsx`)) {
                return `${fileName}.d.tsx`;
            }
            throw new Error(`Unresolved import ${fileName} in ${file}`);
        });
};
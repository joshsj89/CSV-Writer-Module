// FILE: csv-writer.js
// PROVIDES: A class to write to CSV files
// WRITTEN BY: Josh Kindarara
//
// CONSTRUCTOR
//  constructor(filename)
//      Precondition: A non-empty string must be passed in.
//      Postcondition: Appends string argument to the directory from which 
//      the program is being run. If the file already exits, it will be
//      cleared. If the file does not exist, a new empty one will be created.
//
// METHODS
//  writerow(data)
//      Precondition: The argument must be an array.
//      Postcondition: Each element of the array is written into a row of the CSV file.
//
//  clear()
//      Postcondition: The CSV file is cleared.
//
//  filename()
//      Postcondition: Returns the name of the CSV file with the extension.
//
//  filename(filename)
//      Precondition: A non-empty string must be passed in.
//      Postcondition: Sets the name of the CSV file to string passed in and changes
//      the _filepath to point to the new location.
//
//  filepath()
//      Postcondition: Returns the full path of the CSV file.
//
// INVARIANT
//      1. _filename must be a string that ends with the extension ".csv".
//      2. _filepath must be a string that ends with _filename.
//

const fs = require('fs');
const path = require('path');
//const readline = require('readline');

class Csv {
    constructor(filename) {
        this._filename = `${filename}.csv`;
        this._filepath = path.join(__dirname, this._filename);

        // Creates an empty file or clears file if it's already created
        fs.writeFile(this._filepath, '', (err) => {
            if (err) {
                throw err;
            }
        });
    }

    writerow(data) {
        let csv = '';

        data.forEach((item, i) => {
            if (item.includes(',')) {
                data[i] = `"${item}"`;
            }
        });
        
        csv += data.join(',') + '\n\n';

        fs.appendFileSync(this._filepath, csv);
    }
    
    /*
    readrow() {
        fs.readFile(this._filepath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            
            const fileStream = fs.createReadStream(this._filepath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                console.log(line);
                rl.close();
            })
            
            const rows = data.split('\n\n');
            let rowsResult = [];
            rows.forEach((row, i) => {
                if (i < rows.length - 1) { // skip last element (empty string)
                    rowsResult.push(row.split(','));
                }
            });
            
            return rowsResult;
        })
    }
    */

    readrows() {
        const data = fs.readFileSync(this._filepath, 'utf8');

        const rows = data.trim().split('\n\n');
        const regex = /("[^"]*"|[^,"]+)/g;
        let rowsResult = [];
        rows.forEach((row) => {
            const rowResult = [];
            row.match(regex).forEach((value) => {
                rowResult.push(value.trim().replace(/"/g, ''));
            });
            rowsResult.push(rowResult);
        });
        
        return rowsResult;
    }

    clear() {
        //clear file
        fs.truncate(this._filepath, 0, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    get filename() {
        return this._filename;
    }

    set filename(filename) {
        // try using fs.rename()
        this._filename = `${filename}.csv`;
        this._filepath = path.join(__dirname, this._filename);
    }

    get filepath() {
        return this._filepath;
    }
}

const arr1 = ['ap,ple', 'banana', 'grapes', 'mango'];
const arr2 = ['TV', 'pear', 'juice', 'john'];
let csv = new Csv('test');
csv.writerow(arr1);
csv.writerow(arr2);
let temp = csv.readrows();
console.log(temp);

module.exports = Csv;
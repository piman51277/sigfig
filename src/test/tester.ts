import fs from 'fs';
import SigFig from '../classes/SigFig';
import { testSet } from './types/testSet';

//read contents of ./tests directory
const sets = fs.readdirSync('./tests');

//import every file in sets
const tests:{
    [key: string]: testSet
} = {};

//loop through every file in ./sets
for (const set of sets) {
    const fileContents = fs.readFileSync(`./tests/${set}`, 'utf8');

    //parse the file contents
    const [method,...testEntries] = fileContents.split('\n');

    //create a test object for each test
    tests[method] = testEntries.map(n=>n.split(','));
}

//for each test, run the test
for (const method in tests) {
    console.log(`Testing method ${method}...`);

    //run the test
    let fails = 0;
    for(const [input0,input1,expected] of tests[method]) {
        
        //create SigFig objects
        const sf0 = SigFig.fromString(input0);
        const sf1 = SigFig.fromString(input1);

        //run the test
        const actual = sf0[method](sf1);

        //check if the result is correct
        if (actual.toString() !== expected) {
            fails++;
        }
    }

    //print the result
    if(fails !== 0){
        console.log(`FAILED: ${fails}/${tests[method].length} tests failed.`);
    }
    else {
        console.log(`SUCCESS: all (${tests[method].length}) tests passed.`);
    }
}

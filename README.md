# SigFig
A small project to calculate significant figures   
All calculations are done through the `SigFig` class, documented below.

# Example
```
const sf0 = SigFig.fromNumber(123.45); // convert 1.2345e2 (123.45)

sf0.toNumber(); // 123.45
sf0.toString(); // 1.2345e2

sf0.getDecimalPrecision(); // -2
sf0.getSignificantPrecision(); // 5

sf0.roundDecimal(-1).toNumber(); // 123.5
sf0.roundSignificant(3).toNumber(); // 123

const sf1 = new SigFig("123456", 3, false); // convert 1.23456e3 (1234.56)

sf0.add(sf1).toNumber(); // 1358.01
sf0.subtract(sf1).toNumber(); // -1111.11
sf0.multiply(sf1).toNumber(); // 1524100
sf0.divide(sf1).toNumber(); // 0.099995
```
# SigFig Class
 
## Properties
 - `value:string` - contains a string representation of the number in scientific notation    
   - `12345`
 - `power:number` - contains the power of 10 used to return `value` to the original value
    - `2`
 - `negative:boolean` - whether the number is negative or not
   - `false`
 
## Instance Methods
 - `toString()`
   - returns the number in string form
   - `1.2345e2`
 - `toNumber()`
   - returns the number in number form
   - `123.45`
 - `getDecimalPrecision()`
   - returns the decimal precision of the number as a power of 10. 
   - `1.2345e2` -> `-2`  
 - `getSignificantPrecision()`
   - returns the number of significant figures in the number
   - `1.2345e2` -> `5`
 - `roundDecimal(place)`
   - rounds the number to a specified decimal place
   - `1.2345e2, 0` -> `1.23e2`
 - `roundSignificant(count)`
   - rounds the number to the specified number of significant digits
   - `1.2345e2, 3` -> `1.23e2`
 - `negate()`
   - reverses the state of `this.negative`
 - `add(SigFig)`
   - adds another `SigFig` to the current `SigFig`.
 - `subtract(SigFig)`
   - subtracts another `SigFig` from the current `SigFig`
 - `multiply(SigFig)`
   - multiplies another `SigFig` with the current `SigFig`
 - `divide(SigFig)`
   - divides the current `SigFig` with another `SigFig`

## Static Methods
 - `fromNumber(number,significant?)`
   - returns a `SigFig` instance with the value of number provided. Optionally, restrict the number of sig figs recorded.
   - e.g. `123.45`
 - `fromString(string)`
   - returns a `SigFig` instance with the value of the string provided
   - e.g. `1.2345e2`

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
 - `fromNumber(number)`
   - returns a `SigFig` instance with the value of number provided 
   - e.g. `123.45`
 - `fromString(string)`
   - returns a `SigFig` instance with the value of the string provided
   - e.g. `1.2345e2`
  
export default class SigFig {
	value: string
	power: number
	negative: boolean

	constructor(value: string, power: number, negative: boolean) {

		//set object properties
		this.value = value;
		this.power = power;
		this.negative = negative;
	}

	//returns the number as a string
	toString(): string {
		return `${this.negative ? "-" : ""}${this.value[0]}.${this.value.slice(1)}e${this.power}`;
	}

	//returns the number as a number
	toNumber(): number {
		return parseInt(this.value) * (this.negative ? -1 : 1) * Math.pow(10, 1 - this.value.length + this.power);
	}

	//returns the decimal precision of the number as a power of 10
	getDecimalPrecision(): number {
		return this.power - this.value.length + 1;
	}

	//returns the number of significant figures in the number
	getSignificantPrecision(): number {
		return this.value.length;
	}

	//rounds the number to a specified decimal precision
	roundDecimal(place: number): SigFig {

		//get the index to round to
		const targetIndex = place * -1 + this.power;

		//if the index is less than negative 1, just return 0 
		if (targetIndex <= -1) {
			return new SigFig("0", place, false);
		}

		//if the index is negative 1, check the number in position 0
		else if (targetIndex == -1) {
			const firstPosValue = parseInt(this.value[0]);

			//if the fist position is over 5, return 1
			if (firstPosValue > 5) {
				return new SigFig("1", place, false);
			}

			//if the first position is under or equal to 5, return 0
			else {
				return new SigFig("0", place, false);
			}
		}

		//if the index is greater than the length of the number, just return the number
		else if (targetIndex >= this.value.length) {
			return new SigFig(this.value, this.power, this.negative);
		}

		//all other cases: the index is referencing a valid value
		else {
			const nextValue = parseInt(this.value[targetIndex + 1]);

			//slice this.value to targetIndex
			let newValue = parseInt(this.value.slice(0, targetIndex + 1));

			//if the next value is greater than 5, round up
			if (nextValue > 5) {
				newValue++;
			}

			//if the next value is less than 5, round down
			else if (nextValue < 5) {

				//do nothing
			}

			//if the next value is 5, look at the number after the 5
			else {
				const valueAfterFive = parseInt(this.value[targetIndex + 2]) || 0;

				//if the value after 5 is odd, round up
				if (valueAfterFive % 2 != 0 || valueAfterFive == 0) {
					newValue++;
				}
			}

			//output the sig fig
			return new SigFig(newValue.toString(), this.power, this.negative);
		}
	}

	//rounds the number to a specified significant precision
	roundSignificant(place: number): SigFig {

		//check if the place is negative
		if (place < 0) {
			throw new Error("Place must be positive");
		}

		//check if the place is bigger than this.value.length
		else if (place >= this.value.length) {
			return new SigFig(this.value, this.power, this.negative);
		}

		//all is well, start rounding
		else {
			const nextValue = parseInt(this.value[place]);

			//slice this.value to targetIndex
			let newValue = parseInt(this.value.slice(0, place));

			//if the next value is greater than 5, round up
			if (nextValue > 5) {
				newValue++;
			}

			//if the next value is less than 5, round down
			else if (nextValue < 5) {

				//do nothing
			}

			//if the next value is 5, round so the target is even
			else {
				const valueAfterFive = parseInt(this.value[place + 2]) || 0;

				//if the value after 5 is odd, round up
				if (valueAfterFive % 2 != 0 || valueAfterFive == 0) {
					newValue++;
				}
			}

			//output the sig fig
			return new SigFig(newValue.toString(), this.power, this.negative);
		}
	}

	//reverses the state of this.negative
	negate(): SigFig {
		return new SigFig(this.value, this.power, !this.negative);
	}

	//adds a number to this number
	add(other: SigFig): SigFig {

		//convert .value to a number
		let thisValue = parseInt(this.value);
		let otherValue = parseInt(other.value);

		//apply negatives to both this and other
		if (this.negative) {
			thisValue *= -1;
		}
		if (other.negative) {
			otherValue *= -1;
		}

		//Make up for power difference
		if (this.power > other.power) {
			thisValue *= Math.pow(10, this.power - other.power);
		}
		else if (this.power < other.power) {
			otherValue *= Math.pow(10, other.power - this.power);
		}

		//make up for length difference
		if (this.value.length > other.value.length) {
			otherValue *= Math.pow(10, this.value.length - other.value.length);
		}
		else if (this.value.length < other.value.length) {
			thisValue *= Math.pow(10, other.value.length - this.value.length);
		}

		//add the numbers
		let sum = thisValue + otherValue;

		//if the sum is negative, make it positive
		let isNegative = false;
		if (sum < 0) {
			isNegative = true;
			sum *= -1;
		}

		//get length of addends
		const thisLength = Math.floor(Math.log10(Math.abs(thisValue))) + 1;
		const otherLength = Math.floor(Math.log10(Math.abs(otherValue))) + 1;

		//compensate for additive under/overflow
		const maxLength = Math.max(thisLength, otherLength);
		const resultLength = Math.floor(Math.log10(Math.abs(sum))) + 1;

		//compute the boost
		const boost = resultLength - maxLength;

		//convert to SigFig object
		const result = new SigFig(sum.toString(), Math.max(this.power, other.power) + boost, isNegative);

		//get worst decimal precision and restrict to 0 and below
		const maxDecimalPrecision = Math.min(Math.max(this.getDecimalPrecision(), other.getDecimalPrecision()), 0);

		//round to the max decimal precision
		return result.roundDecimal(maxDecimalPrecision);
	}

	//negates a number and adds it
	subtract(other: SigFig): SigFig {
		return this.add(other.negate());
	}

	//multiplies a number by this number
	multiply(other: SigFig): SigFig{

		//convert .value to a number
		let thisValue = parseInt(this.value);
		let otherValue = parseInt(other.value);

		//apply negatives to both this and other
		if (this.negative) {
			thisValue *= -1;
		}
		if (other.negative) {
			otherValue *= -1;
		}

		//Make up for power difference
		if (this.power > other.power) {
			thisValue *= Math.pow(10, this.power - other.power);
		}
		else if (this.power < other.power) {
			otherValue *= Math.pow(10, other.power - this.power);
		}

		//make up for length difference
		if (this.value.length > other.value.length) {
			otherValue *= Math.pow(10, this.value.length - other.value.length);
		}
		else if (this.value.length < other.value.length) {
			thisValue *= Math.pow(10, other.value.length - this.value.length);
		}

		//get product
		let product = thisValue * otherValue;

		//if the product is negative, make it positive
		let isNegative = false;
		if (product < 0) {
			isNegative = true;
			product *= -1;
		}

		//convert to sigFig object
		const result = new SigFig(product.toString(), this.power + other.power + 1, isNegative);

		//get worst significant precision
		const minSigPrecision = Math.min(this.getSignificantPrecision(), other.getSignificantPrecision());

		//round to the worst significant precision
		return result.roundSignificant(minSigPrecision);
	}

	//generates a sigFig from a string
	static fromString(string: string): SigFig {

		//check if string is negative or not
		const isNegative = string[0] == "-";

		//remove the negative sign and decimal
		string = string.replace(/^-|\./g, "");

		//parse value and power
		const [value, power] = string.split("e");

		//return sigFig
		return new SigFig(value, parseInt(power), isNegative);
	}


	static fromNumber(number: number,significant = Infinity): SigFig {

		//convert number to string
		let string = number.toString();
		
		//check if number is negative or not
		const isNegative = string[0] == "-";
		string = string.replace(/^-|\./g, "");

		//get power
		let power = Math.floor(Math.log10(Math.abs(number)));

		//remove leading zeros
		while (string[0] == "0") {
			string = string.substr(1);
			power--;
		}

		//cut off based on significant
		string = string.slice(0,significant);

		//return sigFig
		return new SigFig(string, power, isNegative);
	}
}
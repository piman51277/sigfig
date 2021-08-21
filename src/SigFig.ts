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
		return `${this.value[0]}.${this.value.slice(1)}e${this.power}`;
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
			const targetValue = parseInt(this.value[targetIndex]);
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

			//if the next value is 5, round so the target is even
			else {
				if (targetValue % 2 != 0) {
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
			const targetValue = parseInt(this.value[place - 1]);
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
				if (targetValue % 2 != 0) {
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

	//adds another SigFig to this SigFig
	add(other: SigFig): SigFig {

		//NOTE: In this function, we deliberatley try to keep add math operation strictly between integers.
		//	  This is to avoid issues with floating point math.

		//get the values of this and other
		let thisValue = parseInt(this.value);
		let otherValue = parseInt(other.value);

		//negate other and this if nessessary
		if (this.negative) {
			thisValue *= -1;
		}

		if (other.negative) {
			otherValue *= -1;
		}

		//if this has higher power than other
		if (this.power > other.power) {
			thisValue *= Math.pow(10, (this.power - other.power));
		}

		//else, visa versa
		else if (this.power < other.power) {
			otherValue *= Math.pow(10, (other.power - this.power));
		}

		//if this has a shorter value length, compensate
		if (this.value.length < other.value.length) {
			thisValue *= Math.pow(10, (other.value.length - this.value.length));
		}

		//else, visa versa
		else if (this.value.length > other.value.length) {
			otherValue *= Math.pow(10, (this.value.length - other.value.length));
		}


		//get the sum
		let sum = thisValue + otherValue;

		//displacement math
		const displacement = Math.floor(Math.log10(sum)) - Math.max(Math.floor(Math.log10(thisValue)), Math.floor(Math.log10(otherValue)));

		//if the sum is negative, make it positive
		let isNegative = false;
		if (sum < 0) {
			isNegative = true;
			sum *= -1;
		}

		//get the maximum decimal precision of both addends
		const maxDecimalPrecision = Math.max(this.getDecimalPrecision(), other.getDecimalPrecision());

		//get sum as SigFig
		const sumSigFig = new SigFig(sum.toString(), Math.max(this.power, other.power) + displacement, isNegative);

		//return rounded sum
		return sumSigFig.roundDecimal(maxDecimalPrecision);

	}

	//subtracts another SigFig from this SigFig
	subtract(other: SigFig): SigFig {

		//simply negate the other and add
		return this.add(other.negate());
	}

	//multiplies this SigFig by another SigFig
	multiply(other: SigFig): SigFig {


		//NOTE: In this function, we deliberatley try to keep add math operation strictly between integers.
		//	  This is to avoid issues with floating point math.

		//get the values of this and other
		let thisValue = parseInt(this.value);
		let otherValue = parseInt(other.value);

		//negate other and this if nessessary
		if (this.negative) {
			thisValue *= -1;
		}

		if (other.negative) {
			otherValue *= -1;
		}

		//if this has higher power than other
		if (this.power > other.power) {
			thisValue *= Math.pow(10, (this.power - other.power));
		}

		//else, visa versa
		else if (this.power < other.power) {
			otherValue *= Math.pow(10, (other.power - this.power));
		}

		//get the product
		let product = thisValue * otherValue;

		//displacement math
		const displacement = Math.floor(Math.log10(product)) - Math.max(Math.floor(Math.log10(thisValue)), Math.floor(Math.log10(otherValue)));

		//if the product is negative, make it positive
		let isNegative = false;
		if (product < 0) {
			isNegative = true;
			product *= -1;
		}

		//get the minimum Significant precision of both addends
		const maxSignificantPrecision = Math.min(this.getSignificantPrecision(), other.getSignificantPrecision());

		//get product as SigFig
		const productSigFig = new SigFig(product.toString(), this.power + other.power + displacement, isNegative);

		//return rounded product
		return productSigFig.roundSignificant(maxSignificantPrecision);
	}
}
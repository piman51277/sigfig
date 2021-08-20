//class for Scientific Notation
export default class Scinumber {
	value: string;
	power: number;

	constructor(value: string, power: number) {
		this.value = value;
		this.power = power;
	}

	//convert to number
	toNumber(): number {

		//FIXME fix JS float error! (1.1 == 1.1000000000000001)
		return parseFloat(this.value) * Math.pow(10, this.power);
	}

	//convert to string
	toString(): string {
		return this.value + 'e' + this.power;
	}

	//normalize value
	normalize(): void {

		//parse this.value
		const number = parseFloat(this.value);

		//use Scinumber.fromNumber to get normalized Scinumber
		const { value, power } = Scinumber.fromNumber(number);

		//set 
		this.value = value;
		this.power = power;
	}

	//gets the max precision
	getPrecision(): number {

		//if there is no ., presision is this.power
		if (this.value.indexOf('.') === -1) {
			return this.power;
		} else {

			//return the power - the lowest decimal place, and add 2 to make up for decimal
			return this.power - this.value.length + Math.max(0, this.value.indexOf('.') + 1);
		}
	}

	//get Scinumber from number
	static fromNumber(number: number): Scinumber {

		// if number is 0
		if (number === 0) {
			return Scinumber.Zero();
		}

		//if number is negative
		let isNegative = false;
		if (number < 0) {
			isNegative = true;

			//get absolute value
			number = Math.abs(number);
		}

		//get log base 10 of number
		const power = Math.floor(Math.log10(number));

		//divide number by 10^power
		const value = number / Math.pow(10, power) * (isNegative ? -1 : 1);

		//return new Scinumber
		return new Scinumber(value.toString(), power);
	}

	//get Scinumber from string
	static fromString(string: string): Scinumber {
		const [value, power] = string.split('e');
		const newObj = new Scinumber(value, parseInt(power));
		newObj.normalize();
		return newObj;
	}

	static Zero(): Scinumber {
		return new Scinumber('0', 0);
	}


}
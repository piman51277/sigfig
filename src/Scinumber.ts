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

	//get Scinumber from number
	static fromNumber(number: number): Scinumber {
		//get log base 10 of number
		const power = Math.floor(Math.log10(number));

		//divide number by 10^power
		const value = number / Math.pow(10, power);

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
}
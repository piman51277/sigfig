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
		return new Scinumber(value, parseInt(power));
	}
}


console.log(Scinumber.fromNumber(0.00000000001).toString());
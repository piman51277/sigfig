import Scinumber from './Scinumber';

//class for handling sigfigs
export default class SigFig extends Scinumber {
	precision: number
	constructor(value: string, power?: number, precision?: number) {
		super(value, power);
		super.normalize();
		this.precision = precision || this.getPrecision();
	}

	//if this.precision is defined, return it. Otherwise, act as a normal Scinumber
	getPrecision(): number {
		if (this.precision) {
			return this.precision;
		} else {
			return super.getPrecision();
		}
	}

	//rounds to 10^place and returns a Scinumber
	roundTo(place: number): SigFig {

		//FIXME for now, the outputs of this function have the same precision as the input. This may not be the case.
		//TODO find the corrrect behavior of precision for rounding

		//get the true place, offsetting for the power
		const truePlace = place - this.power;

		//if true place is referencing a value that cannot affect rounding, leave SigFig alone
		if (truePlace * -1 > this.value.length - (Math.max(0, this.value.indexOf('.')) + 1)) {
			return new SigFig(this.value, this.power, this.precision);
		}

		//if the value cannot affect the rounding at all, return 0
		else if (truePlace > this.power + 1) {
			return new SigFig('0', 0, this.precision);
		}

		//if the value can affect the rounding
		else if (truePlace === this.power + 1) {

			//look at the first figure in this.value
			const target = parseInt(this.value.charAt(0));

			// use sig fig rounding
			if (target <= 5) {
				return new SigFig('0', this.power + 1, this.precision);
			} else if (target > 5) {
				return new SigFig('1', this.power + 1, this.precision);
			}
		}

		//every other case
		else {

			//get the true place in terms of nvalue
			const workingPlace = truePlace * -1;

			//get a version of nvalue with no decimal
			const nvalue = this.value.replace('.', '');

			//get the figure at true place
			const target = parseInt(nvalue.charAt(workingPlace));

			//get the figure after true place
			const targetNext = parseInt(nvalue.charAt(workingPlace + 1));

			//if targetNext is NaN , don't round
			if (isNaN(targetNext)) {
				return new SigFig(this.value, this.power, this.precision);
			}

			let newValueAtTarget = 0;

			//if the next figure is less than 5, round down
			if (targetNext < 5) {
				newValueAtTarget = target;
			}

			//if the next figure is greater than 5, round up
			else if (targetNext > 5) {
				newValueAtTarget = target + 1;
			}

			//the next figure is a 5, round up if even
			else {
				newValueAtTarget = target + (target % 2 === 0 ? 0 : 1);
			}

			//replace the figure at true place with the new value
			const newValue = nvalue.slice(0, workingPlace) + newValueAtTarget;

			//add a . in the correct place
			const newValueWithDecimal = newValue.charAt(0) + '.' + newValue.slice(1);

			//return
			return new SigFig(newValueWithDecimal, this.power, this.precision);
		}
	}

	// adds a sigfig to this sigfig
	add(n: SigFig): SigFig {

		//get the precision of n
		const nPrecision = n.getPrecision();

		//find the max precision of this and n (in this case, lower is *more* precise in real life)
		const maxPrecision = Math.max(this.precision, nPrecision);

		//round both sigfigs to the max precision
		const thisRounded = this.roundTo(maxPrecision);
		const nRounded = n.roundTo(maxPrecision);

		//get value and power by adding the two sigfigs
		const { value, power } = Scinumber.fromNumber(thisRounded.toNumber() + nRounded.toNumber());

		//return the sum as a sigfig
		return new SigFig(value, power, maxPrecision);
	}

	// subtracts a sigfig from this sigfig (alias of add)
	subtract(n: SigFig): SigFig {
		n.negate();
		return this.add(n);
	}

	//multiples a sigfig by a sigfig
	multiply(n: SigFig): SigFig {

		//get the precision of n
		const nPrecision = n.getPrecision();

		//find the max precision of this and n (in this case, lower is *more* precise in real life)
		const maxPrecision = Math.max(this.precision, nPrecision);

		//multiply the two sigfigs
		const {value,power} = Scinumber.fromNumber(this.toNumber() * n.toNumber());

		//return the sum as a sigfig
		return new SigFig(value, power, maxPrecision).roundTo(maxPrecision);
	}
}
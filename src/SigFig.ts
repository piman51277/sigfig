import Scinumber from './Scinumber';

//class for handling sigfigs
export default class SigFig {
	//gets the max precision of a Scinumber
	static getPrecision(n: Scinumber): number {
		//if there is no ., presision is this.power
		if (n.value.indexOf('.') === -1) {
			return n.power;
		} else {
			//return the power - the lowest decimal place, and add 2 to make up for decimal
			return n.power - n.value.length + 2;
		}
	}

	static roundTo(n: Scinumber, place: number): Scinumber {
		//get the true place, offsetting for the power
		const truePlace = place - n.power;

		//if true place is referencing a value that cannot affect rounding, leave Scinumber alone
		if (truePlace * -1 > n.value.length - 3) {
			return new Scinumber(n.value, n.power);
		}
		//if the value cannot affect the rounding at all, return 0
		else if (truePlace > n.power + 1) {
			return new Scinumber('0', n.power + 1);
		}
		//if the value can affect the rounding
		else if (truePlace === n.power) {
			//look at the first figure in n.value
			const target = parseInt(n.value.charAt(0));

			// use sig fig rounding
			if (target <= 5) {
				return new Scinumber('0', n.power + 1);
			} else if (target > 5) {
				return new Scinumber('1', n.power + 1);
			}
		}
		//every other case
		else {
			//get the true place in terms of nvalue
			const workingPlace = truePlace * -1;

			//get a version of nvalue with no decimal
			const nvalue = n.value.replace('.', '');

			//get the figure at true place
			const target = parseInt(nvalue.charAt(workingPlace));

			//get the figure after true place
			const targetNext = parseInt(nvalue.charAt(workingPlace + 1));

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

			const newValue = nvalue.charAt(0) + '.' + nvalue.slice(1, workingPlace) + (newValueAtTarget).toString();
			return new Scinumber(newValue, n.power);
		}
	}
}
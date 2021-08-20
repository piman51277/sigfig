import Scinumber from './Scinumber';

//class for handling sigfigs
export default class SigFig{
	//gets the max precision of a Scinumber
	static getPrecision(a: Scinumber): number {
		//if there is no ., presision is this.power
		if (a.value.indexOf('.') === -1) {
			return a.power;
		} else {
			return a.power - a.value.length + 2;
		}

	}
}
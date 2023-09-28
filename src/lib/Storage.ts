export class Storage {
	#key: string;

	constructor(key: string) {
		this.#key = key;
	}

	get() {
		try {
			return JSON.parse(localStorage.getItem(this.#key));
		} catch (error) {
			console.error(`couldn't parse "${this.#key}" from storage`, error);
		}
	}

	set(value) {
		try {
			localStorage.setItem(this.#key, JSON.stringify(value));
		} catch (error) {
			console.error(`couldn't save "${this.#key}" to storage`, error);
		}
	}
}

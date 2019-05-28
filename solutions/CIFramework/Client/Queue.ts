/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Queue class.
 */
/** @internal */
namespace Microsoft.CIFramework {

	export class Queue<T>{

		_queue: T[];

		constructor(queue?: T[]) {
			this._queue = queue || [];
		}

		enqueue(item: T) {
			this._queue.push(item);
		}

		dequeue(): T {
			return this._queue.shift();
		}

		clearImmediate() {
			this._queue = [];
		}

		removeItem(index: number) {
			this._queue.splice(index, 1);
		}

		getItemAtIndex(index: number): T {
			return this._queue[index];
		}

		get count(): number {
			return this._queue.length;
		}
	}

}
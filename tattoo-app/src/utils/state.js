/**
 * Centralized application state.
 * Provides subscribe/set/get methods for reactive updates.
 * @module state
 */

export const state = {
  width: 0.2, // meters
  height: 0.2, // meters
  rotation: 0,
  /** @type {import('three').Vector3|null} */
  anchorPosition: null,
  /** @type {import('three').Vector3|null} */
  anchorNormal: null,
};

const subscribers = new Set();

/**
 * Update state and notify subscribers.
 * @param {Object} partialState properties to merge into state
 * @returns {void}
 */
export function setState(partialState) {
  Object.assign(state, partialState);
  subscribers.forEach((cb) => cb(state));
}

/**
 * Subscribe to state changes.
 * @param {(s: typeof state) => void} cb callback
 * @returns {() => void} unsubscribe function
 */
export function subscribe(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

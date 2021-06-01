module.exports = class Util {
  /**
   *
   * @param {Integer} ms - Milliseconds to sleep.
   * @returns {Promise} Sleep for the specified amount of time.
   */
  static async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
};

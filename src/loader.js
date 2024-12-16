/*
 * @param {string} url
 * @param {object} context
 * @param {function} nextLoad
 * @returns {Promise}
 */
export function load(path, context, nextLoad) {
  if (!path.endsWith(".ts")) {
    return nextLoad(path, context);
  }

  console.info(path);
  process.exit(0);

  return new Promise((resolve, reject) => {
    fetch(path)
      .then((res) => res.json())
      .then((data) =>
        resolve({
          format: "json",
          shortCircuit: true,
          source: JSON.stringify(data),
        })
      )
      .catch((err) => reject(err));
  });
}

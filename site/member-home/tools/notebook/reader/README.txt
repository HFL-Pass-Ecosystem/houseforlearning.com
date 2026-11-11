Free handwriting/text reader used by the smart notebook ("Aa To text") when the browser has no
handwriting reader of its own. Served from our own platform so nothing is fetched from outside.

- tesseract.min.js, worker.min.js  : tesseract.js 5.1.1 (Apache-2.0)
- tesseract-core-lstm.wasm.js      : tesseract.js-core 5.1.1, LSTM build (Apache-2.0)
- eng.traineddata.gz               : @tesseract.js-data/eng 1.0.0, 4.0.0_best_int (Apache-2.0)
- hin.traineddata.gz               : @tesseract.js-data/hin 1.0.0, 4.0.0_best_int (Apache-2.0)
Licence text: LICENSE-tesseract.txt. To update, take the same files from the npm packages above.

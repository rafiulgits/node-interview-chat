import SafeEval from "safe-eval";
import { PythonShell } from "python-shell";

const CASE_INPUT = "input";
const CASE_OUTPUT = "output";
const CODE_ACCEPT = "accept";
const CODE_WRONG = "worng";

const caseParser = (data, key) => {
  if (data === null || typeof data === "undefined") {
    throw new Error("invalid type of data");
  }
  if (Array.isArray(data)) {
    // multiple
    let inputs = [];
    data.forEach((item) => {
      inputs.push(item[key]);
    });
    return inputs;
  }
  try {
    return [data[key]];
  } catch (error) {}
  return null;
};

const isEquivalent = (actualItem, foundItem) => {
  if (typeof actualItem === typeof foundItem) {
    return actualItem === foundItem;
  }
  if (typeof actualItem === "number") {
    return actualItem === Number(foundItem);
  }
  return false;
};

const getEquivalentValue = (actualItem, foundItem) => {
  if (typeof actualItem === typeof foundItem) {
    return foundItem;
  }
  if (typeof actualItem !== "number") {
    return foundItem;
  }
  if (isNaN(foundItem)) {
    return foundItem;
  }
  if (actualItem % 1 === 0) {
    return Number.parseInt(foundItem);
  }
  return Number.parseFloat(actualItem);
};

const outputParser = (actual, found) => {
  // actual and found should be array
  if (actual.length !== found.length) {
    return {
      status: CODE_WRONG,
      found: found,
      actual: actual,
    };
  }
  var parsedOutput = [];
  var isWrong = false;
  for (var i = 0; i < actual.length; i++) {
    if (!isEquivalent(actual[i], found[i])) {
      let item = getEquivalentValue(actual[i], found[i]);
      parsedOutput.push(item);
      isWrong = true;
    } else {
      parsedOutput.push(actual[i]);
    }
  }
  return {
    status: isWrong ? CODE_WRONG : CODE_ACCEPT,
    found: parsedOutput,
    actual: actual,
  };
};

const callbackWithOutputValidation = (actual, found, callback) => {
  let result = outputParser(actual, found);
  callback(null, result);
};

export const runPython = (code, sampleCases, callback) => {
  if (sampleCases === null) {
    runPythonScriptOnly(code, callback);
  } else {
    runPythonWithSampleCases(code, sampleCases, callback);
  }
};

const runPythonScriptOnly = (code, callback) => {
  PythonShell.runString(code, null, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const runPythonWithSampleCases = (code, sampleCases, callback) => {
  let totalInputs = caseParser(sampleCases, CASE_INPUT);
  let sourceCode = pythonSourceCodeBuilder(code, totalInputs);

  PythonShell.runString(sourceCode, null, (err, result) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      let actual = caseParser(sampleCases, CASE_OUTPUT);
      console.log(result);
      var found = "N/A";
      if (result.length > 0) {
        try {
          found = JSON.parse(result);
        } catch (err) {}
      }
      callbackWithOutputValidation(actual, found, callback);
    }
  });
};

const pythonSourceCodeBuilder = (userCode, inputs) => {
  /*
  __results__ = []
  __inputs__ = []

  def main(arg):
    pass


  for item in __inputs__ :
    __result__ = main(item)
    __results__.append(__result__)

  print(__results__)
  */

  let sourceCode = `__results__ = []\n__inputs__ = ${JSON.stringify(inputs)}\n`;
  sourceCode += `${userCode}\n`;
  sourceCode += "for item in __inputs__ :\n";
  sourceCode += "\t__result__ = main(item)\n";
  sourceCode += "\t__results__.append(__result__)\n";
  sourceCode += "print(__results__)";
  console.log(sourceCode);
  return sourceCode;
};

export const runJavaScript = (code, sampleCases, callback) => {
  if (sampleCases === null) {
    runJsScriptOnly(code, callback);
  } else {
    runJsWithSampleCases(code, sampleCases, callback);
  }
};

const runJsScriptOnly = (code, callback) => {
  try {
    let result = SafeEval(code);
    if (typeof result === "function") {
      try {
        let funcResult = result();
        callback(null, funcResult);
      } catch (funcError) {
        callback(funcError, null);
      }
    } else {
      callback(null, result);
    }
  } catch (err) {
    console.log(err);
    callback(err, null);
  }
};

const runJsWithSampleCases = (code, sampleCases, callback) => {
  let sourceCode = jsSourceCodeBuilder(code);
  let input = caseParser(sampleCases, CASE_INPUT);
  let context = { arg: input };
  try {
    let foundResult = SafeEval(sourceCode, context)();
    let actualResult = caseParser(sampleCases, CASE_OUTPUT);
    callbackWithOutputValidation(actualResult, foundResult, callback);
  } catch (err) {
    callback(err, null);
  }
};

const jsSourceCodeBuilder = (userCode) => {
  return `
      function __main__(){
          var __results = [];
          ${userCode}
          for(var i=0; i<arg.length; i++){
              let __result = main(arg[i]);
              __results.push(__result);
          }
          return __results;
      }
      `;
};

const ConsonantRegex = /^[ㄱ-ㅎ]+$/;
const VowelRegex = /^[ㅏ-ㅣ]+$/;

function checkInputValid(inputText: string): boolean {
  const isInputConsonant = ConsonantRegex.test(inputText);
  const isInputVowel = VowelRegex.test(inputText);

  const isInputValid = isInputConsonant && isInputVowel;
  if (!isInputValid) {
    return false;
  }
  return isInputValid;
}

export default checkInputValid;

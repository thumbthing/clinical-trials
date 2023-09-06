const ConsonantRegex = /^[ㄱ-ㅎ]+$/;
const VowelRegex = /^[ㅏ-ㅣ]+$/;

function checkInputValid(inputText: string): boolean {
  const isInputConsonant = !ConsonantRegex.test(inputText);
  const isInputVowel = !VowelRegex.test(inputText);
  const isInputNotEmpty = inputText.length !== 0;

  const isInputValid = isInputConsonant && isInputVowel && isInputNotEmpty;
  if (isInputValid) {
    return isInputValid;
  }
  return false;
}

export default checkInputValid;

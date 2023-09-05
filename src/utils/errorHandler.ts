const handleError = (error: Error | unknown) => {
  let errorMessage = 'Unknown Error';

  if (error instanceof Error) {
    errorMessage = `Occurred Error: ${error.message}`;
  } else {
    const UnoccurredErrorMessage = error as Error;
    errorMessage = `Unoccurred Error: ${UnoccurredErrorMessage.message}`;
  }
  alert(errorMessage);
};
export default handleError;

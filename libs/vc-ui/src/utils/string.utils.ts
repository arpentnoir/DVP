export const capitaliseFirstLetter = (text: string) => {
  if (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
};

export const constructPath = (path: string[]) => {
  return path.reduce((previousValue, path) => {
    return path ? `${previousValue}/${path}` : '';
  }, '');
};

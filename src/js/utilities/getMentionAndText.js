export function getMentionAndText(string) {
  const matches = string.match(/^@(\w+)(.+)/);

  if (matches) {
    return [matches[1], matches[2]];
  } else {
    return false;
  }
}
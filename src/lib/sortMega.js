function sortMega(lhs, rhs) {
  const megaRe = /-Mega(-(X|Y|Z))?$/;
  const isLhsMega = megaRe.test(lhs);
  const isRhsMega = megaRe.test(rhs);
  if (isLhsMega && !isRhsMega) {
    return -1
  }
  if (isLhsMega == isRhsMega) {
    return 0;
  }
  return 1;
}

export { sortMega };
export default sortMega;

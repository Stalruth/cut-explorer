
function getOrdinal(top, isTitle) {
  if (top === 1) {
    return `1st${isTitle ? ' Place' : ''}`;
  } else if (top === 2) {
    return `2nd${isTitle ? ' Place' : ''}`;
  } else if (top) {
    return `Top ${top}`;
  }
  return '';
}

export { getOrdinal };
export default getOrdinal;

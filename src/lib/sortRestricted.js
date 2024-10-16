const restrictedPokemon = [
  "Mewtwo",
  "Ho-Oh",
  "Lugia",
  "Groudon",
  "Kyogre",
  "Rayquaza",
  "Dialga",
  "Dialga-Origin",
  "Palkia",
  "Palkia-Origin",
  "Giratina",
  "Giratina-Origin",
  "Reshiram",
  "Zekrom",
  "Kyurem",
  "Kyurem-Black",
  "Kyurem-White",
  "Xerneas",
  "Yveltal",
  "Zygarde",
  "Zygarde-10%",
  "Solgaleo",
  "Lunala",
  "Necrozma",
  "Necrozma-Dawn-Wings",
  "Necrozma-Dusk-Mane",
  "Zacian",
  "Zacian-Crowned",
  "Zamazenta",
  "Zamazenta-Crowned",
  "Eternatus",
  "Calyrex",
  "Calyrex-Ice",
  "Calyrex-Shadow",
  "Koraidon",
  "Miraidon",
  "Terapagos",
  "Terapagos-Terastal"
];

function sortRestricted(a, b) {
  if (restrictedPokemon.includes(a) === restrictedPokemon.includes(b)) {
    return 0;
  }
  if (restrictedPokemon.includes(a)) {
    return -1;
  }
  if (restrictedPokemon.includes(b)) {
    return 1;
  }
  return 0;
}

export { sortRestricted };
export default sortRestricted;


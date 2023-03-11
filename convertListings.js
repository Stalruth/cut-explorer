import { writeFile } from 'fs/promises';
import { Team } from '@pkmn/sets';

const { default: tourInfo } = await import(`./listings/${process.argv[2]}.json`, {assert: {type: 'json'}});

const teams = {
  name: tourInfo.name,
  stages: tourInfo.stages,
  dates: tourInfo.dates,
  teams: await Promise.all(tourInfo.players.map(async (player) => {
    const teamData = (await (await fetch(`${player.paste}/json`)).json()).paste;
    const team = Team.import(teamData).team.map(set=>{
      if(set.species === 'Tauros-Paldea-Water') {
        set.species = 'Tauros-Paldea-Aqua';
      } else if(set.species === 'Tauros-Paldea-Fire') {
        set.species = 'Tauros-Paldea-Blaze';
      } else if(set.species === 'Tatsugiri-Curly') {
        set.species = 'Tatsugiri';
      }
      return set;
    });
    return {
      ...player,
      team,
    };
  })),
};

await writeFile(`static/data/${process.argv[2]}.json`, JSON.stringify(teams, (key, value)=>{
  if(key === "team") {
    return value.map(el => ({
      ...el,
      gender: undefined,
      level: undefined,
      name: undefined,
    }));
  }
  if(key === "dates") {
    return undefined;
  }
  if(value === "") {
    return undefined;
  }
  return value;
}));


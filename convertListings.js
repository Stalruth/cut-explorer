import { readFile } from 'fs/promises';
import { writeFileSync } from 'fs';
import { Team } from '@pkmn/sets';

const { default: tourInfo } = await import(`./listings/${process.argv[2]}.json`, {assert: {type: 'json'}});

const teams = {
  name: tourInfo.name,
  explorer_name: tourInfo.explorer_name ?? undefined,
  dates: tourInfo.dates,
  teams: await Promise.all(tourInfo.players.map(async (player) => {
    const teamData = player.paste ? (await (await fetch(`${player.paste}/json`)).json()).paste : await readFile(`${player.pasteFile}`, {encoding: 'utf-8'});
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
    const teammates = team.map(el=>el.species);
    return {
      ...player,
      team: team.map(el=>{
        el.teammates = teammates.filter(i=>(i != el.species));
        return el;
      }),
    };
  })),
};

writeFileSync(`static/data/${process.argv[2]}.json`, JSON.stringify(teams, (key, value)=>{
  if(['gender','level'].includes(key)) {
    return undefined;
  }
  if(value === "") {
    return undefined;
  }
  return value;
}));


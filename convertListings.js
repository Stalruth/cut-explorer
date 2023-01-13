import { readFileSync, writeFileSync } from 'fs';
import { Team } from '@pkmn/sets';

const { default: tourInfo } = await import(`./listings/${process.argv[2]}.json`, {assert: {type: 'json'}});

const teams = {
  name: tourInfo.name,
  dates: tourInfo.dates,
  teams: await Promise.all(tourInfo.players.map(async (player) => {
  const teamData = await (await fetch(`${player.paste}/json`)).json();
  const team = Team.import(teamData.paste).team;
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

writeFileSync(`src/lib/${process.argv[2]}.json`, JSON.stringify(teams, (key, value)=>{
  if(['gender','level'].includes(key)) {
    return undefined;
  }
  if(value === "") {
    return undefined;
  }
  return value;
}));


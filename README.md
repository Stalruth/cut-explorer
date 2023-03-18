# Top Cut Explorer

Adding a tournament:
- Make a new file in `./listings/`
  - The file should be called `[type]-[place].json` e.g.
    - `regional-san-diego.json`
    - `special-utrecht.json`
    - `international-oceania.json`
        - Internationals are named after the Region not the City (`international-oceania.json` NOT `international-melbourne.json`)
  - Schema is detailed below
- Run `node convertListings.js [type]-[place]`
- Test and commit both the `./listings` and `./static/data` folders.

https://cut-explorer.stalruth.dev/

# Listing Schema

- `name`: The name of the tournament, generally "2023 \[place] \[type]"
- `stages`: For tournaments with multiple stages outside of Day 1 Swiss, this is an array of Objects as follows:
    - `name`: Name of the stage (usually "Day 2" or "Top X")
    - `count`: (int, optional) Amount of players (from 1st place) included in the stage. If not provided, assumed to be all players in the list.
- `dates`: Object as follows:
    - `start`: `YYYY-MM-DD` of the tournament start date
    - `end`: `YYYY-MM-DD` of the tournament end date
- `players` Array of Player objects as follows:
    - `name`: Name of the player, generally as listed in RK9Labs with changes made for capitalisation.
    - `paste`: a URL on https://pokepast.es/ with the player's teamlist (generally provided by VGCPastes)
    - `swiss`: an Object as follows:
        - `wins`: (int) wins during Swiss rounds
        - `losses`: (int) losses during Swiss rounds
        - `place`: (int) placement at the end of Swiss rounds
    - `top`: (int) The final top-X ranking of the player for the purposes of awarding prizes
        - Winner gets a value of 1, runner up gets 2
        - All other places get 4, 8, 16, 32, 64 etc as appropriate (powers of two only unless relevant for prizing).
        - "this tour isn't in the Western/TPCi circuit so there is no prizing except for fir--" shut up and treat it as if it was a TPCi tour stfu.

# TODO

- learn visualisation
- try not to ddos pokepaste
- keep up with tours
- HOME sprites maybe???


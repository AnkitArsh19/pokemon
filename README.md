# DevTown — A Pokémon FireRed Portfolio

A full-stack portfolio disguised as a functioning Pokémon FireRed replica.

Why build a standard scrolling website when you can build Pallet Town? This project is an interactive, playable portfolio where my actual engineering projects and personal background are hidden inside the houses and signboards of a fully functioning top-down 2D RPG.

This isn't just a visual mockup. It is a playable game engine built with React and Phaser 3.

## Features

- **The Cinematic Intro:** A fully recreated FireRed intro sequence (Gengar vs. Nidorino) that transitions into the classic Title Screen and Start menu.
- **Pallet Town Map & Movement:** Tile-based collision, grid movement, and authentic sprite animations.
- **Interactive Portfolio Houses:** Enter buildings to read about my real-world projects, system architectures, and personal background.
- **Authentic Wild Encounters:** Walk through the tall grass to trigger wild Pokémon battles.
- **Full Battle Mechanics:** 
  - Turn-based combat with authentic Gen 1 / Gen 3 formulas.
  - Type effectiveness (Super Effective, Not Very Effective, Immunities).
  - Catch mechanics using Pokéballs with accurate catch-rate calculations.
  - Experience points, leveling up, and stat scaling.
- **Party Management:** Catch and manage up to 6 Pokémon in your active party. Swap them out during battle or from the menu.
- **The Pokédex:** A working Pokédex that tracks your "Seen" and "Owned" Pokémon as you explore and battle.
- **Audio & SFX:** Authentic background music that transitions dynamically (Pallet Town, Battle, Victory), alongside original sound effects for attacks, taking damage, catching, and UI interactions.

## Acknowledgments

A massive thank you to the open-source project **[pokevue](https://github.com/mmorainville/pokevue)**. 
Studying that repository provided critical context for tilemap loading, sprite management, and movement mechanics. It served as a fantastic springboard for extracting resources, understanding the grid logic, and eventually rebuilding and expanding the engine in React.

## Legal & License Disclaimer

**This is a strictly personal, non-commercial, and educational project.**

- I do not own the rights to Pokémon, the character designs, the audio, or the sprites. 
- All Pokémon-related intellectual property belongs entirely to **Nintendo, Game Freak, and The Pokémon Company**.
- **This project is NOT for sale.** It is not intended for any business, commercial, or profit-generating use. It is simply a passionate developer's fun way to showcase their coding abilities.
- You are not permitted to sell, monetize, or commercially distribute this repository or any of its assets.

The underlying original source code (the React/Phaser engine architecture) is provided under the MIT License for educational reference, but the assets remain the property of their respective copyright holders.

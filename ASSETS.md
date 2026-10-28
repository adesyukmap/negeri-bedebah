# Assets and licenses

The MIT license in `LICENSE` covers the code only. Character art and audio have their own terms.

| Path | Source | Terms |
|---|---|---|
| `assets/music/menu.m4a`, `calm.m4a`, `tense.m4a`, `win.m4a` | Generated with Stable Audio for the game Kingdoms at War (adesyukmap/kingdoms-at-war), owned by Adesyukma Pamungkas | Stability AI Community License |
| `assets/music/santai.m4a` | Generated with Stable Audio 3 Medium by Hermes (adesyukmap/hermes-office, `audio/tdj-reel-01/music_v1.wav`), trimmed and loudness-normalized | Stability AI Community License |
| `assets/sfx/*.m4a` | Generated with Stable Audio 3 Small SFX by Hermes (adesyukmap/hermes-office, `audio/tdj-reel-01/sfx`), trimmed and normalized | Stability AI Community License |

| `assets/sfx/h_*.m4a`, `assets/music/politik.m4a`, `ptense.m4a`, `pwin.m4a` | Generated with Stable Audio 3 (Small for SFX, Medium for music and scene beds) by Hermes (adesyukmap/hermes-office, `audio/kepulauan-cuan`), best of 3 variants, trimmed and normalized | Stability AI Community License |
| `assets/chars/*.webp` | Generated with Google Gemini from the costume prompts in `assets/chars/PROMPT-*.txt`, background removed and cropped with `assets/chars/proc.py`. all from one Gemini conversation for a consistent style | CC BY-NC 4.0 (`LICENSE-ASSETS.md`) |

All other sound effects are synthesized in code (`src/ui/11_audio.js`) and fall under the MIT license.

Cities and buildings are drawn in code. Characters without a sprite fall back to the code-drawn version. All characters are fictional archetypes. Do not add likenesses, caricatures, names or logos of real people, parties or companies (see CONTRIBUTING.md).

When you add an asset, add a row here with its source and license. Assets without a clear license will not be merged.

# Question Ball (editable source)

Open `index.html` in a browser to play locally.

- `index.html`: page layout and visible labels
- `style.css`: fonts, colors, sizes, responsive styles
- `script.js`: 30 default questions, categories, drawing, editor and storage

The site loads Pretendard from a CDN, so an internet connection is needed to load that font. The rest of the app works offline.

## Deploy to GitHub Pages

Upload **index.html, style.css, script.js** to the root of the `gxxo/question-ball` repository. Keep the names unchanged. In Settings > Pages, deploy from `main` / `(root)`.

## Editing default questions

Change entries in `BASE` at the top of `script.js`. If you already opened the game, localStorage may contain the previous question set. Click 질문 편집 > 기본 질문 복원 to reload default questions, or clear local site data.

Note: in-page edits are stored in that browser only; changing questions for everyone requires editing `script.js` on GitHub.

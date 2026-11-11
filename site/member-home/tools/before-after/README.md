# Before and after slider

A self-contained tool. Drag a line to reveal the "after" picture over the "before" picture. Numbered dots explain each change.

- `index.html`, `page.css`, `page.js`: the tool page (choose two own pictures, add or move notes, download as one page).
- `view.css`, `view.js`: the slider itself. Also copied into the one-page download.
- `sample/before.svg`, `sample/after.svg`: two matched sample pictures drawn for this tool (same walls, same camera).

No outside code. Pictures and notes stay in the browser (IndexedDB `hfl-before-after`). Works with mouse, finger and keyboard.
Follows the site's page-security rule: no inline scripts, pictures only as files or `data:`.

To list it on the Tools page, add one card that links to `before-after/index.html`.

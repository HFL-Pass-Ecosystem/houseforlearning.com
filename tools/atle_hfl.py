#!/usr/bin/env python3
"""House for Learning: ATLE(it) ribbon under the top of every page and a strip above each footer, linking to atle.html.
Keeps the owner-proofed atle.html and assets/atle/ as they are (links only). Run by rebuild_all after build_nav."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent / 'atle'))
import atle
atle.apply(str(pathlib.Path(__file__).resolve().parents[1] / 'site'), 'hfl', links_only=True)

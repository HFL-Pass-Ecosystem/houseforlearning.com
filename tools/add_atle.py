#!/usr/bin/env python3
"""ATLE(it) logo, strip and funnel page on every site page (see tools/atle/atle.py). Idempotent. No network."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools' / 'atle'))
import atle
atle.apply(ROOT / 'site', 'hfl')

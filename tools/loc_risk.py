"""Risk lesson for courses whose local price sheet shows a thin margin or no break-even after a 25% price fall.
Data: tools/loc_risk_sheet.json (estimates, from the ahfl-workspace price-review/local sheets). Amounts are shown as estimates, never as quotes."""
import json, pathlib
try: RISK = json.load(open(pathlib.Path(__file__).parent / 'loc_risk_sheet.json'))['rows']
except Exception as _ex: RISK = {}; print('skip risk sheet', _ex)
PLACE = {'mx': 'Mexico', 'in': 'India'}

def note(k, slug, e):
    """HTML paragraph for place k (mx or in) and sheet key slug, or '' when the sheet does not flag the course."""
    r = RISK.get(k, {}).get(slug)
    if not r: return ''
    c, p, v, f, u = ('Rs' if r['cur'] == 'INR' else r['cur']), r['price'], r['cost'], r['fixed'], r['unit']
    if r['be25'] is None:
        tail = (f'If the price falls 25% to about {c} {r["low"]:,.0f}, it is at or below the unit cost of {c} {v:,}, so every sale loses money and there is no break-even. '
                'Plan a price floor or a lower cost before you launch.')
    else:
        tail = (f'If the price falls 25% to about {c} {r["low"]:,.0f}, break-even rises from {r["be"]:,} to {r["be25"]:,} units a month. '
                'Plan a price floor or a lower cost before you launch, and test the plan at the lower price.')
    return ('<p class="ws-note"><strong>Risk lesson (estimates, not quotes).</strong> '
            f'In {PLACE[k]} a rough sheet figure is {c} {p:,} per {e(u)} against a unit cost of {c} {v:,} and a fixed cost of {c} {f:,} a month: a margin of about {r["margin"]:.0f}% and a break-even of about {r["be"]:,} units a month. '
            f'{tail} These sheet figures are separate from the sample numbers in the modules. Check them with a local price expert.</p>')

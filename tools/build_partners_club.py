#!/usr/bin/env python3
"""Builds the Build Partners Club: a closed space for the people who design, build, fit and look after our campuses.
Pages: site/build-partners.html (the club), site/build-partners-csi.html (the campus specification set out by CSI
MasterFormat division, with section references) and site/build-partners-packs.html (one pack per kind of partner).
Closed: the pages are noindex, are not in the menu or the sitemap, and assets/club-gate.js asks the members service
who is signed in. Until that service is switched on the pages stay readable by link, so they carry no prices,
no names of people or firms and no addresses. Runs after build_campus_spaces."""
import html
import build_campus_bim as B
import campus_bim_data as D
import build_campus_spaces as SP
e = html.escape
sec, ul, table, hero, ctas, SAFE = B.sec, B.ul, B.table, B.hero, B.ctas, B.SAFE
HUB = ('build-partners.html', 'Build Partners Club')
EDITION = 'Section numbers and titles follow CSI MasterFormat, 2018 edition. Where a contract names another edition, that edition rules; the lead consultant confirms each number against the licensed copy before issue.'

ROLES = [
 ('consultants', 'Consultants', 'Architects, engineers, cost and project managers.', 'You turn the standard into a design for one site, coordinate the model and sign what the law asks you to sign.',
  ['00', '01'], ['Design brief and campus type', 'Space schedule and room data', 'The whole specification, all divisions', 'LOD stage plan and check sheet'], ['Drawings and models at each stage', 'Specification sections, edited for the site', 'Clash and check reports', 'Approvals from the authorities']),
 ('contractors', 'Contractors', 'Main and fit-out contractors.', 'You build what is drawn, in the order agreed, and hand over a campus that matches the model.',
  ['01', '02', '03', '05', '06', '07', '08', '09', '10', '13'], ['Issued-for-construction drawings and models', 'Specification sections for your scope', 'Programme and sequence', 'Quality and safety rules'], ['Shop drawings and samples', 'Method statements', 'Programme updates', 'As-built drawings and manuals']),
 ('developers', 'Developers', 'Land owners, landlords and development partners.', 'You bring the site or the shell. We agree what the building gives us and what we fit ourselves.',
  ['00', '01', '31', '32', '33'], ['Site rules and campus tiers', 'What we need from the base building', 'Our fit-out sequence', 'Hand-over checklist'], ['Site and base-building information', 'Service capacities', 'Access and working rules', 'Permits that sit with the owner']),
 ('installers', 'Installers', 'Specialist trades: glass, joinery, ceilings, floors, furniture, signs.', 'You make and fit one part, exactly to its section, and prove it with a sample first.',
  ['06', '08', '09', '10', '12'], ['The sections for your part', 'Setting-out drawings', 'Interface notes with other trades', 'Sample and mock-up rules'], ['Shop drawings', 'Samples and mock-ups', 'Test and inspection records', 'Care and maintenance sheets']),
 ('integrators', 'Integrators', 'Audio-visual, network, security and building-control specialists.', 'You make the technology work as one system that a teacher can use without a manual.',
  ['25', '26', '27', '28'], ['Room-by-room technology schedule', 'Sections for communications, safety and controls', 'Network and naming rules', 'Commissioning scripts'], ['Schematics and rack layouts', 'Programming and configuration files', 'Commissioning results', 'Training for campus staff']),
 ('service', 'Service providers', 'Facility management, cleaning, maintenance and support firms.', 'You keep the campus safe, clean and working from the first day of use.',
  ['01', '21', '22', '23', '26'], ['As-built model and asset list', 'Operation and maintenance manuals', 'Service levels and inspection plan', 'Fault reporting route'], ['Planned maintenance programme', 'Inspection and test records', 'Monthly service report', 'Improvement proposals']),
]

# (division, title, what it covers on our campus, [(section, title, our requirement, our code or page)])
DIVS = [
 ('00', 'Procurement and Contracting Requirements', 'How work is invited, priced and agreed.', [
  ('00 11 00', 'Advertisements and Invitations', 'Invitations go to club members whose pack covers the scope.', 'build-partners-packs.html'),
  ('00 21 00', 'Instructions', 'One set of instructions, issued here, with the list of documents and their revision.', ''),
  ('00 41 00', 'Bid Forms', 'Prices are returned on our form, by section number, so offers can be compared line by line.', ''),
  ('00 72 00', 'General Conditions', 'The conditions of contract named in the invitation.', '')]),
 ('01', 'General Requirements', 'The rules every partner works under.', [
  ('01 10 00', 'Summary', 'Campus type, climate annex and campus number.', 'campus-builds.html'),
  ('01 31 00', 'Project Management and Coordination', 'One model, one file naming rule, one meeting rhythm.', 'campus-std-bim.html'),
  ('01 32 00', 'Construction Progress Documentation', 'Programme by the build order of the campus type; weekly update.', 'campus-training-zone.html'),
  ('01 33 00', 'Submittal Procedures', 'Shop drawings, samples and data are submitted by section number and answered in one place.', ''),
  ('01 40 00', 'Quality Requirements', 'Ten-point check sheet at the end of every stage; mock-up of one room before the rest.', 'campus-lod-plan.html'),
  ('01 50 00', 'Temporary Facilities and Controls', 'Site protection, signs, power and water during the work.', ''),
  ('01 77 00', 'Closeout Procedures', 'Snagging, final inspection and hand-over.', 'campus-lod-plan.html'),
  ('01 78 00', 'Closeout Submittals', 'As-built model at LOD 500, manuals, warranties and the asset list.', 'campus-std-bim.html'),
  ('01 91 00', 'Commissioning', 'Every system is tested with the room full and the results are recorded.', 'campus-std-services.html')]),
 ('02', 'Existing Conditions', 'Work inside an existing building.', [
  ('02 41 19', 'Selective Demolition', 'Strip-out of old ceilings, partitions and cabinets; fire systems stay live.', 'campus-training-zone.html')]),
 ('03', 'Concrete', 'Bases under the modules.', [
  ('03 30 00', 'Cast-in-Place Concrete', 'Pads or strips under module corners, sized by the engineer for the site.', 'campus-std-shell.html')]),
 ('05', 'Metals', 'Frames, stairs and rails.', [
  ('05 12 00', 'Structural Steel Framing', 'Module frames and stacking connections.', 'CS-SH-01'),
  ('05 51 00', 'Metal Stairs', 'Straight stair and wide learning stair.', 'CS-SH-03, CS-SH-04'),
  ('05 52 00', 'Metal Railings', 'Rails to stairs, terraces and ramps.', 'campus-std-safety.html')]),
 ('06', 'Wood, Plastics, and Composites', 'Joinery made for the campus.', [
  ('06 20 00', 'Finish Carpentry', 'Skirting and trims, white.', 'CS-IN'),
  ('06 40 00', 'Architectural Woodwork', 'Media wall, refreshment cabinet, mobile cabinets and benches.', 'campus-training-zone.html')]),
 ('07', 'Thermal and Moisture Protection', 'Keeping heat, cold and water out.', [
  ('07 21 00', 'Thermal Insulation', 'Insulation by climate annex.', 'campus-annex-hot-dry.html'),
  ('07 42 13', 'Metal Wall Panels', 'Outer wall panels of the module.', 'CS-SH-01'),
  ('07 50 00', 'Membrane Roofing', 'Roof finish and terrace build-up.', 'CS-SH-02'),
  ('07 84 00', 'Firestopping', 'Every service opening through a rated wall or floor is sealed.', 'campus-std-safety.html'),
  ('07 92 00', 'Joint Sealants', 'Joints between modules and around glass.', 'campus-std-shell.html')]),
 ('08', 'Openings', 'Doors, glass and their hardware.', [
  ('08 11 13', 'Hollow Metal Doors and Frames', 'Fire-exit doors with push bar.', 'CS-IN-07'),
  ('08 14 16', 'Flush Wood Doors', 'Room doors.', 'CS-IN'),
  ('08 42 26', 'All-Glass Entrances', 'Double glass door, full height, to studios and training zones.', 'CS-SH-06'),
  ('08 71 00', 'Door Hardware', 'Handles, closers, locks and access-control fittings.', 'campus-std-interiors.html'),
  ('08 80 00', 'Glazing', 'Glass walls and interior glass partitions, toughened, 12 mm full height.', 'CS-SH-05'),
  ('08 87 00', 'Glazing Surface Films', 'Frosted band with the room name.', 'campus-spaces.html')]),
 ('09', 'Finishes', 'What you see and touch.', [
  ('09 22 16', 'Non-Structural Metal Framing', 'Partition frames.', 'CS-IN'),
  ('09 21 16', 'Gypsum Board Assemblies', 'Partitions, filled and sanded for paint.', 'CS-IN'),
  ('09 51 00', 'Acoustical Ceilings', '600 by 600 mm tiles on a standard grid.', 'CS-IN'),
  ('09 65 00', 'Resilient Flooring', 'Dry-area floor finish.', 'CS-IN-05'),
  ('09 30 00', 'Tiling', 'Wet-area floor and wall finish.', 'CS-IN-06'),
  ('09 68 13', 'Tile Carpeting', 'Carpet tiles in training zones, silent areas and libraries.', 'campus-training-zone.html'),
  ('09 84 00', 'Acoustic Room Components', 'Sound-absorbing panels and curtains in quiet spaces.', 'campus-spaces.html'),
  ('09 91 00', 'Painting', 'White matt, floor to ceiling; one accent wall in grey or our blue.', 'campus-spaces.html'),
  ('09 96 00', 'High-Performance Coatings', 'Writable wall finish, floor to ceiling.', 'campus-training-zone.html')]),
 ('10', 'Specialties', 'Boards, signs, lockers and folding walls.', [
  ('10 11 00', 'Visual Display Units', 'Writable and magnetic glass boards; whiteboards in each break-out.', 'campus-training-zone.html'),
  ('10 14 00', 'Signage', 'Room names, wayfinding, values wall and wall of honour.', 'campus-spaces.html'),
  ('10 22 39', 'Folding Panel Partitions', 'Folding wall between studios.', 'CS-IN-03'),
  ('10 21 13', 'Toilet Compartments', 'Washroom cubicles.', 'campus-std-interiors.html'),
  ('10 28 00', 'Toilet, Bath, and Laundry Accessories', 'Washroom fittings.', 'campus-std-interiors.html'),
  ('10 44 00', 'Fire Protection Specialties', 'Extinguishers and cabinets.', 'campus-std-safety.html'),
  ('10 51 00', 'Lockers', 'One locker for each learner.', 'campus-spaces.html')]),
 ('11', 'Equipment', 'Equipment fixed to the building.', [
  ('11 40 00', 'Foodservice Equipment', 'Coffee corner, serving line and cafeteria equipment.', 'campus-spaces.html'),
  ('11 52 13', 'Projection Screens', 'Motorised screen in the media wall.', 'campus-training-zone.html')]),
 ('12', 'Furnishings', 'Furniture, blinds and plants.', [
  ('12 24 13', 'Roller Window Shades', 'Motorised blackout blinds with one remote.', 'campus-training-zone.html'),
  ('12 32 00', 'Manufactured Wood Casework', 'Storage and shelving.', 'CS-FU-05'),
  ('12 51 00', 'Office Furniture', 'Desks, folding tables on wheels and high tables.', 'CS-FU-01, CS-FU-02'),
  ('12 52 00', 'Seating', 'Learner seats, stools and soft seating.', 'CS-FU-06'),
  ('12 56 00', 'Institutional Furniture', 'Study booths and pods.', 'CS-FU-03, CS-FU-04'),
  ('12 92 00', 'Interior Planters and Artificial Plants', 'Planters in every shared space.', 'campus-spaces.html')]),
 ('13', 'Special Construction', 'The module itself.', [
  ('13 42 00', 'Building Modules', 'Flat-pack module, factory made, stacked to two floors.', 'CS-SH-01'),
  ('13 34 19', 'Metal Building Systems', 'Shade canopy and covered walkway bays.', 'CS-SH-10')]),
 ('14', 'Conveying Equipment', 'Step-free movement between floors.', [
  ('14 42 00', 'Wheelchair Lifts', 'Platform lift where a campus has two floors.', 'CS-SH-09')]),
 ('21', 'Fire Suppression', 'Putting a fire out.', [
  ('21 13 13', 'Wet-Pipe Sprinkler Systems', 'Where local rules or the host building require sprinklers.', 'campus-std-safety.html')]),
 ('22', 'Plumbing', 'Water in and out.', [
  ('22 11 00', 'Facility Water Distribution', 'Cold and hot water to wet modules.', 'campus-std-services.html'),
  ('22 13 00', 'Facility Sanitary Sewerage', 'Drainage from wet modules.', 'campus-std-services.html'),
  ('22 40 00', 'Plumbing Fixtures', 'Basins, toilets and sinks.', 'campus-std-services.html')]),
 ('23', 'Heating, Ventilating, and Air Conditioning', 'Fresh air and comfort.', [
  ('23 05 93', 'Testing, Adjusting, and Balancing for HVAC', 'Air flows measured and balanced with the room full.', 'campus-std-services.html'),
  ('23 09 00', 'Instrumentation and Control for HVAC', 'Thermostat inside each room.', 'CS-SV-02'),
  ('23 31 00', 'HVAC Ducts and Casings', 'Insulated ducts with acoustic lining near the unit.', 'campus-std-services.html'),
  ('23 37 00', 'Air Outlets and Inlets', 'White grilles set out on the ceiling grid.', 'campus-std-services.html'),
  ('23 81 00', 'Decentralized Unitary HVAC Equipment', 'Cooling and heating units sized by a heat-load calculation.', 'CS-SV-02')]),
 ('25', 'Integrated Automation', 'One simple control for a room.', [
  ('25 50 00', 'Integrated Automation Facility Controls', 'One panel for light scenes, blinds and screen in each training zone.', 'campus-training-zone.html')]),
 ('26', 'Electrical', 'Power and light.', [
  ('26 05 19', 'Low-Voltage Electrical Power Conductors and Cables', 'Power cabling.', 'CS-SV-01'),
  ('26 05 33', 'Raceway and Boxes for Electrical Systems', 'Conduits and floor boxes under team areas.', 'campus-training-zone.html'),
  ('26 05 36', 'Cable Trays for Electrical Systems', 'Trays above the ceiling for power and data.', 'campus-std-services.html'),
  ('26 09 23', 'Lighting Control Devices', 'Dimming and scene control.', 'campus-training-zone.html'),
  ('26 24 16', 'Panelboards', 'Distribution board for each floor or each twenty-four modules.', 'CS-SV-01'),
  ('26 27 26', 'Wiring Devices', 'Sockets on walls, in floor boxes and on every table.', 'campus-training-zone.html'),
  ('26 31 00', 'Photovoltaic Collectors', 'Roof solar by module.', 'CS-SV-05'),
  ('26 51 00', 'Interior Lighting', 'Dimmable 600 by 600 LED panels, 500 lux on the tables.', 'CS-SV-03'),
  ('26 52 13', 'Emergency and Exit Lighting', 'Emergency light and exit sign groups.', 'CS-SV-06')]),
 ('27', 'Communications', 'Network, sound and screens.', [
  ('27 11 00', 'Communications Equipment Room Fittings', 'Comms cabinet and patching.', 'CS-SV-04'),
  ('27 15 00', 'Communications Horizontal Cabling', 'Category 6 cabling, labelled and tested end to end.', 'campus-training-zone.html'),
  ('27 21 00', 'Data Communications Network Equipment', 'Switching and wireless access for every learner.', 'campus-std-services.html'),
  ('27 41 16', 'Integrated Audio-Video Systems and Equipment', 'Main screen, team screens, cable-first connection, wireless sharing.', 'campus-training-zone.html'),
  ('27 51 16', 'Public Address Systems', 'Ceiling speakers and amplifier.', 'campus-training-zone.html')]),
 ('28', 'Electronic Safety and Security', 'Keeping people and the campus safe.', [
  ('28 10 00', 'Access Control', 'Card readers and door controllers at entrances and comms rooms.', 'campus-std-services.html'),
  ('28 20 00', 'Video Surveillance', 'Cameras at entrances and shared areas, by local rules.', 'campus-std-services.html'),
  ('28 46 00', 'Fire Detection and Alarm', 'Detection and alarm to local code; never switched off during works.', 'campus-std-safety.html')]),
 ('31', 'Earthwork', 'Preparing the ground.', [
  ('31 20 00', 'Earth Moving', 'Levelling and compaction under module bases.', 'campus-std-tiers.html')]),
 ('32', 'Exterior Improvements', 'Outside the walls.', [
  ('32 13 00', 'Rigid Paving', 'Paths, ramps and the arrival court.', 'CS-SH-08'),
  ('32 90 00', 'Planting', 'Shade trees and planting by climate annex.', 'campus-annex-hot-dry.html')]),
 ('33', 'Utilities', 'Connections to the site.', [
  ('33 10 00', 'Water Utilities', 'Water connection.', 'campus-std-services.html'),
  ('33 30 00', 'Sanitary Sewerage', 'Drain connection.', 'campus-std-services.html'),
  ('33 70 00', 'Electrical Utilities', 'Power connection and metering.', 'campus-std-services.html')]),
]
OTHER = [('MasterFormat', 'Work results, by division and section', 'Specifications, prices and submittals from LOD 300 onward. This page.'),
         ('UniFormat', 'Building elements, by function', 'Early design and cost plans at LOD 100 and 200. Our code groups line up: CS-SH with B Shell, CS-IN with C Interiors, CS-SV with D Services, CS-FU with E Equipment and Furnishings.'),
         ('SectionFormat', 'Three parts inside each section', 'Every section we issue is written in three parts: Part 1 General, Part 2 Products, Part 3 Execution.'),
         ('OmniClass', 'Tables that classify everything in a model', 'Classification fields on model elements, so quantities and asset lists come straight from the model.')]
TRUTH = ['One place. The current drawings, models, sections and schedules are here. A file sent by email or chat is not current until it is here.',
         'One number for everything. Each item carries its CSI section number and our element code. Offers, submittals, questions and invoices quote both.',
         'One file name rule. Campus, building, level, discipline and code, as in the <a href="campus-std-bim.html">BIM and LOD rules</a>.',
         'One revision at a time. Each document shows its revision and date. Old revisions are kept, marked superseded, never deleted.',
         'One route for questions. A question is raised against a section number, answered once and visible to every partner it touches.',
         'One change log. Every change says what changed, why, who approved it and which sections it touches.',
         'No maker is named in our standard. A partner proposes products that meet the section; we approve by sample and data.']

def link(ref):
    if not ref: return ''
    if ref.endswith('.html'): return f'<a href="{ref}">Our requirement</a>'
    return f'<a href="campus-std-elements.html"><code>{e(ref)}</code></a>'

def gate(inner):
    return ('<div id="club-gate" class="wrap" hidden><div class="lux-panel"><h2>Members only</h2><p>This space is for members of the Build Partners Club. Please log in with the email address we invited.</p>'
            + ctas(('login.html', 'Log in'), ('contact.html', 'Ask to join')) + '</div></div>\n<div id="club-body">\n' + inner + '</div>\n')

def club_body():
    cards = '<ul class="cards">' + ''.join(f'<li class="card" id="{s}"><span class="tag">pack {k}</span><h3>{e(n)}</h3><p>{e(who)}</p><p>{e(what)}</p><a class="more" href="build-partners-packs.html#{s}">Open the {e(n.lower())} pack</a></li>' for k, (s, n, who, what, _, _, _) in enumerate(ROLES, 1)) + '</ul>'
    return (hero('closed space · by invitation', 'Build Partners Club', 'One club for everyone who designs, builds, fits and looks after our campuses. One space, one specification, one source of truth.',
                 ctas(('build-partners-csi.html', 'Open the specification'), ('build-partners-packs.html', 'Find your pack'))) +
            gate(f'<section class="sec" aria-label="A campus entrance"><div class="wrap"><figure class="campus-fig"><img class="fig-art" src="assets/campus/look.svg" alt="Drawing of a campus entrance with our values on the wall, a wall of honour and a room name on glass." width="640" height="320" decoding="async"></figure></div></section>\n' +
                 sec('', 'c0', 'concept renders', 'The campus we are building', '<p>All fifteen concept renders of the campus interior. Use them with the specification: the render shows the intent, the section number sets the requirement.</p>' + SP.render_grid(False)) +
                 sec('alt', 'c1', 'six kinds of partner', 'Who the club is for', cards) +
                 sec('', 'c2', 'single source of truth', 'Seven rules everyone works by', ul(TRUTH)) +
                 sec('alt', 'c3', 'what is here', 'Everything in one place', '<ul class="cards">'
                     '<li class="card"><span class="tag">specification</span><h3>Campus specification by CSI division</h3><p>Every part of a campus under its MasterFormat section number, with our requirement beside it.</p><a class="more" href="build-partners-csi.html">Open the specification</a></li>'
                     '<li class="card"><span class="tag">spaces</span><h3>Campus spaces and the look</h3><p>Twenty kinds of space, each with its purpose and our own drawing.</p><a class="more" href="campus-spaces.html">Open campus spaces</a></li>'
                     '<li class="card"><span class="tag">room</span><h3>Training zone</h3><p>Layout, fit-out, technology and build order of the standard training room.</p><a class="more" href="campus-training-zone.html">Open the training zone</a></li>'
                     '<li class="card"><span class="tag">builds</span><h3>Campus builds</h3><p>Six campus types with space schedules, coded element lists and practice models.</p><a class="more" href="campus-builds.html">Open campus builds</a></li>'
                     '<li class="card"><span class="tag">standards</span><h3>Campus standards</h3><p>Shell, interiors, furniture, services, safety and the element library.</p><a class="more" href="campus-standards.html">Open the standards</a></li>'
                     '<li class="card"><span class="tag">stages</span><h3>LOD stage plan</h3><p>Seven stages from brief to hand-over and the check sheet used at each.</p><a class="more" href="campus-lod-plan.html">Open the plan</a></li></ul>') +
                 sec('', 'c4', 'how a build runs', 'From invitation to a campus in use', '<ol class="lux-list one">' + ''.join(f'<li>{x}</li>' for x in [
                     'We issue the campus type, climate annex and campus number.', 'The consultant edits the sections for the site and coordinates the model.', 'Partners price by section number on one form.',
                     'Submittals and samples are approved here; one room is built first as a mock-up.', 'Work follows the build order; the programme is updated every week.', 'Every system is commissioned with the room full.', 'Hand-over: as-built model, manuals, asset list and training. The service provider takes over.']) + '</ol>' + SAFE)))

def csi_body():
    jump = '<p class="chips">' + ' '.join(f'<a class="chip" href="#d{d}">{d}</a>' for d, _, _, _ in DIVS) + '</p>'
    n = sum(len(r) for _, _, _, r in DIVS)
    out = hero('closed space · the specification', 'Campus specification by CSI division', f'Every part of a campus of ours, set out under its CSI MasterFormat division and section number: {len(DIVS)} divisions and {n} sections, each with our requirement beside it.',
               ctas(('build-partners.html', 'Back to the club'), ('build-partners-packs.html', 'Find your pack')))
    body = sec('', 'k0', 'how to read it', 'One number, one requirement', f'<p>Find the division, then the section. The last column takes you to our requirement or to our element code. Quote the section number in every offer, submittal and question.</p><p class="lux-note">{e(EDITION)}</p>' + jump)
    for k, (d, title, about, rows) in enumerate(DIVS):
        body += sec('alt' if k % 2 == 0 else '', f'd{d}', f'division {d}', title, f'<p>{e(about)}</p><div class="scroll-x"><table class="ws-table"><caption>Division {d}, {e(title)}</caption><thead><tr><th scope="col">Section</th><th scope="col">Title</th><th scope="col">On our campus</th><th scope="col">Read</th></tr></thead><tbody>' +
                    ''.join(f'<tr><th scope="row"><code>{s}</code></th><td>{e(t)}</td><td>{e(req)}</td><td>{link(ref)}</td></tr>' for s, t, req, ref in rows) + '</tbody></table></div>')
    body += sec('', 'k9', 'four formats', 'How the CSI formats fit our stages', table('CSI formats and where we use them', ['Format', 'What it organises', 'Where we use it'], OTHER) + f'<p class="lux-note">{e(D.NOTE)}</p>' + SAFE)
    return out + gate(body)

def packs_body():
    name = {d: t for d, t, _, _ in DIVS}
    out = hero('closed space · six packs', 'Partner packs', 'One pack for each kind of partner: what you receive from us, what you hand back and the CSI divisions that are yours.',
               ctas(('build-partners.html', 'Back to the club'), ('build-partners-csi.html', 'Open the specification')))
    body = ''
    for k, (s, n, who, what, divs, get, give) in enumerate(ROLES):
        dl = ul([f'<a href="build-partners-csi.html#d{d}">Division {d}, {e(name[d])}</a>' for d in divs])
        body += sec('' if k % 2 == 0 else 'alt', s, f'pack {k + 1} of {len(ROLES)}', n, f'<p><strong>{e(who)}</strong> {e(what)}</p><div class="split2"><div><h3>You receive</h3>{ul([e(x) for x in get])}</div><div><h3>You hand back</h3>{ul([e(x) for x in give])}</div></div><h3>Your divisions</h3>{dl}')
    return out + gate(body + sec('alt' if len(ROLES) % 2 else '', 'pz', 'every pack', 'What every pack shares', ul(TRUTH[:4]) + SAFE))

PAGES = [('build-partners', 'Build Partners Club', 'A closed space for the people who design, build, fit and look after our campuses.', club_body),
         ('build-partners-csi', 'Campus specification by CSI division', 'The campus specification set out by CSI MasterFormat division and section.', csi_body),
         ('build-partners-packs', 'Partner packs', 'What each kind of build partner receives and hands back.', packs_body)]

def build():
    chain = [HUB] + [(s + '.html', t) for s, t, _, _ in PAGES] + [HUB]
    import os
    for k, (slug, title, desc, fn) in enumerate(PAGES):
        B.page(slug, title, desc, fn(), HUB, chain[k], chain[k + 2])
        p = os.path.join(B.SITE, slug + '.html'); s = open(p, encoding='utf-8').read()
        assert '<meta name="theme-color"' in s and 'name="robots"' not in s, slug
        s = s.replace('<meta name="theme-color"', '<meta name="robots" content="noindex,nofollow">\n<meta name="theme-color"', 1)
        tag = '<script src="assets/lang.js" defer></script>'; assert tag in s
        s = s.replace(tag, tag + '\n<script src="assets/club-gate.js" defer></script>', 1)
        open(p, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    build()

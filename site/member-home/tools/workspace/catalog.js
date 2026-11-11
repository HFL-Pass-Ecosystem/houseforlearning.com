/* Sabha-Karyalaya catalogue: sectors, offerings, project models, icons.
   Sanskrit name first, English equivalent beside it. Brand-neutral: no third-party names or part numbers. */
(function (root) {
  const sectors = [
    { id: "energy", sa: "Urja", en: "Energy and Power" },
    { id: "industry", sa: "Udyog", en: "Industry and Manufacturing" },
    { id: "buildings", sa: "Nirman", en: "Buildings and Infrastructure" },
    { id: "electronics", sa: "Ardhachalak", en: "Semiconductors and Electronics" },
    { id: "learning", sa: "Vidya", en: "Education and Learning" },
    { id: "health", sa: "Arogya", en: "Healthcare" },
    { id: "finance", sa: "Dhana", en: "Finance and Investment" },
    { id: "trade", sa: "Vyapara", en: "Trade and Logistics" },
    { id: "agri", sa: "Krishi", en: "Agriculture and Land" },
    { id: "city", sa: "Nagara", en: "Public Sector and Smart City" },
    { id: "mobility", sa: "Gati", en: "Mobility and Transport" },
    { id: "digital", sa: "Anka", en: "Telecom and Digital" }
  ];

  const families = [
    { id: "hardware", sa: "Upakarana", en: "Hardware", icon: "chip" },
    { id: "software", sa: "Tantramsha", en: "Software", icon: "code" },
    { id: "cloud", sa: "Megha", en: "Cloud", icon: "cloud" },
    { id: "data", sa: "Sankhya-Vishleshan", en: "Data and Analytics", icon: "chart" },
    { id: "services", sa: "Seva", en: "Services", icon: "wrench" }
  ];

  // requires = interdependent (needs these first); standards = how it plugs into outside tools (interoperable);
  // standalone = can be sold and run alone (independent). sectors: "*" means all.
  const O = (id, family, sa, en, icon, requires, standards, sectors) => ({
    id, family, sa, en, icon, requires: requires || [], standards: standards || ["REST/OpenAPI", "CSV", "JSON"],
    standalone: !(requires && requires.length), sectors: sectors || "*"
  });
  const offerings = [
    // Hardware
    O("hw-power-dist", "hardware", "Vidyut-Vitaran", "Power distribution and control gear", "bolt", [], ["IEC-style type tests", "Modbus", "MQTT"], ["energy", "industry", "buildings", "city"]),
    O("hw-enclosures", "hardware", "Pidhika", "Enclosures and busbar systems", "box", [], ["IEC-style type tests", "CSV price book"], ["energy", "industry", "buildings", "electronics"]),
    O("hw-drives", "hardware", "Chalak", "Drives, starters and motor control", "gear", ["hw-power-dist"], ["Modbus", "OPC UA"], ["industry", "energy", "agri", "mobility"]),
    O("hw-sensors", "hardware", "Sparsha", "Sensors, meters and gateways", "sensor", [], ["MQTT", "Modbus", "OPC UA"]),
    O("hw-semis", "hardware", "Ardhachalak-Ghatak", "Semiconductor and electronic components", "chip", [], ["CSV catalogue", "REST/OpenAPI"], ["electronics", "industry", "mobility", "digital"]),
    O("hw-edge", "hardware", "Kinara-Upakarana", "Edge computers and industrial PCs", "server", [], ["MQTT", "REST/OpenAPI", "Containers"]),
    O("hw-devices", "hardware", "Upakarana", "Phones, tablets and kiosks (Hasta, Peetha, Kankana editions)", "phone", [], ["PWA", "REST/OpenAPI"], ["learning", "trade", "city", "digital", "health"]),
    O("hw-storage", "hardware", "Sanchaya", "Energy storage and charging", "battery", ["hw-power-dist"], ["Modbus", "MQTT"], ["energy", "mobility", "buildings"]),
    // Software
    O("sw-erp", "software", "Vyavastha", "ERP: finance, stock, purchase, sales", "table", [], ["REST/OpenAPI", "CSV", "JSON"]),
    O("sw-crm", "software", "Sambandh", "CRM and customer care", "users", [], ["REST/OpenAPI", "CSV", "iCal"]),
    O("sw-mis", "software", "Sankhya", "MIS dashboards and reports", "chart", ["dt-warehouse"], ["REST/OpenAPI", "CSV"]),
    O("sw-lms", "software", "Vidya-Manch", "Learning platform (VARK LS)", "book", [], ["REST/OpenAPI", "xAPI-style events", "CSV"], ["learning", "industry", "health", "city", "finance"]),
    O("sw-scada", "software", "Nirikshan", "Monitoring and control software (SCADA-style)", "monitor", ["hw-sensors"], ["OPC UA", "MQTT", "Modbus"], ["energy", "industry", "buildings", "city", "agri"]),
    O("sw-config", "software", "Rachana", "Product configurator and offer builder", "sliders", [], ["REST/OpenAPI", "CSV price book", "JSON"]),
    O("sw-market", "software", "Vyapara-Manch", "Phygital marketplace and workplace", "store", ["sw-erp"], ["REST/OpenAPI", "JSON"]),
    O("sw-mobile", "software", "Hasta-Ayojan", "Native apps: Android, iOS, Windows", "phone", [], ["REST/OpenAPI", "Push"]),
    // Cloud
    O("cl-hosting", "cloud", "Dhatri", "Hosting and containers", "cloud", [], ["Containers", "REST/OpenAPI"]),
    O("cl-db", "cloud", "Kosha", "Managed databases and storage", "database", ["cl-hosting"], ["SQL", "S3-style objects"]),
    O("cl-identity", "cloud", "Atma-Pramana", "Identity, login and roles", "key", ["cl-hosting"], ["OIDC-style tokens", "REST/OpenAPI"]),
    O("cl-gateway", "cloud", "Setu", "API gateway and integration hub", "plug", ["cl-hosting"], ["REST/OpenAPI", "Webhooks"]),
    O("cl-backup", "cloud", "Rakshak", "Backup, recovery and archive", "shield", ["cl-db"], ["S3-style objects"]),
    O("cl-edge", "cloud", "Sima", "Edge-to-cloud sync", "sync", ["cl-hosting", "hw-edge"], ["MQTT", "REST/OpenAPI"]),
    // Data and analytics
    O("dt-warehouse", "data", "Bhandar", "Data warehouse and lake", "database", ["cl-db"], ["SQL", "CSV", "Parquet-style files"]),
    O("dt-dashboards", "data", "Darpan", "Dashboards and scorecards", "chart", ["dt-warehouse"], ["REST/OpenAPI", "CSV"]),
    O("dt-forecast", "data", "Purvanuman", "Forecasting and planning models", "trend", ["dt-warehouse"], ["REST/OpenAPI", "CSV"]),
    O("dt-quality", "data", "Shuddhi", "Data quality and master data", "check", ["dt-warehouse"], ["CSV", "REST/OpenAPI"]),
    O("dt-ai", "data", "Prajna-Dootha", "AI agents and assistants (through the cost-capped gateway)", "spark", ["cl-gateway", "dt-warehouse"], ["REST/OpenAPI"]),
    O("dt-ledger", "data", "Satya-Lekha", "Hash-chained audit ledger", "link", [], ["REST/OpenAPI", "JSON"]),
    // Services
    O("sv-design", "services", "Abhikalpa", "Design and engineering", "ruler", [], ["CSV", "iCal", "REST/OpenAPI"]),
    O("sv-install", "services", "Sthapana", "Installation and commissioning", "hardhat", [], ["CSV", "iCal"]),
    O("sv-om", "services", "Sanrakshana", "Operation and maintenance", "wrench", [], ["CSV", "iCal", "REST/OpenAPI"]),
    O("sv-training", "services", "Prashikshan", "Training and certification (L1-L7)", "book", [], ["xAPI-style events", "CSV"]),
    O("sv-finance", "services", "Dhana-Vyavastha", "Finance, leasing and investment structuring (subject to licensing)", "coins", [], ["CSV", "REST/OpenAPI"], ["finance", "energy", "buildings", "industry"]),
    O("sv-logistics", "services", "Vahan", "Logistics, shipment and storage", "truck", [], ["CSV", "REST/OpenAPI", "iCal"], ["trade", "industry", "energy"])
  ];

  // Project models. Each phase becomes a board column and a block of tasks.
  const M = (id, sa, en, icon, phases, note) => ({ id, sa, en, icon, phases, note });
  const models = [
    M("stage-gate", "Charan-Dwara", "Stage-gate (plan then build)", "gate",
      ["Initiate", "Plan", "Design", "Build", "Test", "Handover", "Close"], "Each phase ends with a go or no-go decision by the project sponsor."),
    M("agile", "Chapala", "Agile sprints", "loop",
      ["Backlog", "Sprint plan", "Build", "Review", "Release", "Retrospective"], "Short cycles; review after every sprint."),
    M("kanban", "Pravah", "Kanban flow", "columns",
      ["To do", "Doing", "Check", "Done"], "Limit work in progress; flow over phases."),
    M("hybrid", "Mishra", "Hybrid (stage-gate plus sprints)", "layers",
      ["Initiate", "Plan", "Sprints", "Integrate", "Handover", "Close"], "Gates for money and risk, sprints for delivery."),
    M("epc", "Nirman-Krama", "Engineering, procurement and construction", "hardhat",
      ["Concept", "Front-end design", "Detailed design", "Procurement", "Manufacture", "Shipment", "Installation", "Commissioning", "Handover"], "Payment is locked before delivery is picked up."),
    M("npi", "Navotpad", "New product introduction", "spark",
      ["Idea", "Specification", "Prototype", "Type test", "Pilot", "Launch", "Support"], "Type tests before any launch."),
    M("dmaic", "Sudhar-Chakra", "Improve a process (DMAIC)", "target",
      ["Define", "Measure", "Analyse", "Improve", "Control"], "Fix the cause, then lock the gain."),
    M("cloud-migrate", "Megha-Sthanantar", "Cloud migration", "cloud",
      ["Assess", "Plan", "Pilot", "Migrate", "Optimise", "Operate"], "Pilot before bulk move; backup first."),
    M("data-program", "Sankhya-Yojana", "Data and analytics programme", "chart",
      ["Question", "Source data", "Clean and model", "Analyse", "Publish", "Monitor"], "Data quality is checked before every publish."),
    M("learning", "Vidya-Yojana", "Learning programme (VARK LS)", "book",
      ["Need", "Outcome (Bloom verbs)", "Design (all VARK LS lanes)", "Build", "Pilot", "Deliver", "Review"], "Every item ships in all VARK LS lanes."),
    M("deal", "Sandhi", "Partnership or acquisition (Route A / Route B)", "handshake",
      ["Screen", "Route choice", "Due diligence", "Terms", "Sign", "Integrate"], "Route A: strategic partnership first. Route B: acquisition."),
    M("om", "Sanrakshan-Chakra", "Operate and maintain", "wrench",
      ["Plan", "Inspect", "Repair", "Test", "Report"], "Planned work first; breakdowns learn into the plan.")
  ];

  // Starter content per offering family. Used when a project is created.
  const seeds = {
    quality: {
      hardware: ["Incoming inspection against specification", "Type-test report on file", "Factory acceptance test (hold point)", "Packing and shipment check"],
      software: ["Requirements reviewed", "Code review done", "Test cases passed", "User acceptance sign-off"],
      cloud: ["Backup restore test passed", "Access roles reviewed", "Load test within limit"],
      data: ["Source and date recorded for each dataset", "Data quality rules passed", "Numbers reconciled to source"],
      services: ["Method statement approved", "Work inspected and signed", "Customer handover record signed"]
    },
    hazards: {
      hardware: [["Electrical shock during test or install", 3, 5, "Isolate, lock-out/tag-out, trained staff, insulated tools"], ["Manual handling of heavy gear", 3, 3, "Lifting plan, mechanical aids"]],
      software: [["Screen fatigue and posture", 3, 2, "Breaks, workstation set-up"]],
      cloud: [["Data loss or leak", 2, 5, "Backups, encryption, least-privilege access"]],
      data: [["Wrong decision from bad data", 3, 4, "Quality rules, review before publish"]],
      services: [["Work at height or live site", 3, 5, "Permit to work, toolbox talk, PPE"], ["Road travel", 3, 4, "Journey plan, rest breaks"]]
    },
    aspects: {
      hardware: [["Packaging waste", "Landfill load", "Medium", "Return and reuse packaging"], ["Energy used in test bay", "Emissions", "Medium", "Test only what is needed"]],
      software: [["Office and device energy", "Emissions", "Low", "Efficient devices"]],
      cloud: [["Data-centre energy", "Emissions", "Medium", "Right-size, switch off idle"]],
      data: [["Compute for heavy jobs", "Emissions", "Low", "Batch and cache"]],
      services: [["Travel", "Emissions", "Medium", "Combine trips"], ["Site waste", "Landfill load", "Medium", "Segregate and recycle"]]
    },
    health: {
      hardware: ["Noise exposure checked", "Ergonomic manual-handling training"],
      software: ["Workstation set-up and break plan"],
      cloud: ["On-call fatigue plan"],
      data: ["Workload and deadline review"],
      services: ["Heat, hydration and rest plan on site", "First-aid cover confirmed"]
    }
  };

  const iconNames = ["bolt","box","gear","sensor","chip","server","phone","battery","table","users","chart","book","monitor","sliders","store","cloud","database","key","plug","shield","sync","trend","check","spark","link","ruler","hardhat","wrench","coins","truck","code","gate","loop","columns","layers","target","handshake","flag","clock","money","leaf","heart","alert","doc","chat","lock","globe","star"];

  const api = { sectors, families, offerings, models, seeds, iconNames };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CATALOG = api;
})(typeof window !== "undefined" ? window : globalThis);

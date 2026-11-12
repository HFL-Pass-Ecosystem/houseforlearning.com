/* Small hand-drawn icon set (24x24, stroke only). Own artwork, no third-party icons. */
(function (root) {
  const P = {
    bolt: "M13 2 5 14h6l-1 8 8-12h-6z",
    box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
    gear: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
    sensor: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M4 4a11 11 0 0 0 0 16M20 4a11 11 0 0 1 0 16",
    chip: "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
    server: "M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01",
    phone: "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 19h2",
    battery: "M3 8h15v8H3zM18 11h3v2h-3zM7 10v4M11 10v4",
    table: "M3 5h18v14H3zM3 10h18M9 5v14",
    users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 1 0 0-5M18 14c2 .5 3 2.5 3 5",
    chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8",
    book: "M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z",
    monitor: "M3 4h18v12H3zM8 20h8M12 16v4M6 12l3-3 3 2 4-4",
    sliders: "M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4",
    store: "M3 9l2-5h14l2 5M3 9h18v3a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 14v6h14v-6",
    cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.5 4.5 0 0 1 17 18z",
    database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.300 8-3V6M4 12c0 1.700 3.6 3 8 3s8-1.300 8-3",
    key: "M8 14a4 4 0 1 1 3.500-6H21v3h-2v2h-3v-2h-4.500A4 4 0 0 1 8 14z",
    plug: "M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5",
    shield: "M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z",
    sync: "M20 8A8 8 0 0 0 5 7M4 4v4h4M4 16a8 8 0 0 0 15 1M20 20v-4h-4",
    trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
    check: "M4 12l5 5L20 6",
    spark: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
    link: "M10 14a4 4 0 0 0 5.500 0l3-3a4 4 0 0 0-5.500-5.500L12 6.500M14 10a4 4 0 0 0-5.500 0l-3 3a4 4 0 0 0 5.500 5.500L12 17.500",
    ruler: "M3 16L16 3l5 5L8 21zM8 11l2 2M11 8l2 2M5 14l2 2",
    hardhat: "M4 17h16M5 17a7 7 0 0 1 14 0M12 6v5M9 8v3M15 8v3",
    wrench: "M14 6a4 4 0 0 0 5 5l-9 9a2.100 2.100 0 0 1-3-3l9-9a4 4 0 0 0-2-2z",
    coins: "M8 8m-5 0a5 3 0 1 0 10 0 5 3 0 1 0-10 0M3 8v4c0 1.700 2.200 3 5 3s5-1.300 5-3V8M13 11c.600-.1 1-.1 1.500-.1 2.800 0 5 1.300 5 3v3c0 1.700-2.200 3-5 3-2 0-3.700-.7-4.500-1.700",
    truck: "M2 6h11v10H2zM13 10h4l3 3v3h-7zM6 18m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 18m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
    code: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
    gate: "M4 21V4M20 21V4M4 8h16M4 14h16M8 8v6M12 8v6M16 8v6",
    loop: "M4 12a8 8 0 0 1 14-5M20 4v4h-4M20 12a8 8 0 0 1-14 5M4 20v-4h4",
    columns: "M4 4h5v16H4zM10 4h5v10h-5zM16 4h4v13h-4z",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
    target: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
    handshake: "M2 12l4-4 4 1 3-2 5 3 4-1M6 8l-4 4 6 6 2-1 3 3 5-5M10 15l2 2",
    flag: "M5 21V4M5 4h12l-2 4 2 4H5",
    clock: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 7v5l3 2",
    money: "M3 7h18v10H3zM12 12m-2.500 0a2.500 2.500 0 1 0 5 0 2.500 2.500 0 1 0-5 0M6 10v.010M18 14v.010",
    leaf: "M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8",
    heart: "M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z",
    alert: "M12 3l10 18H2zM12 10v5M12 18v.010",
    doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
    chat: "M4 5h16v11H9l-5 4z",
    lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
    globe: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
    star: "M12 3l2.800 5.800 6.200.9-4.500 4.400 1 6.200L12 17.300 6.500 20.300l1-6.200L3 9.700l6.200-.9z"
  };
  function svg(name, size, color) {
    const d = P[name] || P.star;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) +
      '" fill="none" stroke="' + (color || "currentColor") + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  }
  const api = { paths: P, svg };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.ICONS = api;
})(typeof window !== "undefined" ? window : globalThis);

export const mockServices = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Electrical",
    name: "Complete Home Electrical Inspection & Fixes",
    shortDescription: "Thorough diagnostic of switches, MCBs, earthing, wiring faults, and appliances.",
    description: "Our certified master electricians perform a complete 25-point safety check across your household electrical infrastructure. We isolate short circuits, repair faulty MCB trip boxes, check ground earthing resistance, and ensure all high-load appliances operate safely.",
    startingPrice: 299,
    durationMinutes: 60,
    rating: 4.89,
    reviewCount: 342,
    providerCount: 14,
    features: [
      "25-point safety inspection",
      "Short circuit & MCB diagnostics",
      "Earthing resistance measurement",
      "30-day post-service warranty"
    ],
    included: [
      "Safety diagnostics",
      "Minor wiring tightening",
      "Voltage spike test"
    ],
    excluded: [
      "Replacement parts & new MCBs (billed on actual MRP)",
      "Concealed wall cutting"
    ],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "Electrical",
    name: "Ceiling Fan & Light Fixture Installation",
    shortDescription: "Installation, replacement, or repair of decorative fans, chandeliers, and LED battens.",
    description: "Professional installation and replacement of all types of ceiling fans (BLDC, standard, decorative) and lighting fixtures. Safe mounting with anchor bolts and clean wire concealment.",
    startingPrice: 199,
    durationMinutes: 45,
    rating: 4.92,
    reviewCount: 215,
    providerCount: 18,
    features: [
      "Safe ceiling anchor installation",
      "Speed regulator calibration",
      "Wire splicing & concealment",
      "Balanced blade testing"
    ],
    included: ["Installation labor", "Basic insulation tape & wire nuts"],
    excluded: ["Fan/Chandelier purchase", "Extra heavy-gauge wiring"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: "Plumbing",
    name: "Tap, Faucet & Shower Leak Repair",
    shortDescription: "Fix leaking taps, low water pressure, broken cartridges, and loose bathroom fittings.",
    description: "Stop water wastage and fix annoying drips. Our verified plumbers repair or replace leaking mixer taps, spindle cartridges, diverters, health faucets, and overhead shower heads using high-durability seals.",
    startingPrice: 249,
    durationMinutes: 45,
    rating: 4.86,
    reviewCount: 420,
    providerCount: 22,
    features: [
      "Precision cartridge replacement",
      "Teflon sealing & leak-proof warranty",
      "Pressure testing",
      "Same-day dispatch"
    ],
    included: ["Inspection & labor for up to 2 taps", "Thread sealing tape"],
    excluded: ["New mixer faucets or diverter bodies"],
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: "Plumbing",
    name: "Drain Unclogging & Pipe Cleaning",
    shortDescription: "Clear stubborn blockages in kitchen sinks, bathroom drains, and main waste pipes.",
    description: "Fast-acting motorized snake drain clearing and high-pressure chemical unblocking for choked washbasins, kitchen grease traps, and bathroom shower traps without damaging PVC or cast-iron piping.",
    startingPrice: 399,
    durationMinutes: 60,
    rating: 4.88,
    reviewCount: 310,
    providerCount: 16,
    features: [
      "Heavy-duty mechanical auger cleaning",
      "Eco-safe enzymatic clearing",
      "Deodorization rinse",
      "Clean-up after unclogging"
    ],
    included: ["Labor for single drain unblocking", "Waste disposal"],
    excluded: ["P-trap structural replacement if fractured"],
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "Cleaning",
    name: "Full Home Deep Cleaning",
    shortDescription: "Comprehensive deep scrubbing, degreasing, and sanitization for 1BHK, 2BHK, 3BHK flats.",
    description: "Transform your home with professional hospital-grade disinfectants, single-disc scrubbing machines, and industrial vacuum cleaners. Covers all rooms, kitchens, bathrooms, balconies, windows, and ceiling fans.",
    startingPrice: 1999,
    durationMinutes: 240,
    rating: 4.94,
    reviewCount: 580,
    providerCount: 28,
    features: [
      "Machinery assisted floor buffing",
      "Kitchen oil & grease removal",
      "Bathroom tile scale descaling",
      "Balcony & window track vacuuming"
    ],
    included: ["All cleaning chemicals & machines", "Crew of 2-3 trained cleaners"],
    excluded: ["Internal cabinet rearrangement unless emptied"],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: "Cleaning",
    name: "Bathroom Deep Cleaning & Descaling",
    shortDescription: "Intense tile scrubbing, hard-water stain removal, and toilet sanitization.",
    description: "Eliminate yellow hard-water deposits, soap scum, grout discoloration, and germs. Includes high-pressure chemical scrub of wall tiles, WC sanitization, and chrome fitting polishing.",
    startingPrice: 499,
    durationMinutes: 75,
    rating: 4.85,
    reviewCount: 390,
    providerCount: 24,
    features: [
      "Acid-free tile restoration",
      "Tap & shower chrome buffing",
      "Mirror & glass partition cleaning",
      "99.9% germ elimination"
    ],
    included: ["Specialist chemicals & labor for 1 bathroom"],
    excluded: ["Tile re-grouting"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    categoryId: 4,
    categoryName: "AC Repair",
    name: "AC Foam Jet Deep Servicing",
    shortDescription: "2X cooling power boost with high-pressure water foam jet cleaning of indoor/outdoor units.",
    description: "Deep foam jet cleaning of the evaporator coil, blower wheel, drain tray, and condenser unit. Cleans trapped dust, removes foul odors, restores airflow, and boosts energy efficiency.",
    startingPrice: 549,
    durationMinutes: 60,
    rating: 4.95,
    reviewCount: 712,
    providerCount: 15,
    features: [
      "High-pressure foam jet wash",
      "Drain pipe flushing & leak test",
      "Gas pressure & amp draw check",
      "Anti-bacterial coating"
    ],
    included: ["Indoor & outdoor unit cleaning", "Air filter sanitization"],
    excluded: ["Refrigerant gas refill if depleted", "Capacitor replacement"],
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    categoryId: 5,
    categoryName: "Appliance Repair",
    name: "Washing Machine Repair & Diagnostics",
    shortDescription: "Fix spinning errors, drainage faults, loud vibration, PCB boards, and motor issues.",
    description: "Certified technicians for Front Load, Top Load, and Semi-Automatic washing machines (LG, Samsung, IFB, Bosch, Whirlpool). Genuine replacement parts with manufacturer warranty.",
    startingPrice: 349,
    durationMinutes: 60,
    rating: 4.83,
    reviewCount: 280,
    providerCount: 17,
    features: [
      "Digital multi-meter PCB diagnostics",
      "Motor & belt inspection",
      "Drum balance check",
      "Drain pump clearing"
    ],
    included: ["Comprehensive home visit & problem diagnosis"],
    excluded: ["Spare parts (PCB, motor, inlet valve)"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    categoryId: 6,
    categoryName: "Painting",
    name: "Fresh Home Painting & Wall Waterproofing",
    shortDescription: "Premium Asian Paints / Berger emulsion, wall putty, primer, and damp protection.",
    description: "Transform your living space with dust-free sanding, two coats of acrylic wall putty, primer, and two coats of washable luxury emulsion. Includes full furniture masking and floor protection.",
    startingPrice: 1499,
    durationMinutes: 480,
    rating: 4.91,
    reviewCount: 195,
    providerCount: 11,
    features: [
      "Laser moisture wall testing",
      "Dust-free mechanized sanding",
      "Floor & furniture plastic sheeting",
      "Post-paint site cleanup"
    ],
    included: ["Consultation & quote estimation", "Labor & basic masking"],
    excluded: ["Paint material (custom selected by shade)"],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    categoryId: 7,
    categoryName: "Carpentry",
    name: "Furniture Repair, Lock & Hinge Fixes",
    shortDescription: "Repair creaking doors, loose wardrobe hinges, bed hydraulics, and drawer slides.",
    description: "Master carpenters equipped with precision routing, drilling, and leveling tools. We fix alignment issues, replace rusted soft-close hinges, install smart locks, and re-glue wooden joints.",
    startingPrice: 299,
    durationMinutes: 60,
    rating: 4.87,
    reviewCount: 220,
    providerCount: 14,
    features: [
      "Soft-close channel alignment",
      "High-security mortise lock fitment",
      "Hydraulic piston replacement",
      "Wood filler touch-up"
    ],
    included: ["Inspection & 1 hour standard repair labor"],
    excluded: ["Hardware, locksets, hinges"],
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80"
  }
];

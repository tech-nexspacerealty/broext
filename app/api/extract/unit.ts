const unit = `{
    tower: [string], bedrooms: count,
    block: [string], bathrooms: count,
    unitSeries: [string], // ex. A1, A2, ... or B1, B2, ...
    livingRoom: count,
    kitchens: count,
    unitPerFloor: count,
    pujaRooms: count,
    unitType: "'Simplex' | 'Duplex' | 'Triplex' | 'Penthouse' | ''",

    -- if 'Penthouse' then:
        Penthouse Unit Type: "'Simplex' | 'Duplex' | 'Triplex' | ''",
        terraceArea: { val: 0, unit: "sqft | sqm | sqyd" },

    balconiesAndVerandah: count,
    floorRange: {
        minFloor: count, maxFloor: count,
    },
    staffRooms: count,
    bhk: count,
    parking: count,
    area: {
        superBuiltupArea: { val: 0, unit: "sqft | sqm | sqyd" },
        builtupArea: { val: 0, unit: "sqft | sqm | sqyd" },
        carpetArea: { val: 0, unit: "sqft | sqm | sqyd" },
        RERACarpetArea: { val: 0, unit: "sqft | sqm | sqyd" },
        floorCeilingHeight: { val: 0, unit: "sqft | sqm | sqyd" },
        personalFoyerArea: { val: 0, unit: "sqft | sqm | sqyd" },
    },
    lifts: {
        personal: count,
        common: count,
        service: count,
    }
}`;


export const unitPrompt = `
You are a real estate floor plan analysis expert. Your task is to extract EVERY unique residential unit configuration from this property brochure by carefully analyzing all floor plans, CAD drawings, unit layouts, and specification tables.

===== WHAT IS A UNIQUE UNIT? =====

A unique unit is defined by a DISTINCT combination of:
- Tower/Wing + BHK Type + Unit Series/Layout + Unit Type (Simplex/Duplex/Triplex/Penthouse)

Example: Tower A - 3 BHK - Type A1 - Simplex is ONE unique unit
         Tower A - 3 BHK - Type A2 - Simplex is ANOTHER unique unit (different layout)
         Tower B - 3 BHK - Type A1 - Simplex is ANOTHER unique unit (different tower)

DO NOT duplicate units that repeat on multiple floors with identical layouts.

===== WHERE TO FIND UNIT DATA =====

1. FLOOR PLAN DRAWINGS (Most Important):
   Look at each floor plan image/drawing carefully for:
   
   ROOM COUNTING - Count these labeled spaces on each unit layout:
   - "Bedroom" / "BR" / "BED" / "Master Bedroom" / "Guest Room" → bedrooms count
   - "Bathroom" / "Bath" / "Toilet" / "WC" / "Attached Bath" / "Common Bath" → bathrooms count
   - "Living" / "Living Room" / "Drawing Room" / "Hall" → livingRoom count
   - "Kitchen" / "Modular Kitchen" / "Pantry" → kitchens count
   - "Puja" / "Puja Room" / "Mandir" / "Prayer Room" → pujaRooms count
   - "Balcony" / "Verandah" / "Deck" / "Sit-out" / "Open Terrace" → balconiesAndVerandah count
   - "Servant Room" / "Staff Room" / "Maid Room" / "Utility Room" → staffRooms count
   - "Foyer" / "Private Lobby" / "Entrance Foyer" → personalFoyerArea
   
   UNIT IDENTIFICATION on floor plans:
   - Unit labels: "A1", "A2", "B1", "B2", "Type-1", "Type-2" → unitSeries
   - Tower markers: "Tower A", "Wing A", "Block 1" → tower/block
   - BHK labels: "2 BHK", "3 BHK", "4.5 BHK" → bhk
   - Floor indicators: "Typical Floor 3-22", "Floors 5-15" → floorRange

2. TYPICAL FLOOR PLAN PAGE:
   - Shows unit distribution on a floor
   - Count distinct unit types per floor → unitPerFloor
   - Identify which towers/blocks contain which unit types

3. UNIT-WISE FLOOR PLAN PAGES:
   - Individual detailed layouts for each unit type
   - Contains room labels and dimensions
   - May show furniture layout indicating room types
   - Area breakdowns per unit

4. SPECIFICATION TABLES / AREA STATEMENTS:
   Look for tables with columns like:
   - "Unit Type" | "Carpet Area" | "Built-up" | "Super Built-up"
   - "Configuration" | "Area (sq.ft.)" | "Floors"
   
   Extract:
   - superBuiltupArea / Super Built-up Area / SBA
   - builtupArea / Built-up Area / BUA  
   - carpetArea / Carpet Area / CA
   - RERACarpetArea / RERA Carpet / Carpet as per RERA

5. PENTHOUSE SECTION (Usually separate pages):
   - Look for "Penthouse", "Sky Villa", "Ultra Luxury" sections
   - May span multiple floors (Duplex/Triplex Penthouse)
   - terraceArea: Private terrace/deck area
   - Penthouse Unit Type: Is it single floor (Simplex), two floors (Duplex), or three floors (Triplex)?

6. ELEVATION / SECTION DRAWINGS:
   - Floor-to-ceiling height dimensions → floorCeilingHeight
   - Floor numbering to determine floorRange
   - Penthouse location at top floors

7. AMENITIES / FEATURES PAGE:
   - Lift information: "Private Lift", "Service Lift", "Common Elevator"
   - Parking allocation per unit

8. UNIT SUMMARY / AT A GLANCE:
   - Quick reference for all unit configurations
   - Area ranges, BHK types available

===== EXTRACTION RULES =====

TOWER & BLOCK:
- Extract ALL tower names where this unit type exists
- tower: ["A", "B"] means this unit exists in both Tower A and Tower B
- block: Sub-divisions within towers if any

UNIT SERIES:
- Extract the layout identifier: A1, A2, B1, Type-1, etc.
- If multiple layouts exist for same BHK, each is a separate unit entry

BHK CALCULATION:
- bhk = number of bedrooms (2 BHK = 2 bedrooms)
- "2.5 BHK" or "3+1 BHK" = include study/utility as 0.5

UNIT TYPE DETERMINATION:
- "Simplex" = Single floor unit (most common)
- "Duplex" = Two floor unit with internal stairs
- "Triplex" = Three floor unit with internal stairs
- "Penthouse" = Top floor luxury unit (can be Simplex/Duplex/Triplex internally)

FLOOR RANGE:
- minFloor: Lowest floor where this unit type exists
- maxFloor: Highest floor where this unit type exists
- "Typical Floor 5-25" means minFloor: 5, maxFloor: 25
- Ground floor = 0, First floor = 1

AREA MEASUREMENTS:
- ALWAYS include both value and unit
- Extract exact numbers from tables/drawings
- If only one area type mentioned, others may be calculated (still extract if shown)
- floorCeilingHeight: Usually in feet or meters (e.g., 10 ft, 3.2 m)

LIFT COUNT:
- personal: Private lifts opening directly into the unit
- common: Shared lifts in the lobby
- service: Goods/service lifts

PARKING:
- Dedicated parking slots per unit (e.g., "2 Car Parks per unit")

===== VISUAL ANALYSIS INSTRUCTIONS =====

When analyzing floor plan drawings:

1. IDENTIFY ROOM BOUNDARIES:
   - Look for walls (thick lines)
   - Door openings indicate room separations
   - Room labels inside bounded areas

2. COUNT METHODICALLY:
   - Go room by room in the floor plan
   - Mark each bedroom, bathroom, etc.
   - Don't miss small rooms like powder room, utility

3. RECOGNIZE FURNITURE SYMBOLS:
   - Bed symbol = Bedroom
   - Toilet/shower symbol = Bathroom
   - Kitchen counter/sink = Kitchen
   - Sofa arrangement = Living room

4. READ ALL TEXT ON DRAWINGS:
   - Area in sq.ft./sq.m. written inside rooms
   - Room names/labels
   - Dimension lines with measurements

5. CHECK LEGENDS/KEYS:
   - Floor plan legends explain symbols
   - Color coding for different spaces

===== OUTPUT FORMAT =====

Return ONLY this JSON structure with ALL unique units found:

{
    "units": [
        ${unit},
        // ... more unique units
    ]
}

===== VALIDATION CHECKLIST =====

Before returning, verify:
□ Did I analyze EVERY floor plan page in the brochure?
□ Did I identify ALL unique unit configurations?
□ Did I count rooms by examining the actual floor plan drawings?
□ Did I extract area values from specification tables?
□ Did I identify tower/block assignments for each unit?
□ Did I determine floor ranges from typical floor info?
□ Did I capture penthouse details separately if present?
□ Did I check for lift and parking information?
□ Is each unit truly unique (different tower OR layout OR type)?
□ Are all area measurements in {val, unit} format?

===== CRITICAL REMINDERS =====

- EXAMINE EVERY FLOOR PLAN IMAGE - Don't skip any drawings
- COUNT ROOMS VISUALLY from the layouts, don't assume
- EXTRACT NUMBERS from tables, don't leave as null if data exists
- ONE ENTRY per unique unit configuration
- If a 3BHK exists in Tower A and Tower B with same layout, include BOTH towers in the tower array
- If data genuinely doesn't exist, use null for objects/strings, 0 for counts

Output ONLY valid JSON. No explanations. No markdown. No additional text.
`;
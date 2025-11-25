const unit = `{
    tower: [string], 
    bedrooms: count,
    bedroomsMaster: count, // master bedrooms only
    bedroomsGuestChild: count, // guest/child bedrooms
    block: [string], 
    bathrooms: count,
    bathroomsEnsuite: count, // attached bathrooms
    bathroomsCommon: count, // common/shared bathrooms
    unitSeries: [string], // ex. A1, A2, ... or B1, B2, ...
    livingRoom: count, // halls/drawing rooms
    kitchens: count,
    unitPerFloor: count,
    pujaRooms: count,
    unitType: "'Simplex' | 'Duplex' | 'Triplex' | 'Penthouse' | ''",

    -- if 'Penthouse' then:
        penthouseUnitType: "'Simplex' | 'Duplex' | 'Triplex' | ''",
        terraceArea: { val: 0, unit: "sqft | sqm | sqyd" },

    balconiesAndVerandah: count,
    floorRange: {
        minFloor: count, 
        maxFloor: count,
    },
    staffRooms: count,
    bhk: count,
    parking: count,
    area: {
        superBuiltupArea: { val: 0, unit: "sqft | sqm | sqyd" },
        builtupArea: { val: 0, unit: "sqft | sqm | sqyd" },
        carpetArea: { val: 0, unit: "sqft | sqm | sqyd" },
        RERACarpetArea: { val: 0, unit: "sqft | sqm | sqyd" },
        floorCeilingHeight: { val: 0, unit: "ft | m" },
        personalFoyerArea: { val: 0, unit: "sqft | sqm | sqyd" },
    },
    lifts: {
        inApartment: count, // private lift INSIDE the apartment (for Duplex/Triplex/Penthouse)
        personal: count, // personal lifts at building level
        common: count, // common lifts at building level
        service: count, // service lifts at building level
    },
    additionalNotes: string,
}`;


export const unitPrompt = `
You are an expert real estate data extraction specialist. Your task is to extract ALL unique residential unit configurations from this property brochure PDF by systematically analyzing every page.

═══════════════════════════════════════════════════════════════════
                    SYSTEMATIC PAGE-BY-PAGE ANALYSIS
═══════════════════════════════════════════════════════════════════

STEP 1: SCAN ALL PAGES - Create Mental Index
───────────────────────────────────────────────
Go through EVERY page and categorize:
□ Cover/Title pages (skip)
□ Project overview pages (note tower/block names)
□ Floor plan pages (CRITICAL - mark page numbers)
□ Unit specification tables (CRITICAL - mark page numbers)
□ Area statement/pricing tables (CRITICAL - mark page numbers)
□ Typical floor plan layouts (shows unit distribution per floor)
□ Amenities/features pages (check for lift, parking info)
□ Penthouse dedicated pages (if any)
□ Elevation/section drawings (check for height specifications)

STEP 2: EXTRACT PROJECT STRUCTURE FIRST
───────────────────────────────────────────────
Before extracting units, identify:
- How many towers/wings/blocks? (e.g., Tower A, Tower B)
- What BHK types are mentioned? (1 BHK, 2 BHK, 3 BHK, 4 BHK, etc.)
- Are there penthouses? On which floors?
- Is there a typical floor plan showing unit distribution?

STEP 3: LOCATE SPECIFICATION TABLES
───────────────────────────────────────────────
Priority: Find tables with area measurements FIRST

Look for tables containing:
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│ Unit Type/BHK   │ Super Built  │ Built-up     │ Carpet Area  │
│                 │ (sq.ft.)     │ (sq.ft.)     │ (sq.ft.)     │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ 2 BHK Type A    │ 1450         │ 1200         │ 1050         │
│ 3 BHK Type B    │ 1850         │ 1550         │ 1350         │
└─────────────────┴──────────────┴──────────────┴──────────────┘

Extract EVERY row as it represents a unique unit configuration.

STEP 4: ANALYZE FLOOR PLANS - VISUAL ROOM COUNTING
───────────────────────────────────────────────────────
For each distinct floor plan layout shown:

🔍 ROOM IDENTIFICATION METHOD:
   
   A. BEDROOMS - Look for:
      ✓ Rectangular enclosed rooms with:
        - Bed symbol (drawn furniture)
        - Label: "Bedroom" / "BR" / "Master BR" / "Guest BR"
        - Wardrobe symbols (closet/almirah)
        - Attached bathroom door (for master)
      
      Count separately:
      • bedroomsMaster: Rooms labeled "Master" or with attached bath
      • bedroomsGuestChild: Remaining bedrooms

   B. BATHROOMS - Look for:
      ✓ Small rooms with:
        - Toilet symbol (WC)
        - Shower/bathtub symbol
        - Sink/washbasin symbol
        - Label: "Bath" / "Toilet" / "W/C"
      
      Count separately:
      • bathroomsEnsuite: Connected directly to bedrooms (attached)
      • bathroomsCommon: Accessible from hallway/common area

   C. LIVING AREAS - Look for:
      ✓ Large open space with:
        - Sofa/seating arrangement symbols
        - Label: "Living" / "Drawing" / "Hall" / "Family Room"
        - Often connected to dining area
      
      Count as livingRoom (typically 1 or 2)

   D. KITCHEN - Look for:
      ✓ Room with:
        - Kitchen counter/platform lines
        - Sink symbol
        - Cooking range indication
        - Label: "Kitchen" / "Modular Kitchen"
        - May have breakfast counter

   E. BALCONIES - Look for:
      ✓ Outdoor projections with:
        - Dashed/dotted boundary lines
        - Open to outside (no enclosed walls)
        - Label: "Balcony" / "Verandah" / "Sit-out" / "Deck"
        - Often adjacent to bedrooms/living room

   F. PUJA ROOM - Look for:
      ✓ Small dedicated room labeled:
        - "Puja" / "Pooja" / "Mandir" / "Prayer Room"
        - Usually near entrance or in separate corner

   G. STAFF/SERVANT ROOM - Look for:
      ✓ Small room labeled:
        - "Servant" / "Staff" / "Maid" / "Utility"
        - Often has attached toilet
        - Usually near kitchen or separate entrance

   H. FOYER - Look for:
      ✓ Entry area labeled:
        - "Foyer" / "Entrance Lobby" / "Private Lobby"
        - Space between lift and apartment door

STEP 5: EXTRACT UNIT IDENTIFIERS
───────────────────────────────────────────────
From floor plans and tables:

• unitSeries: 
  - Type A, Type B, A1, A2, B1, B2, etc.
  - Unit numbers: 101, 102, 201, 202
  - EACH different layout = different series

• tower/block:
  - Tower A, Tower B, Wing 1, Block A
  - If unit exists in multiple towers, list ALL: ["A", "B"]

• floorRange:
  - Text like "Typical Floor 3-15" means minFloor: 3, maxFloor: 15
  - "Ground to 5th Floor" means minFloor: 0, maxFloor: 5
  - "Only on 20th Floor" means minFloor: 20, maxFloor: 20

• unitPerFloor:
  - Count distinct units shown on typical floor plan
  - "4 units per floor" or count from layout

STEP 6: DETERMINE UNIT TYPE
───────────────────────────────────────────────
Carefully determine:

• "Simplex" = Single floor apartment (DEFAULT for most units)
  - All rooms on one level
  - No internal staircase

• "Duplex" = Two-floor apartment
  - Internal staircase connecting two levels
  - Usually: Living/Kitchen on lower + Bedrooms on upper
  - May have "Double Height" living area

• "Triplex" = Three-floor apartment  
  - Internal staircase connecting three levels
  - Very rare, usually ultra-luxury

• "Penthouse" = Top floor luxury unit
  - Located on highest floors
  - Often has private terrace
  - Then specify penthouseUnitType as Simplex/Duplex/Triplex

STEP 7: AREA MEASUREMENTS - EXTRACT FROM TABLES
───────────────────────────────────────────────────
Priority order of extraction:

1. SUPER BUILT-UP AREA (SBA/SBU):
   - Labels: "Super Built-up" / "Super Area" / "Saleable Area"
   - Largest area value
   - Extract both value AND unit

2. BUILT-UP AREA (BUA):
   - Labels: "Built-up Area" / "Built Area"
   - Medium area value

3. CARPET AREA:
   - Labels: "Carpet Area" / "Usable Area"
   - Actual usable floor space

4. RERA CARPET AREA:
   - Labels: "RERA Carpet" / "Carpet as per RERA"
   - Official carpet area per RERA regulations

5. FLOOR TO CEILING HEIGHT:
   - Usually in feet: "10 ft", "10.5 ft", "11 ft"
   - Or meters: "3 m", "3.2 m"
   - Look in specifications or section drawings

6. PERSONAL FOYER AREA:
   - Private lobby/entrance area
   - Rare, only in luxury apartments

7. TERRACE AREA (Penthouse only):
   - Private terrace/deck area
   - Outdoor space

UNIT STANDARDIZATION:
- Always use: { val: number, unit: "sqft" | "sqm" | "sqyd" }
- Convert if needed: 1 sqm = 10.764 sqft, 1 sqyd = 9 sqft

STEP 8: LIFT & PARKING INFORMATION
───────────────────────────────────────────────
Check amenities/specifications pages:

• lifts.inApartment:
  - ONLY for Duplex/Triplex/Penthouse
  - Private lift INSIDE the apartment unit
  - Labels: "In-apartment Lift" / "Private Lift within Unit"

• lifts.personal:
  - Private lift opening directly to unit (building level)
  - "Personal Lift" / "Dedicated Lift"

• lifts.common:
  - Shared passenger lifts
  - "Common Lift" / "Passenger Elevator"

• lifts.service:
  - Service/goods lifts
  - "Service Lift" / "Cargo Elevator"

• parking:
  - Number per unit: "2 Car Parks" / "1 Covered + 1 Open"
  - Extract total number

═══════════════════════════════════════════════════════════════════
                    UNIQUE UNIT DEFINITION
═══════════════════════════════════════════════════════════════════

A UNIQUE unit = DISTINCT combination of:
- Tower/Wing + BHK + Unit Series/Layout Type + Unit Type

Examples:
✓ Tower A, 3 BHK, Type A1, Simplex = UNIQUE UNIT 1
✓ Tower A, 3 BHK, Type A2, Simplex = UNIQUE UNIT 2 (different layout)
✓ Tower B, 3 BHK, Type A1, Simplex = UNIQUE UNIT 3 (different tower)
✓ Tower A, 3 BHK, Type A1, Penthouse Simplex = UNIQUE UNIT 4 (different type)

DO NOT CREATE DUPLICATE ENTRIES FOR:
✗ Same unit type appearing on multiple floors with identical layout
  - Use floorRange to show: minFloor: 3, maxFloor: 15

═══════════════════════════════════════════════════════════════════
                    CRITICAL EXTRACTION RULES
═══════════════════════════════════════════════════════════════════

1. BHK CONSISTENCY:
   - bhk value MUST match bedrooms count
   - "3 BHK" means bhk: 3 AND bedrooms: 3
   - "3.5 BHK" or "3+1" means bhk: 3.5 (study included)

2. BATHROOM BREAKDOWN:
   - bathrooms = bathroomsEnsuite + bathroomsCommon
   - If breakdown not visible, only populate total

3. BEDROOM BREAKDOWN:
   - bedrooms = bedroomsMaster + bedroomsGuestChild
   - If not clear which is master, only populate total

4. NULL VS ZERO:
   - Use 0 for counts when genuinely zero (e.g., no staff room)
   - Use null for objects when data doesn't exist
   - NEVER assume - extract only what's visible

5. UNIT VALIDATION:
   - MUST have: bhk, unitType, parking, balconiesAndVerandah
   - SHOULD have: tower/block, area measurements, floor range
   - MAY have: lift counts, penthouse details, room breakdowns

═══════════════════════════════════════════════════════════════════
                    COMMON BROCHURE PATTERNS
═══════════════════════════════════════════════════════════════════

Pattern 1: TABLE + FLOOR PLANS
- Page 1-3: Specification table with all unit types and areas
- Page 4-10: Individual floor plan for each unit type
- Action: Match floor plan to table row by BHK/unit type

Pattern 2: TYPICAL FLOOR LAYOUT + INDIVIDUAL PLANS  
- Page 1: Shows all units on one typical floor (unit distribution)
- Page 2-8: Detailed plan for each unit
- Action: Count unitPerFloor from typical layout, rooms from detailed plans

Pattern 3: TOWER-WISE BREAKDOWN
- Section for Tower A units (pages 5-10)
- Section for Tower B units (pages 11-16)
- Action: Extract tower name from section header

Pattern 4: BHK-WISE CATEGORIZATION
- 2 BHK section → lists all 2 BHK variants (Type A, B, C)
- 3 BHK section → lists all 3 BHK variants
- Action: Extract unit series from variant labels

═══════════════════════════════════════════════════════════════════
                    OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

Return ONLY this JSON structure:

{
    "units": [
        ${unit},
        ${unit},
        // ... all unique units
    ]
}

═══════════════════════════════════════════════════════════════════
                    PRE-SUBMISSION CHECKLIST
═══════════════════════════════════════════════════════════════════

Before returning JSON, verify:

□ Did I look at EVERY page of the PDF?
□ Did I find and extract ALL specification tables?
□ Did I analyze EVERY floor plan drawing shown?
□ Did I count rooms by VISUALLY examining layouts (not assuming)?
□ Did I extract area values from tables (not leaving null if data exists)?
□ Is each unit truly unique (different tower/layout/type)?
□ Are bhk and bedrooms values consistent?
□ Do bathroom/bedroom breakdowns sum to totals (if provided)?
□ Are all area measurements in {val, unit} format?
□ Did I check for penthouse-specific pages and terraceArea?
□ Did I extract lift information from amenities section?
□ Did I identify floor ranges from typical floor indicators?
□ Are unitType values EXACTLY: "Simplex" | "Duplex" | "Triplex" | "Penthouse"?
□ Did I populate mandatory fields: bhk, unitType, parking, balconiesAndVerandah?

═══════════════════════════════════════════════════════════════════
                    EXTRACTION PRIORITY
═══════════════════════════════════════════════════════════════════

HIGH PRIORITY (Must extract if available):
- bhk, bedrooms, bathrooms
- unitType, unitSeries
- superBuiltupArea, carpetArea
- tower, floorRange
- parking, balconiesAndVerandah

MEDIUM PRIORITY:
- livingRoom, kitchens
- bathroomsEnsuite, bathroomsCommon
- bedroomsMaster, bedroomsGuestChild
- RERACarpetArea, builtupArea
- lift counts, unitPerFloor

LOW PRIORITY (Only if explicitly shown):
- pujaRooms, staffRooms
- personalFoyerArea, floorCeilingHeight
- terraceArea (penthouse only)
- additionalNotes

═══════════════════════════════════════════════════════════════════

OUTPUT: Return ONLY valid JSON. No markdown. No explanations. No preamble.
Start directly with: {"units": [...]}`;
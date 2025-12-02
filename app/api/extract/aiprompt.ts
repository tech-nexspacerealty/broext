export const brochureJSON = `
{
  "project": {
    "name": "string",
    "type": "residential | commercial | land-plot | null",

    "residentialCategory": "apartments | bungalows | weekend_homes | null",

    "commercialCategories": [
      "offices",
      "shops_showrooms",
      "corporate_houses",
      "students_housing"
    ],

    "developer": "string | null",
    "transactionType": "sale | rent | null",
    "redevelopment": "boolean | null",
    "unitMeasurement": "sqft | sqm | sqyd | null",

    "website": "string | null",

    "area": {
      "landArea": { "value": "number | null", "unit": "string | null" },
      "openArea": { "value": "number | null", "unit": "string | null" },
      "coveredArea": { "value": "number | null", "unit": "string | null" }
    },

    "rera": {
      "id": "string | null",
      "status": "string | null",
      "validTill": "string | null"
    },

    "dates": {
      "projectStatus": "under_construction | ready_to_move | pre_launch | null",
      "expectedCompletion": "string | null",
      "possessionDate": "string | null",
      "actualCompletion": "string | null",
      "launchDate": "string | null",
      "ageOfBuilding": "0-2 | 2-5 | 5-10 | null"
    },

    "stats": {
      "totalTowers": "number | null",
      "loadingFactorValue": "number | null",
      "totalBlocks": "number | null",
      "loadingFactorType": "built_up | super_built_up | carpet_area | null",
      "totalUnits": "number | null",
      "totalLifts": "number | null",
      "totalParking": "number | null",
      "totalFloors": "number | null",
      "basementFloors": "number | null"
    },

    "floorsInfo": {
      "habitable": "number | null",
      "amenities": "number | null",
      "parking": "number | null",
      "refuge": "number | null"
    },

    "people": {
      "architect": "string | null",
      "structuralEngineer": "string | null",
      "contractor": "string | null"
    },

    "location": {
      "pincode": "string | null",
      "longitude": "string | null",
      "area": "string | null",
      "city": "string | null",
      "state": "string | null"
    },

    "special": {
      "highlights": "string" | null,
      "overview": "string | null",
      "additionalDescription": "string | null"
    }
  }
}
`;

export const brochureJSON2 = `
{
  "projectName": "",
  "type": "'', 'Residential', Commercial', 'Land-Plot'",

  "residentialCategory": "'Apartments' | 'Bungalows' | 'Weekend Homes' | ''",

  "commercialCategories": [
    "offices",
    "shopsshowrooms",
    "corporate_houses",
    "students_housing"
  ],



  -- if type === "Residential" && residentialCategory === "Apartments"
    "residenceType" : "'' | 'Exclusive Apartments' | 'Apartments with Showrooms'",

    -- if residenceType === "Apartments with Showrooms"
      "residenceIncludes" : [
        "offices",
        "shopsshowrooms",
        "corporate_houses",
        "students_housing"
      ],

  "developers": ["string"],
  "transactionType": "Sale | Rent | Lease | null",
  "redevelopmentProject": true,

  "unitType": "sqm | sqyd | sqft | null",
  "projectWebsite": "",
  "projectLandArea": { "value": null, "unit": "" },
  "totalOpenArea": { "value": null, "unit": "" },
  "totalCoveredArea": { "value": null, "unit": "" },
  "reraRegistration": "",

  "dates": {
    "projectStatus": "'Under Construction' | 'Pre-Launch' | 'Ready to Move' | ''",
    "expectedCompletionDate": "",
    "possessionDate": "",
    "actualCompletionDate": "",
    "launchDate": "",
    "ageOfBuilding": "0-2 | 2-5 | 5-10 | null"
  },

  "projectStats": {
    "totalTowers": null,
    "loadingFactorValue": null,
    "totalBlocks": null,
    "loadingFactorAreaType": "buildup | super_buildup | carpet_area | null",
    "totalUnits": null,
    "totalLifts": null,
    "totalParking": null,
    "totalFloors": null,
    "totalBasementFloors": null
  },

  --- floor sequence is: ..., B2, B1, G, 1, 2, ...: Don't use as full name like 'Ground' or 'basement', must be in the suggested format
  "floorsInfo": {
    "habitableFloors": [string], // floor number
    "amenitiesFloors": [string], // floor number
    "parkingFloors": [string], // floor number
    "refugeFloors": [string], // floor number
  },

  "peopleInvolved": {
    "architect": "",
    "structuralEngineer": "",
    "contractor": ""
  },

  "location": {
    "pincode": "",
    "longitude": "",
    "locationArea": "",
    "city": "",
    "state": "",
    "fullAddress": ""
  },

  "specialHighlights": "",
  "projectOverview": "",
  "additionalDescription": "",

  "amenitiesUtilities": ["string"],
}
`;

export const brochurePrompt = `
You are a real estate data extraction specialist. Your task is to meticulously extract ALL available project information from this brochure and return it in the EXACT JSON structure provided below.

===== CRITICAL INSTRUCTIONS =====

1. SCAN EVERYTHING:
   - Read every page, paragraph, heading, subheading
   - Examine all tables, charts, legends, and specifications
   - Analyze CAD drawings, floor plans, site plans, elevation drawings
   - Check image captions, footnotes, fine print, disclaimers
   - Look at headers, footers, sidebars, and margin notes
   - Extract text from architectural diagrams and technical drawings
   - Review any dimension labels, area measurements on plans

2. EXTRACT EVERY FIELD:
   - Your goal is to fill EVERY field in the JSON structure
   - If you find ANY information related to a field, extract it
   - Look for variations: "Project Name" might appear as "Development Name", "Property", etc.
   - Numbers might be written as "10" or "Ten" - extract both forms
   - Dates might be in different formats (DD/MM/YYYY, Month Year, Q1 2024)

3. WHERE TO LOOK FOR SPECIFIC DATA:

   PROJECT NAME & TYPE:
   - Cover page, headers, watermarks, project logos
   - Look for words like "Residential Complex", "Commercial Hub", "Plotted Development"
   
   DEVELOPER:
   - Company name, logo, "Developed by", "A project by"
   - Contact information section, footer
   
   AREAS (landArea, openArea, coveredArea):
   - Specifications table, project facts section
   - Site plan drawings (look for total plot area, FSI details)
   - "Total Land Parcel", "Plot Area", "Built-up Area", "Open Spaces"
   
   RERA DETAILS:
   - Usually in fine print, footer, or legal section
   - Format: RERA Registration No., Project ID, valid until date
   
   DATES:
   - "Possession by", "Expected Completion", "Ready by", "Handover Date"
   - "Launched in", "Construction Started", "Phase completion"
   - If building is complete, look for "Aged", "X years old", "Built in"
   
   STATS (towers, blocks, units, floors, lifts, parking):
   - Project specifications table, "At a Glance" section
   - Floor plans (count floors visually if mentioned)
   - CAD drawings showing tower layouts, basement levels
   - "G+15" means Ground + 15 floors (total 16)
   - "2 Basements" or "B1, B2" indicates basement floors
   - Count parking slots from parking layout plans
   
   FLOORS INFO:
   - Floor plans showing which floors have apartments/offices (habitable)
   - Podium floors, terrace amenities (amenities)
   - Basement/stilt parking floors (parking)
   - Refuge areas marked on fire escape plans
   
   PEOPLE INVOLVED:
   - Design credits, "Designed by", "Architect:", "Structural Consultant"
   - Footer credits, back page acknowledgments
   
   LOCATION:
   - Address blocks, map sections, "Location Advantages"
   - PIN code in contact details
   - Coordinates on location maps
   
   SPECIAL SECTIONS:
   - highlights: Any unique features, USPs, "Why Choose Us", amenities list
   - overview: Introductory paragraph, "About the Project"
   - additionalDescription: Marketing text, lifestyle descriptions

4. HANDLE VARIATIONS & SYNONYMS:
   - "Towers" = "Blocks" = "Buildings" = "Wings"
   - "Units" = "Apartments" = "Homes" = "Flats" = "Offices"
   - "Lifts" = "Elevators"
   - "Carpet Area" ≠ "Built-up Area" ≠ "Super Built-up Area"
   - "RERA" = "Real Estate Regulatory Authority" = "MahaRERA" = "UP RERA"
   - "Under Construction" = "Ongoing" = "In Progress"
   - "Ready to Move" = "Completed" = "Possession Available"

5. DATA EXTRACTION FROM CAD/TECHNICAL DRAWINGS:
   - Count floors from elevation/section drawings
   - Read dimension labels for area measurements
   - Identify basement levels (marked as B1, B2, or negative floors)
   - Extract floor numbering sequences from plans
   - Note any refuge floors or mechanical floors
   - Count parking slots from parking layout drawings

6. CLASSIFICATION RULES:

   type: 
   - "residential" if mentions: apartments, flats, homes, residences, villas, bungalows
   - "commercial" if mentions: offices, shops, showrooms, retail, commercial spaces
   - "land-plot" if mentions: plots, land parcels, NA plots, residential plots
   
   residentialCategory (only if type = residential):
   - "apartments" for high-rise/multi-story buildings
   - "bungalows" for independent houses/villas/row houses
   - "weekend_homes" for vacation homes/farmhouses
   
   commercialCategories (if type = commercial, can be multiple):
   - "offices" - office spaces, IT parks, business centers
   - "shops_showrooms" - retail, shops, showrooms
   - "corporate_houses" - standalone corporate buildings
   - "students_housing" - hostels, PG accommodations
   
   projectStatus:
   - "under_construction" if work is ongoing
   - "ready_to_move" if completed and available
   - "pre_launch" if not yet started
   
   ageOfBuilding (only if projectStatus = ready_to_move):
   - Calculate from completion date or extract if mentioned
   - "0-2" if 0-2 years old
   - "2-5" if 2-5 years old  
   - "5-10" if 5-10 years old

7. DATA QUALITY RULES:
   - If a value appears multiple times, use the most complete/detailed version
   - Convert all measurements to consistent units (extract original unit)
   - For ranges like "2-3 BHK", extract all configurations mentioned
   - If conflicting data found, prefer: specifications table > main content > footer
   - DO NOT invent or assume data not present in the brochure
   - Return null only if truly no information exists

8. OUTPUT FORMAT:
   - Return ONLY valid JSON matching the structure below
   - Use exact field names as specified
   - Respect data types: numbers as numbers, strings as strings, booleans as true/false
   - Arrays should contain actual values found, not be empty unless no data exists
   - For null values, use actual null, not "null" string

===== JSON STRUCTURE TO FOLLOW =====

${brochureJSON2}

===== FINAL CHECKLIST BEFORE RETURNING =====

Go through this checklist:
□ Did I read ALL pages of the brochure?
□ Did I examine all CAD drawings and floor plans?
□ Did I check tables, specifications, and fine print?
□ Did I extract project name, developer, and type?
□ Did I find area measurements (land, open, covered)?
□ Did I extract RERA details if present?
□ Did I get all date information (completion, possession, launch)?
□ Did I count towers, blocks, units, floors, lifts, parking?
□ Did I identify floor types (habitable, amenities, parking, refuge)?
□ Did I extract architect, engineer, contractor names?
□ Did I get complete location (pincode, area, city, state, coordinates)?
□ Did I capture all highlights, overview, and descriptions?
□ Is my JSON properly formatted and valid?

Now extract all information and return the complete JSON object.
`;
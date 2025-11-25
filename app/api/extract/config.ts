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
      "highlights": ["string"],
      "overview": "string | null",
      "additionalDescription": "string | null"
    }
  }
}
`;

export const brochurePrompt = `
Extract all project details from the brochure exactly according to the JSON structure provided below.

Follow these rules:
- Extract information from ANYWHERE in the brochure: paragraphs, tables, captions, footnotes, images, floor plans, or tiny text.
- If a value appears multiple times or in variations, include the most complete version.
- If a detail is unclear or partially readable, still extract it and mark it as low confidence using: { "value": "xyz", "confidence": "low" }.
- If a field does not exist, return null.
- Do NOT add fields that are not in the schema.
- Do NOT summarize or interpret; extract ONLY factual brochure content.

Classification Requirements:

1. Project Type  
   - residential  
   - commercial  
   - land-plot

2. If residential:  
   - Category must be one of: apartments, bungalows, weekend_homes

3. If commercial:  
   - Multiple categories allowed from:  
     offices, shops_showrooms, corporate_houses, students_housing

4. Dates:
   - Project status must be one of: under_construction, ready_to_move, pre_launch
   - If ready_to_move → extract Age of Building (0-2, 2-5, 5-10 years)

5. Area Units:
   - Extract whichever units are mentioned: sqft, sqm, sqyd

6. People Involved:
   - Extract all names even if buried in design credits

7. Location:
   - Extract pincode, longitude, locality, city, state

8. Special Sections:
   - Extract all highlights, marketing text, overview, and additional description

Return ONLY a valid JSON object according to this structure:

${brochureJSON}
`;



export const prompt3 = `Extract all possible property information from the provided brochure and return a single well-structured JSON object matching exactly the schema below. Infer values intelligently when implicit, otherwise return null. Do not add fields not defined here.

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

  --- floor sequence is: ..., B2, B1, G, 1, 2, ...
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

Rules:
- Return only JSON with correct data types.
- Extract every possible detail from text, tables, diagrams, footnotes.
- If conflicting data appears, choose the most explicit or most recent.
- Normalize units to sqm/sqyd/sqft where possible.
- Do not guess unrealistic values; use null if uncertain.`;
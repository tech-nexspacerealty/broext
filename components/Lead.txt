'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + "nexspace.nexspace.frontend_api.associate.lead.";

const cmnBaseurl =  process.env.NEXT_PUBLIC_API_URL + "nexspace.nexspace.frontend_api.associate.";

const associates = {
    get_associate_documents: cmnBaseurl + "associate.get_associate_documents?associate_name=AST-PRF-002",
}

const assFileDel = cmnBaseurl +  "associate.delete_associate_document";
const assFileUp = cmnBaseurl +  "associate.associate_file_uploads";



const urlList = {
    ...associates,
    //   lead_list: baseUrl + 'lead_list?page=1&limit=10&sort_by=company_name&sort_order=asc',
    //   profile_list: baseUrl + 'profile_list',
    //   user_list: baseUrl + 'user_list',
    //   city_list: baseUrl + 'city_list',
    //   location_group_list: baseUrl + 'location_group_list',
    //   funding_source_list: baseUrl + 'funding_source_list',
    //   property_interest_list: baseUrl + 'property_interest_list',
    //   society_preference_list: baseUrl + 'society_preference_list',
    //   key_decision_makers_list: baseUrl + 'key_decision_makers_list',
    //   site_visit_preference_list: baseUrl + 'site_visit_preference_list',


}

const create = baseUrl + 'lead_create'
const update = baseUrl + 'lead_update'
const del = baseUrl + 'lead_delete'

const preferences = {
custom_vastu_compliance: "Preferred",
custom_direction_facing: ["East"],
custom_view_facing: ["Other"],
custom_furnishing_type: ["Furnished"],
custom_building_preference: ["High Rise (above 20 floors)"],
custom_amenities: ["Car Parking"],
custom_floor_preference: ["Basement"],
custom_society_preference: ["sp 1"],

custom_mandatory_amenities: "Amenities",
custom_lifestyle_priorities: true,
custom_commute_considerations: "as fjlafgagr g. rgrg",

custom_staff_room: true,
custom_no_of_staff_rooms: 2,

custom_amenities_table: ["Temple", "Spa"]
}

const reqs = {
// Left side

custom_property_type: "Residential",
custom_property_subtype: "Bunglows",
custom_transaction_type: "Sale",
custom_possession_status: ["Pre Launch", "Ready to Move"],

// if bunglows
custom_preferred_type: ["Only Plot", "Plot with Construction"],

// if pre launch
custom_possession_timeline: ["0 – 1 Year", "1 – 2 Years"],

// if eady to move
custom_property_age: ["1-5 Years", "10-20 Years"],

custom_property_use_purpose: ["Family", "bachelors"],
custom_minimum_size: 10,
custom_maximum_size: 20,
custom_area_type: "Carpet",
custom_area_metric: "Square Feet (sq ft)",

custom_plot_minimum_size: 101,
custom_plot_maximum_size: 201,
custom_plot_area_type: "Carpet",
custom_plot_area_metric: "Square Feet (sq ft)",
custom_reconstruction_allowed: true,

custom_construction_minimum_size: 9,
custom_construction_maximum_size: 99,
custom_construction_area_type: "Carpet",
custom_construction_area_metric: "Square Feet (sq ft)",
custom_reconstruction_preference: "New design",

// MIddle side

custom_new_project_status: "Ready to Move",
custom_new_project_possession: "2-5 years",
custom_budget_min_: 10,
custom_budget_max_: 20,
custom_budget_min: 10,
custom_budget_max: 20,

// if residential
custom_room_requirement_min_bhk: "",
custom_room_requirement_max_bhk: "",

// Right side
custom_city: "AMD",
custom_preferred_localities: ["kam group 1"],
custom_parking: 3,
custom_funding_source: ["fund 1"],
custom_unit_configuration_apartment: ["Duplex"],
custom_sub_type: "",
custom_property_interest: ["pro int 1"],
custom_property_age_for_resale: ["1-5 Years"],

// preferences
...preferences

}

const leadData = {
    // Core Link
custom_profile: "PRF-001",
custom_lead_id: "part-PRF-001",
company_name: "parth limited",
first_name: "partamhbgjg",
middle_name: "pa",
last_name: "rth",

// Vitals & Ownership

custom_date_of_inquiry: "2025-11-25",
custom_urgency: "Within 3 Months",
custom_lead_stage_for_presales: "Open",
custom_lead_stage_for_associates: "Open",
custom_disqualification_reason: "No matches",
custom_priority: "Low",

custom_lead_temperature: "Hot",
custom_lead_owner_internal: "Guest",
custom_assigned_associate: "",

// Source & Influence
custom_lead_source: "Personal",
custom_source_name: "Jinanas Shah",

custom_influence_channel: "Promotional Offer",


// Client Profile
custom_customer_type: "Individual",
custom_customer_subtype_profesional: "Doctor",

// if company
custom_customer_subtype_company: "HUF",
// if professioanl
custom_customer_subtype_professional: "Doctor",

custom_key_decision_makers: ["nkdm 1"],
custom_buyer_sophistication: "First-Time Buyer",

custom_other_deal_breakers: "sgarg regar gaerfvabgafaeba ererbqerberb erb e rbq erbq et n",
custom_non_negotiable_fields: "wrgqwrga ew qe tb nq etn ",


// Logistics & Other
custom_rera_preference: true,
custom_prior_site_visits_before_us: true,
custom_prior_site_visits: [{
    project: "kamlesh",
    liked: "some",
    not_liked: "thing",
}],

custom_interested_projects: ["FIRST-Commercial"],
custom_site_visit_preference: ["nsvp 1"],

// Deal & Brokerage
custom_brokerage_agreement_signed: true,


// rquirements
...reqs
}

const Lead = () => {

    useEffect(() => {

        Object.values(urlList).forEach((url) => {
            // getLeads(url);
        });

        // associateDelete()

        // createAssociate(leadData)
        // updateAssociate(leadData);
        // associateDelete("CRM-LEAD-2025-00002")


    }, []);

    const getLeads = async (url: string) => {
        try {

            const r=await fetch(url ,{
                method:'GET',
                headers:{'Content-Type':'application/json'},
            })
            if(!r.ok)throw new Error('REQUEST_FAILED')
            const j=await r.json()

            console.log('<><>>>>>>>>> : ', j);            
        } catch(e: any) {
                toast.error(e?.message || "Something wrong.")
            }
    }

    const createAssociate = async (payload: any) => {
  const r = await fetch(create, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const j = await r.json()
  console.log(j)
}


const updateAssociate = async (payload: any) => {
  const r = await fetch(update, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...payload, name: "CRM-LEAD-2025-00002"})
  })
  const j = await r.json()
  console.log(j)
}

const associateDelete = async (id?: string) => {
  try {
    const r = await fetch(assFileDel, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ associate_name: "AST-PRF-002", document_file: "5ts6h7lsds" })
    })
    const j = await r.json()
    j.status==="success"
      ? toast.success("Deleted")
      : toast.error(j.message)
  } catch (e:any) {
    toast.error(e?.message || "Something wrong.")
}
}

const uploadFiles = async (files: File[]) => {
  const form = new FormData()
  form.append("associate_name", "AST-PRF-002")
  files.forEach(f => form.append("files", f))

  const r = await fetch(assFileUp, {
    method: "POST",
    body: form
  })

  const j = await r.json()
  console.log(j)
}

const uploadAssociateFiles = async (associate_name: string, files: File[], meta: any = {}) => {
  const fd = new FormData()
  fd.append("associate_name", associate_name)
  Array.from(files).forEach((f, i) => {
    const key = `file_${i}`
    fd.append(key, f)
    fd.append(`${key}_type`, meta[i]?.type || "Other")
    fd.append(`${key}_expiry`, meta[i]?.expiry || "2025-11-30")
    fd.append(`${key}_verification`, meta[i]?.verification || "Pending")
  })
  const r = await fetch(assFileUp, {
    method: "POST",
    body: fd
  })
  return await r.json()
}



  const [files, setFiles] = useState([])

  const handleSelect = e => setFiles([...e.target.files])
  const handleUpload = () => uploadAssociateFiles("AST-PRF-002", files)

  return (
    <div className="p-4 space-y-3">
      <input type="file" multiple onChange={handleSelect} />

      {files.length > 0 &&
        <ul className="list-disc pl-5">
          {files.map(f => <li key={f.name}>{f.name}</li>)}
        </ul>
      }

      <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
        Upload
      </button>
    </div>
  )
}

export default Lead
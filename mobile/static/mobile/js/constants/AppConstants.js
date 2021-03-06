var c = 0;

module.exports = {
  // MainPage events
  SEARCH_FOR: c++,
  GO_FOR_SEARCH_DETAIL: c++,
  SEARCH_INPUT_CHANGED: c++,
  SEARCH_FOCUS: c++,
  SEARCH_BLUR: c++,
  SEARCH_CLEAR: c++,


  // ComplaintPage events
  COMPLAINT_PAGE_RECEIVED_DATA: c++,
  COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA: c++,
  TOGGLE_PAGE_OPEN: c++,
  TOGGLE_PAGE_CLOSE: c++,
  RESET_STATE: c++,

  //Document events
  DOCUMENT_REQUEST_SUCCESS: c++,
  DOCUMENT_REQUEST_FAIL: c++,

  //InterfaceText events
  GET_INTERFACE_TEXT_SUCCESS: c++,
  GET_INTERFACE_TEXT_FAILED: c++,


  //OfficerPage events
  OFFICER_PAGE_RECEIVED_DATA: c++,
  OFFICER_PAGE_FAILED_TO_RECEIVED_DATA: c++,
  OFFICER_PAGE_RELOAD: c++,

  // MainPage events
  MAIN_PAGE_RECEIVED_DATA: c++,
  MAIN_PAGE_FAILED_TO_RECEIVED_DATA: c++,

  // Tokens
  MAPBOX_TOKEN:
    '***REMOVED***',

  // Other constants
  FINAL_FINDINGS: {
    'un': 'Unfounded',
    'ex': 'Exonerated',
    'ns': 'Not Sustained',
    'su': 'Sustained',
    'nc': 'No Cooperation',
    'na': 'No Affidavit',
    'ds': 'Discharged'
  },

  RANKS: {
    'PO': 'Police Officer',
    'LT': 'Lieutenant',
    'ET': 'Evidence Technician',
    'DET': 'Detective',
    'FTO': 'Field Training Officer',
    'Cpt': 'Captain',
    'SGT': 'Sergeant',
    'CMDR': 'Commander',
    'Agent': 'Agent',
    'Chief': 'Chief',
    '': 'N/A'
  },

  UNITS: {
    '001': 'District 1 - Central',
    '012': 'District 12 - Near West',
    '002': 'District 2 - Wentworth',
    '014': 'District 14 - Shakespeare',
    '003': 'District 3 - Grand Crossing',
    '015': 'District 15 - Austin',
    '004': 'District 4 - South Chicago',
    '016': 'District 16 - Jefferson Park',
    '005': 'District 5 - Calumet',
    '017': 'District 17 - Albany Park',
    '006': 'District 6 - Gresham',
    '018': 'District 18 - Near North',
    '007': 'District 7 - Englewood',
    '019': 'District 19 - Town Hall',
    '008': 'District 8 - Chicago Lawn',
    '020': 'District 20 - Lincoln',
    '009': 'District 9 - Deering',
    '022': 'District 22 - Morgan Park',
    '010': 'District 10 - Ogden',
    '024': 'District 24 - Rogers Park',
    '011': 'District 11 - Harrison',
    '025': 'District 25 - Grand Central',
    '026': 'District Executive Officers Unit',
    '044': 'Recruit Training',
    '045': 'District Reinstatement',
    '050': 'Airport Law Enforcement Unit-North',
    '051': 'Airport Law Enforcement Unit-South',
    '055': 'Mounted Patrol Unit',
    '059': 'Marine Unit',
    '060': 'Helicopter Unit',
    '079': 'Special Investigations Section',
    '101': 'Police Board',
    '102': 'Office of News Affairs',
    '111': 'Office of the Superintendent',
    '113': 'Independent Police Review Authority (IPRA)',
    '114': 'Legal Affairs Section',
    '115': 'Office of Crime Control Strategies',
    '116': 'Deployment Operations Center',
    '118': 'Chaplains Section',
    '120': 'Bureau of Administration',
    '121': 'Bureau of Internal Affairs',
    '122': 'Finance Division',
    '123': 'Human Resources Division',
    '124': 'Education and Training Division',
    '125': 'Public Safety Information Technology (PSIT)',
    '126': 'Inspection Division',
    '127': 'Research and Development Division',
    '128': 'Professional Counseling Division',
    '129': 'Management and Labor Affairs Section',
    '130': 'Bureau of Organizational Development',
    '133': 'Information and Strategic Services',
    '134': 'Field Technology Training Unit',
    '135': 'Chicago Alternative Policing Strategy (CAPS) Division',
    '136': 'Special Events Unit',
    '140': 'Office of the First Deputy Superintendent',
    '141': 'Special Functions Division',
    '142': 'Bureau of Patrol',
    '145': 'Traffic Section',
    '148': 'Traffic Court Unit',
    '154': 'Traffic Safety and Training',
    '161': 'General Support Division',
    '162': 'Records Division',
    '163': 'Records Inquiry Section',
    '166': 'Field Services Section',
    '167': 'Evidence and Recovered Property Section',
    '168': 'Auto Pounds Section',
    '169': 'Police Documents Section',
    '171': 'Central Detention',
    '172': 'Equipment and Supply Section',
    '173': 'Fleet Liaison Section',
    '175': 'Telecommunications Unit',
    '176': 'Communication Operations Unit',
    '177': 'Forensics Services Division',
    '178': 'Property Facility Management Unit',
    '179': 'Reproduction and Graphic Arts Section',
    '180': 'Bureau of Detectives',
    '184': 'Youth Investigation Section',
    '188': 'Bureau of Organized Crime',
    '189': 'Narcotics Division',
    '191': 'Intelligence Section',
    '192': 'Vice and Asset Forfeiture Division',
    '193': 'Gang Investigation Division',
    '196': 'Asset Forfeiture Investigations Section',
    '211': 'Bureau of Patrol - Area Central',
    '212': 'Bureau of Patrol - Area South',
    '213': 'Bureau of Patrol - Area North',
    '214': 'Office of Freedom of Information',
    '222': 'Timekeeping Unit - Headquarters',
    '231': 'Medical Services Section',
    '241': 'Troubled Buildings Section',
    '242': 'Fleet Management Detail Unit',
    '261': 'Court Section',
    '276': 'OEMC-Detail Section',
    '277': 'Forensic Services - Evidence Technician Section',
    '311': 'Gang Enforcement - Area Central',
    '312': 'Gang Enforcement - Area South',
    '313': 'Gang Enforcement - Area North',
    '341': 'Canine Unit',
    '353': 'Special Weapons and Tactics (SWAT) Unit',
    '376': 'Alternate Response Section',
    '384': 'Juvenile Intervention Support Center (JISC)',
    '393': 'Gang Enforcement Division',
    '441': 'Special Activities Section',
    '442': 'Bomb Unit',
    '443': 'Bomb Unit - O\'Hare Airport\'',
    '541': 'FOP Detail',
    '542': 'Detached Services - Governmental Security Detail',
    '543': 'Detached Services-Miscellaneous Detail',
    '545': 'PBPA Sergeant',
    '547': 'Chicago Police Memorial Foundation',
    '549': 'Inspector General Detail Unit',
    '603': 'Arson Section',
    '606': 'Central Investigations Division',
    '608': 'Major Accident Investigation Unit',
    '610': 'Bureau of Detectives - Area Central',
    '620': 'Bureau of Detectives - Area South',
    '630': 'Bureau of Detectives - Area North',
    '701': 'Public Transportation Section',
    '702': 'CTA Security Unit',
    '704': 'Transit Security Unit',
    '711': 'Violence Reduction Initiative - North',
    '712': 'Violence Reduction Initiative - South'
  },

  OFFICER_SUMMARY_MAP: {
    'Rank': 'rank',
    'Unit': 'unit',
    'Joined': 'appt_date',
    'Sex': 'gender',
    'Race': 'race'
  },

  DOCUMENT_NAMES: {
    'CR': 'Investigation report',
    'CPB': 'Police board hearing'
  },

  OFFICER_COMPLAINT_COUNT_RANGE: [20, 9, 3, 2, 0],

  // API endpoints
  ALLEGATION_API_ENDPOINT: '/mobile/api/allegation/',
  OFFICER_API_ENDPOINT: '/mobile/api/officer/',
  SUGGESTION_API_ENDPOINT: '/mobile/api/suggestion/',
  REQUEST_EMAIL_API_EMAIL: '/mobile/api/request_email/',
  INTERFACE_TEXT_API_ENDPOINT: '/mobile/api/interface_text/',

  //Time format
  SIMPLE_DATE_FORMAT: 'MMM DD, YYYY',
  SIMPLE_SERVER_DATE_FORMAT: 'YYYY-MM-DD',
  SEARCH_INCIDENT_DATE_FORMAT: 'MMM Do, YYYY',
  FIRST_AVAILABLE_DATE_FORMAT: 'DD/MM/YYYY',
  FIRST_AVAILABLE_DATE: '02/01/1970',

  //Interface text cache
  INTERFACE_TEXT_EXPIRED_TIMESPAN: 3600000, //ms

  //Hash
  SALT: '8qTCKQzt5jYYTADWcUO8'
};

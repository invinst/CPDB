if (!global.DEFAULT_SITE_TITLE) {
  global.DEFAULT_SITE_TITLE = '';
}
var c = 0;

module.exports = {
  CHANGE_EVENT: c++,
  SET_ACTIVE_COMPLAINT_LIST_FILTER: c++,
  RECEIVED_OUTCOME_FILTER_ANALYSIS: c++,
  COMPLAINT_LIST_RECEIVED_DATA: c++,
  COMPLAINT_LIST_RECEIVED_MORE_DATA: c++,
  COMPLAINT_LIST_GET_DATA: c++,
  COMPLAINT_LIST_GET_MORE_DATA: c++,

  OFFICER_COMPLAINT_LIST_RECEIVED_DATA: c++,
  OFFICER_MOUSE_OUT: c++,
  MAP_CHANGE_FILTER: c++,
  MAP_REPLACE_FILTERS: c++,
  MAP_ADD_FILTER: c++,
  SET_SUMMARY: c++,
  OFFICER_VIEW_MORE: c++,
  SET_ACTIVE_OFFICER: c++,
  SET_ACTIVE_OFFICER_IN_OFFICER_PAGE: c++,
  SET_OFFICER_LIST_FILTER: c++,
  INIT: c++,
  SAVE_SESSION: c++,
  ENTER_EMBED_MODE: c++,
  LEAVE_EMBED_MODE: c++,

  RECEIVED_OFFICER_DATA: c++,

  RECEIVED_SESSION_DATA: c++,
  RECEIVED_UPDATED_SESSION_DATA: c++,
  UPDATE_TITLE: c++,
  TOGGLE_COMPLAINT: c++,

  SHOW_DISCLAIMER: c++,
  DISCLAIMER_HIDDEN: c++,

  SET_STORY_DOCUMENT_THUMB: c++,
  RECEIVE_STORIES: c++,

  ADD_TAG: c++,
  REMOVE_TAG: c++,
  PIN_TAG: c++,

  AVG_COMPLAINTS_NUMBER_GREEN: 20,
  AVG_COMPLAINTS_NUMBER_YELLOW: 60,
  MAX_OFFICER_NAME_LENGTH: 20,

  MAP_TOKEN: 'pk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiVnBNOEp4byJ9.7i2N7gTV-t_QtAA-kAAlFA',
  MAP_TYPE: 'mapbox.streets',

  NUMERAL_FORMAT: '0,0',

  FILTERS: {
    'all': 'All',
    'disciplined': 'Disciplined',
    'sustained': 'Sustained',
    'not-sustained': 'Not Sustained',
    'exonerated': 'Exonerated',
    'unfounded': 'Unfounded',
    'other': 'Other'
  },

  FILTER_CODES: {
    'sustained': 'SU',
    'not-sustained': 'NS',
    'exonerated': 'EX',
    'unfounded': 'UN',
    'other': ['NC', 'NA', 'DS', 'ZZ']
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
    '443': "Bomb Unit - O'Hare Airport'",
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

  OFFICER_INFORMATION_TITLES: {
    'rank': 'Rank',
    'star': 'Star',
    'joinedDate': 'Joined',
    'race': 'Race',
    'gender': 'Sex',
    'unitWithName': 'Unit'
  },

  DEFAULT_SITE_TITLE: DEFAULT_SITE_TITLE,  // from global variable

  MEDIA_URL: '/media/',

  MAP_MARKER_ICON_URL: 'http://data.invisible.institute/static/img/64x_map_marker.png',
  OFFICER_PAGE_API_ENDPOINT: '/officer',
  SESSION_API_ENDPOINT: '/api/allegations/session/',

  DATE_FORMAT: 'D MMM, YYYY'
};

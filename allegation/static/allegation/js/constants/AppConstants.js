var c = 0;

if (!global.DEFAULT_SITE_TITLE) {
  global.DEFAULT_SITE_TITLE = 'Citizens Police Data Project';
}
if (!global.STORY_TYPES_ORDER) {
  global.STORY_TYPES_ORDER = '';
}

module.exports = {
  CHANGE_EVENT: c++,
  SET_ACTIVE_COMPLAINT_LIST_FILTER: c++,
  SET_ACTIVE_COMPLAINT_LIST_FILTER_SUB_PAGE: c++,
  RECEIVED_OUTCOME_FILTER_ANALYSIS: c++,
  COMPLAINT_LIST_RECEIVED_DATA: c++,
  COMPLAINT_LIST_RECEIVED_MORE_DATA: c++,
  COMPLAINT_LIST_GET_DATA: c++,
  COMPLAINT_LIST_GET_MORE_DATA: c++,

  ALLEGATION_DETAILS_DATA_RECEIVED: c++,

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
  SESSION_CREATED: c++,
  RECEIVED_SHARED_SESSION: c++,
  CLOSE_SHARE_BAR: c++,

  ENTER_EMBED_MODE: c++,
  LEAVE_EMBED_MODE: c++,

  RECEIVED_OFFICER_DATA: c++,

  RECEIVED_TIMELINE_DATA: c++,

  RECEIVED_SESSION_DATA: c++,
  RECEIVED_UPDATED_SESSION_DATA: c++,
  UPDATE_TITLE: c++,
  TOGGLE_COMPLAINT: c++,

  SHOW_DISCLAIMER: c++,
  DISCLAIMER_HIDDEN: c++,

  SET_STORY_DOCUMENT_THUMB: c++,
  RECEIVE_STORIES: c++,

  CHANGE_SITE_TITLE: c++,

  ADD_TAG: c++,
  TOGGLE_TAGS: c++,
  REMOVE_TAG: c++,
  REMOVED_TAG: c++,
  PIN_TAG: c++,
  TOGGLE_ALL_TAGS: c++,
  REMOVE_CATEGORY: c++,
  SAVE_TAGS: c++,

  RECEIVED_SUNBURST_DATA: c++,
  SUNBURST_SELECT_ARC: c++,
  SUNBURST_HOVER_ARC: c++,
  SUNBURST_LEAVE_ARC: c++,
  SUNBURST_CLEAR_CONTROL: c++,
  MOBILE_SEARCH_CLICK: c++,
  MOBILE_SEARCH_COLLAPSE: c++,

  DOWNLOAD_PROCESS: c++,
  GENERATED_DOWNLOAD: c++,

  NAV_GO_TO_PAGE: c++,

  MAP_CHANGE_MARKERS: c++,

  RECEIVED_INVESTIGATOR_DATA: c++,

  AVG_COMPLAINTS_NUMBER_GREEN: 20,
  AVG_COMPLAINTS_NUMBER_YELLOW: 60,
  MAX_OFFICER_NAME_LENGTH: 20,

  RACE_GENDER_TAB_RECEIVED_DATA: c++,

  SET_ACTIVE_TAB: c++,
  TOGGLE_OVERLAY: c++,
  MAP_TOKEN: '***REMOVED***',
  MAP_TYPE: 'invisibleinstitute.acaf9ef3',

  WAGTAIL_GLOSSARY_PAGE_RECEIVED_DATA: c++,
  CHANGE_WAGTAIL_PAGE: c++,

  TOGGLE_STACKING_MODE: c++,

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

  AUTOCOMPLETE_CATEGORY_NAMES: {
    'allegation__crid': 'Allegation ID',
    'cat__category': 'Category',
    'cat__cat_id': 'Category ID',
    'cat': 'Allegation type',
    'allegation__investigator': 'Investigator',
    'officer': 'Officer',
    'officer__star': 'Badge number',
    'officer__unit': 'Officer Unit',
    'officer__rank': 'Officer Rank',
    'officer__gender': 'Officer Gender',
    'officer__race': 'Officer Race',
    'recc_outcome': 'Recommended Outcome',
    'recc_finding': 'Recommended Finding',
    'final_outcome': 'Final Outcome',
    'final_outcome_class': 'Final Outcome',
    'final_finding': 'Final Finding',
    'final_finding_text': 'Final Finding',
    'incident_date_only__year': 'Incident Year',
    'incident_date_only__year_month': 'Incident Year/Month',
    'incident_date_only': 'Incident Date',
    'allegation__areas__id': 'Area',
    'complainant_gender': 'Complainant Gender',
    'complainant_race': 'Complainant Race',
    'outcome_text': 'Outcome',
    'allegation__city': 'Zip Code',
    'data_source': 'Data Source',
    'officer__allegations_count__gt': 'Repeater',
    'session': 'Session',
    'has_filters': 'has:',
    'allegation__investigator__agency': 'Investigator Agency'
  },

  AUTOCOMPLETE_DISPLAY_CATEGORY_IN_TAG: [
    'officer__gender',
    'complainant_gender',
    'officer__race',
    'complainant_race'
  ],

  DEFAULT_SITE_TITLE: DEFAULT_SITE_TITLE,  // from global variable
  STORY_TYPES_ORDER: STORY_TYPES_ORDER,  // from global variable
  DEFAULT_NAV_TABS: [
    {
      name: 'data',
      display: 'Data'
    },
    {
      name: 'method',
      display: 'Collaboration'
    },
    {
      name: 'story',
      display: 'Backstory'
    },
    {
      name: 'findings',
      display: 'Findings'
    }
  ],

  DOCUMENT_TYPE_NAMES: {
    'CR': 'Investigation report',
    'CPB': 'Police board hearing'
  },

  MEDIA_URL: '/media/',

  MAP_MARKER_ICON_URL: 'http://cpdb.co/static/img/64x_map_marker.png', // it must be a full url
  OFFICER_PAGE_API_ENDPOINT: '/officer/',
  SESSION_API_ENDPOINT: '/api/allegations/session/',
  RACE_GENDER_API_ENDPOINT: '/api/officer-allegations/race-gender/',
  ALLEGATION_DETAILS_API_ENDPOINT: '/api/police-witness/',
  ALLEGATIONS_API_ENDPOINT: '/api/officer-allegations/',
  INVESTIGATOR_API_ENDPOINT: '/investigator/',
  WAGTAIL_GLOSSARY_API_ENDPOINT: [
    '/api/wagtail/v1/pages/?type=wagtail_app.GlossaryPage',
    '&fields=title,subtitle,serialized_glossary_rows,slug'
  ].join(''),

  DATE_FORMAT: 'D MMM, YYYY',

  HAPPYFOX_CONF: {
    EMBED_TOKEN: '31ec3e10-7a4b-11e5-bf4e-83a9062f6735',
    ACCESS_TOKEN: '0caab5f9fe694a1b8a094b6b0f48619e',
    HOST_URL: 'https://happyfoxchat.com',
    ASSETS_URL: 'https://d1l7z5ofrj6ab8.cloudfront.net/visitor'
  },

  TABS: {
    'outcomes': 0,
    'categories': 1,
    'complainants': 2,
    'accused': 3,
    'map': 4
  },

  SUNBURST_ARC_COLORS: {
    'Allegation': '#bfd4df',
    'Unsustained': '#0079ae' ,
    'Sustained': '#ff6000',
    'No Affidavit': '#709dc0',
    'Discharged': '#cbcbcb',
    'No Cooperation': '#a5b4be',
    'Unfounded': '#172b3a',
    'Exonerate': '#62b28c',
    'Not Sustained': '#258aad',
    'Disciplined': '#cc0000',
    'Not Disciplined': '#ff9d5c',
    'Noted': '#ff9d5c',
    'Not Served (Resigned)': '#fdae6a',
    'Not Served (Inactive)': '#fdd0a2',
    'Reinstated by Court Action': '#669999',
    'Reinstated by Police Board': '#66cccc',
    'Unknown': '#989898',
    'No Action Taken': '#688b99',
    '1-9 days': '#ff8a90',
    'Reprimand': '#ff5454',
    '10-30 days': '#ed2121',
    'Termination': '#647a66',
    'Separation': '#4c544c',
    '30+ days': '#930c0c'
  },

  DONUT_CHART_DISCIPLINED_COLOR: '#a5b4be',
  DONUT_CHART_UNDISCIPLINED_COLOR: '#013270',

  DESKTOP_SCREEN_WIDTH: 1024,
  SUNBURST_MAX_WIDTH: 390
};

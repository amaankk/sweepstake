// World Cup 2026 static data: teams, fixtures, knockout bracket.
// Match ids 1-72 are group stage; 73-104 use the official FIFA match numbers
// referenced by the bracket (e.g. "W74" = winner of match 74).
window.WC_DATA = {
  groups: ["A","B","C","D","E","F","G","H","I","J","K","L"],

  teams: [
    { id:"MEX", name:"Mexico",               flag:"🇲🇽", group:"A" },
    { id:"RSA", name:"South Africa",         flag:"🇿🇦", group:"A" },
    { id:"KOR", name:"South Korea",          flag:"🇰🇷", group:"A" },
    { id:"CZE", name:"Czechia",              flag:"🇨🇿", group:"A" },
    { id:"CAN", name:"Canada",               flag:"🇨🇦", group:"B" },
    { id:"BIH", name:"Bosnia & Herzegovina", flag:"🇧🇦", group:"B" },
    { id:"QAT", name:"Qatar",                flag:"🇶🇦", group:"B" },
    { id:"SUI", name:"Switzerland",          flag:"🇨🇭", group:"B" },
    { id:"BRA", name:"Brazil",               flag:"🇧🇷", group:"C" },
    { id:"MAR", name:"Morocco",              flag:"🇲🇦", group:"C" },
    { id:"HAI", name:"Haiti",                flag:"🇭🇹", group:"C" },
    { id:"SCO", name:"Scotland",             flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", group:"C" },
    { id:"USA", name:"United States",        flag:"🇺🇸", group:"D" },
    { id:"PAR", name:"Paraguay",             flag:"🇵🇾", group:"D" },
    { id:"AUS", name:"Australia",            flag:"🇦🇺", group:"D" },
    { id:"TUR", name:"Turkey",               flag:"🇹🇷", group:"D" },
    { id:"GER", name:"Germany",              flag:"🇩🇪", group:"E" },
    { id:"CUW", name:"Curaçao",              flag:"🇨🇼", group:"E" },
    { id:"CIV", name:"Ivory Coast",          flag:"🇨🇮", group:"E" },
    { id:"ECU", name:"Ecuador",              flag:"🇪🇨", group:"E" },
    { id:"NED", name:"Netherlands",          flag:"🇳🇱", group:"F" },
    { id:"JPN", name:"Japan",                flag:"🇯🇵", group:"F" },
    { id:"SWE", name:"Sweden",               flag:"🇸🇪", group:"F" },
    { id:"TUN", name:"Tunisia",              flag:"🇹🇳", group:"F" },
    { id:"BEL", name:"Belgium",              flag:"🇧🇪", group:"G" },
    { id:"EGY", name:"Egypt",                flag:"🇪🇬", group:"G" },
    { id:"IRN", name:"Iran",                 flag:"🇮🇷", group:"G" },
    { id:"NZL", name:"New Zealand",          flag:"🇳🇿", group:"G" },
    { id:"ESP", name:"Spain",                flag:"🇪🇸", group:"H" },
    { id:"CPV", name:"Cape Verde",           flag:"🇨🇻", group:"H" },
    { id:"KSA", name:"Saudi Arabia",         flag:"🇸🇦", group:"H" },
    { id:"URU", name:"Uruguay",              flag:"🇺🇾", group:"H" },
    { id:"FRA", name:"France",               flag:"🇫🇷", group:"I" },
    { id:"SEN", name:"Senegal",              flag:"🇸🇳", group:"I" },
    { id:"IRQ", name:"Iraq",                 flag:"🇮🇶", group:"I" },
    { id:"NOR", name:"Norway",               flag:"🇳🇴", group:"I" },
    { id:"ARG", name:"Argentina",            flag:"🇦🇷", group:"J" },
    { id:"ALG", name:"Algeria",              flag:"🇩🇿", group:"J" },
    { id:"AUT", name:"Austria",              flag:"🇦🇹", group:"J" },
    { id:"JOR", name:"Jordan",               flag:"🇯🇴", group:"J" },
    { id:"POR", name:"Portugal",             flag:"🇵🇹", group:"K" },
    { id:"COD", name:"DR Congo",             flag:"🇨🇩", group:"K" },
    { id:"UZB", name:"Uzbekistan",           flag:"🇺🇿", group:"K" },
    { id:"COL", name:"Colombia",             flag:"🇨🇴", group:"K" },
    { id:"ENG", name:"England",              flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", group:"L" },
    { id:"CRO", name:"Croatia",              flag:"🇭🇷", group:"L" },
    { id:"GHA", name:"Ghana",                flag:"🇬🇭", group:"L" },
    { id:"PAN", name:"Panama",               flag:"🇵🇦", group:"L" },
  ],

  // Group matches: [id, group, date, hh, mm, tzOffsetHours, home, away, venue]
  // Times are venue-local; the app converts to the viewer's timezone.
  groupMatches: [
    [ 1,"A","2026-06-11",13, 0,-6,"MEX","RSA","Mexico City"],
    [ 2,"A","2026-06-11",20, 0,-6,"KOR","CZE","Guadalajara"],
    [ 3,"A","2026-06-18",12, 0,-4,"CZE","RSA","Atlanta"],
    [ 4,"A","2026-06-18",19, 0,-6,"MEX","KOR","Guadalajara"],
    [ 5,"A","2026-06-24",19, 0,-6,"CZE","MEX","Mexico City"],
    [ 6,"A","2026-06-24",19, 0,-6,"RSA","KOR","Monterrey"],
    [ 7,"B","2026-06-12",15, 0,-4,"CAN","BIH","Toronto"],
    [ 8,"B","2026-06-13",12, 0,-7,"QAT","SUI","SF Bay Area"],
    [ 9,"B","2026-06-18",12, 0,-7,"SUI","BIH","Los Angeles"],
    [10,"B","2026-06-18",15, 0,-7,"CAN","QAT","Vancouver"],
    [11,"B","2026-06-24",12, 0,-7,"SUI","CAN","Vancouver"],
    [12,"B","2026-06-24",12, 0,-7,"BIH","QAT","Seattle"],
    [13,"C","2026-06-13",18, 0,-4,"BRA","MAR","New York/NJ"],
    [14,"C","2026-06-13",21, 0,-4,"HAI","SCO","Boston"],
    [15,"C","2026-06-19",18, 0,-4,"SCO","MAR","Boston"],
    [16,"C","2026-06-19",20,30,-4,"BRA","HAI","Philadelphia"],
    [17,"C","2026-06-24",18, 0,-4,"SCO","BRA","Miami"],
    [18,"C","2026-06-24",18, 0,-4,"MAR","HAI","Atlanta"],
    [19,"D","2026-06-12",18, 0,-7,"USA","PAR","Los Angeles"],
    [20,"D","2026-06-13",21, 0,-7,"AUS","TUR","Vancouver"],
    [21,"D","2026-06-19",12, 0,-7,"USA","AUS","Seattle"],
    [22,"D","2026-06-19",20, 0,-7,"TUR","PAR","SF Bay Area"],
    [23,"D","2026-06-25",19, 0,-7,"TUR","USA","Los Angeles"],
    [24,"D","2026-06-25",19, 0,-7,"PAR","AUS","SF Bay Area"],
    [25,"E","2026-06-14",12, 0,-5,"GER","CUW","Houston"],
    [26,"E","2026-06-14",19, 0,-4,"CIV","ECU","Philadelphia"],
    [27,"E","2026-06-20",16, 0,-4,"GER","CIV","Toronto"],
    [28,"E","2026-06-20",19, 0,-5,"ECU","CUW","Kansas City"],
    [29,"E","2026-06-25",16, 0,-4,"CUW","CIV","Philadelphia"],
    [30,"E","2026-06-25",16, 0,-4,"ECU","GER","New York/NJ"],
    [31,"F","2026-06-14",15, 0,-5,"NED","JPN","Dallas"],
    [32,"F","2026-06-14",20, 0,-6,"SWE","TUN","Monterrey"],
    [33,"F","2026-06-20",12, 0,-5,"NED","SWE","Houston"],
    [34,"F","2026-06-20",22, 0,-6,"TUN","JPN","Monterrey"],
    [35,"F","2026-06-25",18, 0,-5,"JPN","SWE","Dallas"],
    [36,"F","2026-06-25",18, 0,-5,"TUN","NED","Kansas City"],
    [37,"G","2026-06-15",12, 0,-7,"BEL","EGY","Seattle"],
    [38,"G","2026-06-15",18, 0,-7,"IRN","NZL","Los Angeles"],
    [39,"G","2026-06-21",12, 0,-7,"BEL","IRN","Los Angeles"],
    [40,"G","2026-06-21",18, 0,-7,"NZL","EGY","Vancouver"],
    [41,"G","2026-06-26",20, 0,-7,"EGY","IRN","Seattle"],
    [42,"G","2026-06-26",20, 0,-7,"NZL","BEL","Vancouver"],
    [43,"H","2026-06-15",12, 0,-4,"ESP","CPV","Atlanta"],
    [44,"H","2026-06-15",18, 0,-4,"KSA","URU","Miami"],
    [45,"H","2026-06-21",12, 0,-4,"ESP","KSA","Atlanta"],
    [46,"H","2026-06-21",18, 0,-4,"URU","CPV","Miami"],
    [47,"H","2026-06-26",19, 0,-5,"CPV","KSA","Houston"],
    [48,"H","2026-06-26",18, 0,-6,"URU","ESP","Guadalajara"],
    [49,"I","2026-06-16",15, 0,-4,"FRA","SEN","New York/NJ"],
    [50,"I","2026-06-16",18, 0,-4,"IRQ","NOR","Boston"],
    [51,"I","2026-06-22",17, 0,-4,"FRA","IRQ","Philadelphia"],
    [52,"I","2026-06-22",20, 0,-4,"NOR","SEN","New York/NJ"],
    [53,"I","2026-06-26",15, 0,-4,"NOR","FRA","Boston"],
    [54,"I","2026-06-26",15, 0,-4,"SEN","IRQ","Toronto"],
    [55,"J","2026-06-16",20, 0,-5,"ARG","ALG","Kansas City"],
    [56,"J","2026-06-16",21, 0,-7,"AUT","JOR","SF Bay Area"],
    [57,"J","2026-06-22",12, 0,-5,"ARG","AUT","Dallas"],
    [58,"J","2026-06-22",20, 0,-7,"JOR","ALG","SF Bay Area"],
    [59,"J","2026-06-27",21, 0,-5,"ALG","AUT","Kansas City"],
    [60,"J","2026-06-27",21, 0,-5,"JOR","ARG","Dallas"],
    [61,"K","2026-06-17",12, 0,-5,"POR","COD","Houston"],
    [62,"K","2026-06-17",20, 0,-6,"UZB","COL","Mexico City"],
    [63,"K","2026-06-23",12, 0,-5,"POR","UZB","Houston"],
    [64,"K","2026-06-23",20, 0,-6,"COL","COD","Guadalajara"],
    [65,"K","2026-06-27",19,30,-4,"COL","POR","Miami"],
    [66,"K","2026-06-27",19,30,-4,"COD","UZB","Atlanta"],
    [67,"L","2026-06-17",15, 0,-5,"ENG","CRO","Dallas"],
    [68,"L","2026-06-17",19, 0,-4,"GHA","PAN","Toronto"],
    [69,"L","2026-06-23",16, 0,-4,"ENG","GHA","Boston"],
    [70,"L","2026-06-23",19, 0,-4,"PAN","CRO","Toronto"],
    [71,"L","2026-06-27",17, 0,-4,"PAN","ENG","New York/NJ"],
    [72,"L","2026-06-27",17, 0,-4,"CRO","GHA","Philadelphia"],
  ],

  // Knockout matches: [id, round, date, hh, mm, tz, homeSource, awaySource, venue]
  // Sources: "1A"=Group A winner, "2A"=runner-up, "3:ABCDF"=a third-placed team
  // from one of those groups (picked manually — FIFA's allocation chart decides
  // the real mapping), "W74"/"L101"=winner/loser of that match number.
  koMatches: [
    [ 73,"r32","2026-06-28",12, 0,-7,"2A","2B","Los Angeles"],
    [ 74,"r32","2026-06-29",16,30,-4,"1E","3:ABCDF","Boston"],
    [ 75,"r32","2026-06-29",19, 0,-6,"1F","2C","Monterrey"],
    [ 76,"r32","2026-06-29",12, 0,-5,"1C","2F","Houston"],
    [ 77,"r32","2026-06-30",17, 0,-4,"1I","3:CDFGH","New York/NJ"],
    [ 78,"r32","2026-06-30",12, 0,-5,"2E","2I","Dallas"],
    [ 79,"r32","2026-06-30",19, 0,-6,"1A","3:CEFHI","Mexico City"],
    [ 80,"r32","2026-07-01",12, 0,-4,"1L","3:EHIJK","Atlanta"],
    [ 81,"r32","2026-07-01",17, 0,-7,"1D","3:BEFIJ","SF Bay Area"],
    [ 82,"r32","2026-07-01",13, 0,-7,"1G","3:AEHIJ","Seattle"],
    [ 83,"r32","2026-07-02",19, 0,-4,"2K","2L","Toronto"],
    [ 84,"r32","2026-07-02",12, 0,-7,"1H","2J","Los Angeles"],
    [ 85,"r32","2026-07-02",20, 0,-7,"1B","3:EFGIJ","Vancouver"],
    [ 86,"r32","2026-07-03",18, 0,-4,"1J","2H","Miami"],
    [ 87,"r32","2026-07-03",20,30,-5,"1K","3:DEIJL","Kansas City"],
    [ 88,"r32","2026-07-03",13, 0,-5,"2D","2G","Dallas"],
    [ 89,"r16","2026-07-04",17, 0,-4,"W74","W77","Philadelphia"],
    [ 90,"r16","2026-07-04",12, 0,-5,"W73","W75","Houston"],
    [ 91,"r16","2026-07-05",16, 0,-4,"W76","W78","New York/NJ"],
    [ 92,"r16","2026-07-05",18, 0,-6,"W79","W80","Mexico City"],
    [ 93,"r16","2026-07-06",14, 0,-5,"W83","W84","Dallas"],
    [ 94,"r16","2026-07-06",17, 0,-7,"W81","W82","Seattle"],
    [ 95,"r16","2026-07-07",12, 0,-4,"W86","W88","Atlanta"],
    [ 96,"r16","2026-07-07",13, 0,-7,"W85","W87","Vancouver"],
    [ 97,"qf", "2026-07-09",16, 0,-4,"W89","W90","Boston"],
    [ 98,"qf", "2026-07-10",12, 0,-7,"W93","W94","Los Angeles"],
    [ 99,"qf", "2026-07-11",17, 0,-4,"W91","W92","Miami"],
    [100,"qf", "2026-07-11",20, 0,-5,"W95","W96","Kansas City"],
    [101,"sf", "2026-07-14",14, 0,-5,"W97","W98","Dallas"],
    [102,"sf", "2026-07-15",15, 0,-4,"W99","W100","Atlanta"],
    [103,"third","2026-07-18",17, 0,-4,"L101","L102","Miami"],
    [104,"final","2026-07-19",15, 0,-4,"W101","W102","New York/NJ"],
  ],

  // Results baked into the published site (everyone sees these without any
  // local edits). Format: matchId: [homeGoals, awayGoals] or
  // [homeGoals, awayGoals, "h"|"a"] when a knockout tie went to penalties.
  seedResults: {
    1:  [2,0],  // Mexico 2-0 South Africa
    2:  [2,1],  // South Korea 2-1 Czechia
    7:  [1,1],  // Canada 1-1 Bosnia & Herzegovina
    8:  [1,1],  // Qatar 1-1 Switzerland
    13: [1,1],  // Brazil 1-1 Morocco
    14: [0,1],  // Haiti 0-1 Scotland
    19: [4,1],  // USA 4-1 Paraguay
    20: [2,0],  // Australia 2-0 Turkey
    25: [7,1],  // Germany 7-1 Curaçao
    26: [1,0],  // Ivory Coast 1-0 Ecuador
    31: [2,2],  // Netherlands 2-2 Japan
    32: [5,1],  // Sweden 5-1 Tunisia
    37: [1,1],  // Belgium 1-1 Egypt
    38: [2,2],  // Iran 2-2 New Zealand
    43: [0,0],  // Spain 0-0 Cape Verde
    44: [1,1],  // Saudi Arabia 1-1 Uruguay
    49: [3,1],  // France 3-1 Senegal
    50: [1,4],  // Iraq 1-4 Norway
    55: [3,0],  // Argentina 3-0 Algeria
    56: [3,1],  // Austria 3-1 Jordan
    61: [1,1],  // Portugal 1-1 DR Congo
    62: [1,3],  // Uzbekistan 1-3 Colombia
    67: [4,2],  // England 4-2 Croatia
    68: [1,0],  // Ghana 1-0 Panama
     3: [1,1],  // Czechia 1-1 South Africa
     9: [4,1],  // Switzerland 4-1 Bosnia & Herzegovina
    10: [6,0],  // Canada 6-0 Qatar
     4: [1,0],  // Mexico 1-0 South Korea
    15: [0,1],  // Scotland 0-1 Morocco
    16: [3,0],  // Brazil 3-0 Haiti
    21: [2,0],  // USA 2-0 Australia
    22: [0,1],  // Turkey 0-1 Paraguay
    27: [2,1],  // Germany 2-1 Ivory Coast
    28: [0,0],  // Ecuador 0-0 Curaçao
    33: [5,1],  // Netherlands 5-1 Sweden
    34: [0,4],  // Tunisia 0-4 Japan
    39: [0,0],  // Belgium 0-0 Iran
    40: [1,3],  // New Zealand 1-3 Egypt
    45: [4,0],  // Spain 4-0 Saudi Arabia
    46: [2,2],  // Uruguay 2-2 Cape Verde
    51: [3,0],  // France 3-0 Iraq
    52: [3,2],  // Norway 3-2 Senegal
    57: [2,0],  // Argentina 2-0 Austria
    58: [1,2],  // Jordan 1-2 Algeria
    63: [5,0],  // Portugal 5-0 Uzbekistan
    64: [1,0],  // Colombia 1-0 DR Congo
    69: [0,0],  // England 0-0 Ghana
    70: [0,1],  // Panama 0-1 Croatia

    // Final group matchday (Jun 24-27)
    11: [2,1],  // Switzerland 2-1 Canada
    12: [3,1],  // Bosnia & Herzegovina 3-1 Qatar
    17: [0,3],  // Scotland 0-3 Brazil
    18: [4,2],  // Morocco 4-2 Haiti
     5: [0,3],  // Czechia 0-3 Mexico
     6: [1,0],  // South Africa 1-0 South Korea
    23: [3,2],  // Turkey 3-2 USA
    24: [0,0],  // Paraguay 0-0 Australia
    29: [0,2],  // Curaçao 0-2 Ivory Coast
    30: [2,1],  // Ecuador 2-1 Germany
    35: [1,1],  // Japan 1-1 Sweden
    36: [1,3],  // Tunisia 1-3 Netherlands
    41: [1,1],  // Egypt 1-1 Iran
    42: [1,5],  // New Zealand 1-5 Belgium
    47: [0,0],  // Cape Verde 0-0 Saudi Arabia
    48: [0,1],  // Uruguay 0-1 Spain
    53: [1,4],  // Norway 1-4 France
    54: [5,0],  // Senegal 5-0 Iraq
    59: [3,3],  // Algeria 3-3 Austria
    60: [1,3],  // Jordan 1-3 Argentina
    65: [0,0],  // Colombia 0-0 Portugal
    66: [3,1],  // DR Congo 3-1 Uzbekistan
    71: [0,2],  // Panama 0-2 England
    72: [2,1],  // Croatia 2-1 Ghana
    // R32
    73: [0,1],  // South Africa 0-1 Canada
    74: [1,1,"a"],  // Germany 1-1 Paraguay (Paraguay win pens)
    75: [1,1,"a"],  // Netherlands 1-1 Morocco (Morocco win pens)
    76: [2,1],  // Brazil 2-1 Japan
    77: [3,0],  // France 3-0 Sweden
    78: [1,2],  // Ivory Coast 1-2 Norway
  },

  seedPlayers: ["BK","Kevin","Amaan","Mpacko","Lwazi","Tom"],
  seedAssignments: {"MEX":1,"RSA":4,"KOR":2,"CZE":0,"CAN":0,"BIH":4,"QAT":0,"SUI":1,"BRA":4,"MAR":5,"HAI":0,"SCO":2,"USA":3,"PAR":1,"AUS":0,"TUR":2,"GER":3,"CUW":5,"CIV":1,"ECU":3,"NED":5,"JPN":1,"SWE":2,"TUN":4,"BEL":5,"EGY":0,"IRN":0,"NZL":3,"ESP":4,"CPV":3,"KSA":1,"URU":3,"FRA":3,"SEN":2,"IRQ":3,"NOR":1,"ARG":4,"ALG":5,"AUT":4,"JOR":2,"POR":2,"COD":5,"UZB":5,"COL":1,"ENG":5,"CRO":2,"GHA":0,"PAN":4},
  seedSlots: {74:{a:"PAR"},77:{a:"SWE"},79:{a:"ECU"},80:{a:"COD"},81:{a:"BIH"},82:{a:"SEN"},85:{a:"ALG"},87:{a:"GHA"}},
};

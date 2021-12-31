const { prefix } = require("../../json/botconfiguration.json")
const SQLite = require("better-sqlite3");
const userDatabase = new SQLite('./database/bi-db.sqlite');
const request = require('request');

module.exports = async client => {
    console.log(`${client.user.username} is now online.`)
    client.user.setActivity("< Portal rulez boon", {type: "PLAYING"});
    //DB Creation/Preperation
    const BIDBTable = userDatabase.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name ='bi_users';").get();

    if (!BIDBTable['count(*)']) {
        userDatabase.prepare("CREATE TABLE bi_users (unique_id TEXT PRIMARY KEY, boon_username TEXT, boon_rank INTEGER, boon_tag TEXT, boon_last_promoter_tag TEXT, boon_last_promo_time INTEGER, boon_total_promotions INTEGER, boon_total_trainings INTEGER, boon_strikes INTEGER, boon_warnings INTEGER, boon_ic_points INTEGER);").run();
        userDatabase.prepare("CREATE UNIQUE INDEX idx_bi_users_id ON bi_users (unique_id);").run();
        userDatabase.pragma("synchronous = 1");
        userDatabase.pragma("journal_mode = wal");
    }
    client.getUserRow = userDatabase.prepare("SELECT * FROM bi_users WHERE boon_username = ? COLLATE NOCASE");
    client.setUserRow = userDatabase.prepare("INSERT OR REPLACE INTO bi_users (unique_id, boon_username, boon_rank, boon_tag, boon_last_promoter_tag, boon_last_promo_time, boon_total_promotions, boon_total_trainings, boon_strikes, boon_warnings, boon_ic_points) VALUES (@unique_id, @boon_username, @boon_rank, @boon_tag, @boon_last_promoter_tag, @boon_last_promo_time, @boon_total_promotions, @boon_total_trainings, @boon_strikes, @boon_warnings, @boon_ic_points);");
    client.deleteUserRow = userDatabase.prepare("DELETE FROM bi_users WHERE boon_username = ? COLLATE NOCASE")
    client.updateID = userDatabase.prepare("UPDATE bi_users SET unique_id=? WHERE unique_id=?")
    client.getAllEntries = userDatabase.prepare("SELECT * FROM bi_users")

    client.loadAvatar = function(avatarUser){
        let postInfo = {
            url: 'https://www.mainImageron.pw/api/look',
            body: JSON.stringify({username: `${avatarUser}`}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                }
            }

            return new Promise ((resolve, reject) => {
                request(postInfo, function (error, response) {
                    if(!response.body) resolve({look: "0"})
                    resolve(JSON.parse(response.body))
                });
    
            })
        }
    

    client.rankList = {
        600: {
            1: "Agent I",
            2: "Agent II",
            3: "Agent III",
            4: "Agent IV",
            5: "Agent V",
            6: "Head Agent",
            7: "Qualified Agent"
        },
        900: {
            8: "Patrol Agent I",
            9: "Patrol Agent II",
            10: "Patrol Agent III",
            11: "Patrol Agent IV",
            12: "Patrol Agent V",
            13: "Patrol Specialist",
            14: "Qualified Patrol"
        },
        1800: {
            15: "Security Agent I",
            16: "Security Agent II",
            17: "Security Agent III",
            18: "Intel Agent I",
            19: "Intel Agent II",
            20: "Intel Agent III",
            21: "Security Supervisor",
            22: "Intel Supervisor",

        },
        2100: {
            23: "Novice Trainer I",
            24: "Novice Trainer II",
            25: "Novice Trainer III",
            26: "Trainer I",
            27: "Trainer II",
            28: "Trainer III",
            29: "Novice Training Supervisor",
            30: "Training Supervisor"
        },
        2400: {
            31: "Operative Assistant",
            32: "Field Operative I",
            33: "Field Operative II",
            34: "Field Operative III",
            35: "Field Operative IV",
            36: "Field Operative V",
            37: "Agent Operative Class C",
            38: "Agent Operative Class B",
            39: "Agent Operative Class A ",
            40: "Leading Operative",
            41: "Chief Operative",
            42: "Head Operative"
        },
        3000: {
            43: "HQ Assistant",
            44: "Manager Intern",
            45: "Junior Manager",
            46: "Manager",
            47: "HQ Agent I",
            48: "HQ Agent II",
            49: "HQ Agent III",
            50: "Chief HQ Agent",
            51: "HQ Supervisor I",
            52: "HQ Supervisor II",
            53: "HQ Supervisor III",
            54: "Senior HQ Supervisor",
            55: "Chief HQ Supervisor"
        },
        3600: {
            56: "​Junior Intel Officer",
            57: "Intel Officer Class C ",
            58: "Intel Officer Class B",
            59: "Intel Officer Class A",
            60: "Research Specialist",
            61: "Data Specialist",
            62: "I.T. Specialist",
            63: "Intelligence Advisor",
            64: "Intelligence Developer",
            65: "Intelligence Admin",
            66: "Intelligence Consultant",
            67: "Intelligence Supervisor"
        },
        5400: {
            68: "​Junior Investigator I",
            69: "Junior Investigator II",
            70: "Junior Investigator III",
            71: "Detective",
            72: "Intermediate Detective",
            73: "Forensic Detective",
            74: "Investigation Inspector",
            75: "Lead Investigator",
            76: "Deputy Investigator",
            77: "Chief Investigator"
        },
        7200: {
            78: "Asst. Department Manager",
            79: "Department Manager",
            80: "Asst. Manager",
            81: "Desk Manager",
            82: "Office Manager",
            83: "Head Manager",
            84: "Asst. Commissioner",
            85: "Deputy Commissioner",
            86: "Commissioner",
            87: "Chief Commissioner",
        },
        14400: {
            88: "​Gov. Member I",
            89: "Gov. Member II",
            90: "Gov. Member III",
            91: "Gov. Officer",
            92: "Asst. Deputy Mayor",
            93: "Deputy Mayor",
            94: "Asst. Mayor",
            95: "Mayor",
            96: "Asst. Representative ",
            97: "Gov. Representative"
        },
        21600:{
            98: "​Adm. Officer I",
            99: "Adm. Officer II",
            100: "Adm. Officer III",
            101: "Adm. Officer IV",
            102: "Adm. Officer V",
            103: "Office Assistant",
            104: "Office Supervisor",
            105: "Senior Coordinator",
            106: "Senior Executive Asst.",
            107: "Senior Support Specialist",
            108: "Asst. Admin. Director",
            109: "Admin. Director",
        },
        25200:{
            110: "​Legal Assistant",
            111: "Paralegal I",
            112: "Paralegal II",
            113: "Paralegal III",
            114: "Trainee Barrister",
            115: "Junior Barrister",
            116: "Barrister",
            117: "Senior Barrister",
            118: "Novice Solicitor",
            119: "Junior Solicitor",
            120: "Solicitor",
            121: "Senior Solicitor",
            122: "Chief Legal Officer"
        },
        36000:{
            123: "​Diplomatic Member I",
            124: "Diplomatic Member II",
            125: "Diplomatic Member III",
            126: "Diplomatic Member IV",
            127: "Diplomatic Member V",
            128: "Junior Diplomat",
            129: "Senior Diplomat",
            130: "Ambassador",
            131: "Minister",
            132: "Counselor",
            133: "Special Ambassador",
            134: "Special Minister"
        },
        86400:{
            135: "​Chief Security Officer",
            136: "Chief Strategy Officer",
            137: "Chief Networking Officer",
            138: "Chief Marketing Officer",
            139: "Chief Financial Officer",
            140: "Chief Compliance Officer",
            141: "Chief Privacy Officer",
            142: "Chief Visionary Officer",
            143: "Chief Operating Officer",
            144: "Chief Executive Officer"
        },
        // From this point on, time no longer is registered.
        "Trial iC":{
            145: "Trial iC"
        },
        "Leadership":{
            146: "Trial Leader",
            147: "Leader of Communications",
            148: "Leader of Innovations",
            149: "Leader of Junior Executives",
            150: "Leader of Senior Executives",
            151: "Leader of Executives",
            152: "Leader of Labor",
            153: "Leader of Finance",
            154: "Board Leader",
            155: "Chair of Leadership"
        },
        "Executives":{
            156: "Trial Executive",
            157: "Executive Assistant",
            158: "Executive Overseer",
            159: "Executive Director",
            160: "Operative Executive",
            161: "Financial Executive",
            162: "Head Executive",
        },
        "Advisory Committee":{
            163: "Trial Adviser",
            164: "Adviser",
            165: "Assistant Adviser",
            167: "Junior Adviser",
            168: "Senior Adviser",
            169: "Adviser Leader"
        },
        "Board of Directors": {
            170: "Director"
        },
        "Foundation":{
            171: "Trial Founder",
            172: "Founder"
        }
    }
    
}  



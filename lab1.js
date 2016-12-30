var request = require('request');

const Site_Name = "http://www.mosigra.ru";
let oldlinks = [];
let emails = [];
let links = [];
links.push(Site_Name);
const matchl = new RegExp('href="(?:(<Site_Name>))?(?:\\.\\.)*(?:\\/?[a-zA-Z0-9%-])+\\??(?:[a-zA-Z0-9]+\\=[a-zA-Z0-9_%-]+[;&]?)*(?:\\.html|\\.htm|\\/)?"'.replace("<Site_Name>", Site_Name), 'g');
const matche = new RegExp('[a-zA-Z0-9]+(?:[._+%-]+[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]?)+[.]((ru)|(com))', 'g');

function round() {
    if ((oldlinks.length < 10) && (links.length > 0)) {
        let curlink = links.shift();
        oldlinks.push(curlink);
        request(curlink, function (error, res, site) {
            if (!error && res.statusCode == 200) {
                let email;
                while (email = matche.exec(site)) {
                    if (emails.indexOf(email[0]) == -1) {
                        emails.push(email[0]);
                    }
                }
                let link;
                let tmplinks = [];
                while (link = matchl.exec(site)) { tmplinks.push(link[0]); }
                if (tmplinks != null) {
                    tmplinks.forEach(function (link, i, arr) {
                        link = link.substring(0, link.length - 1);
                        link = link.replace('href=\"', "");
                        if (link[0] == "/") {
                            link = Site_Name + link;
                        }
                        if (links.indexOf(link) == -1) {
                            links.push(link);
                        }
                    });
                }
                round();
            }
            else { console.log(error); }
        });
    }
    else {
        console.log("\nEmail addresses: ");
        emails.forEach(function (email, i, arr) {
            console.log(email);
        });
    }
}
round();

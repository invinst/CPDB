var React = require('react');
var Router = require('./components/Router.react');
//var Embed = require('./components/Embed.react');
//var OfficerPage = require('./components/OfficerPage.react');
//var SiteTitle = require('./components/SiteTitle.react');


var element = document.getElementById('router');

if(element) {
    React.render(
        <Router />,
        element
    );
}

//var officerProfile = document.getElementById('officer-profile');
//if(officerProfile) {
//    React.render(
//        <OfficerPage officer={officer} related={relatedOfficers} />,
//        officerProfile
//    );
//}
//
//var siteTitle = document.getElementById('site-title');
//if (siteTitle) {
//    React.render(
//      <SiteTitle />,
//      siteTitle
//    );
//}
//
//var embed = document.getElementById('embed');
//if (embed) {
//    React.render(
//      <Embed page={PAGE} pk={PK} query={QUERY} state={STATE} />,
//      embed
//    );
//}

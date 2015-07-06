/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var CPDBApp = require('./components/CPDBApp.react');
var OfficerPage = require('./components/OfficerPage.react');
var SiteTitle = require('./components/SiteTitle.react');


var cpdbElement = document.getElementById('cpdbapp');
if(cpdbElement) {
    React.render(
        <CPDBApp />,
        cpdbElement
    );
}

var officerProfile = document.getElementById('officer-profile');
if(officerProfile) {
    React.render(
        <OfficerPage officer={officer} related={relatedOfficers} />,
        officerProfile
    );
}

var siteTitle = document.getElementById('site-title');
if (siteTitle) {
    React.render(
      <SiteTitle />,
      siteTitle
    );
}


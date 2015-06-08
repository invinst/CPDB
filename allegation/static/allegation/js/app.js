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

var cpdb_el = document.getElementById('cpdbapp');
if(cpdb_el) {
    React.render(
        <CPDBApp />,
        cpdb_el
    );
}
var officer_profile = document.getElementById('officer-profile');
if(officer_profile) {
    React.render(
        <OfficerPage officer={officer} />,
        officer_profile
    );
}

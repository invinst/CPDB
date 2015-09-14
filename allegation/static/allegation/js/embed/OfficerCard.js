/**
 * Created by eastagile on 8/18/15.
 */

var React = require('react');
var Officer = require('./components/Officer.react');


var embed = document.getElementById('embed');
if (embed) {
  jQuery.getJSON('', function(data) {
    React.render(
      <Officer officer={data.officer} />,
      embed
    );
  })
}


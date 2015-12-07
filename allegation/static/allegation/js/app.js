var React = require('react');
var Router = require('./components/Router.react');
var Embed = require('./components/DataToolPage/Embed.react');


global.initReact = function () {
  var element = document.getElementById('router');

  if(element) {
    React.render(
      <Router />,
      element
    );
  }

  var embed = document.getElementById('embed');
  if (embed) {
    React.render(
      <Embed page={PAGE} pk={PK} query={QUERY} state={STATE} />,
      embed
    );
  }
}

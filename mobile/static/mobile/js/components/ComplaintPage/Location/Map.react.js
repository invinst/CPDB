/*global L*/
var React = require('react');
var ReactDOM = require('react-dom');

var u = require('utils/HelperUtil');

var AllegationPresenter = require('presenters/AllegationPresenter');
var MapFacade = require('utils/MapFacade');
var Wrapper = require('components/Shared/Wrapper.react');


var Map = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object
  },

  componentDidMount: function () {
    var allegation = this.props.allegation;
    var point = u.fetch(allegation, 'point', '');
    var allegationPresenter = AllegationPresenter(allegation);

    if (point) {
      MapFacade.initialize(ReactDOM.findDOMNode(this), point);

      if (allegationPresenter.hasFullAddress) {
        MapFacade.addAccidentPlaceMarker();
      }
      else {
        MapFacade.addNoAddressPopup();
      }
    }
  },

  render: function () {
    var point = u.fetch(this.props.allegation, 'point', '');

    return (
      <Wrapper wrapperClass='map' visible={ (!!point) } />
    );
  }
});

module.exports = Map;

var React = require('react');

var SimpleTimeline = React.createClass({
  render: function () {
    return (
      <div className='simple-timeline'>
        <div className='wrapper'>
          <svg version="1.1" id="layer_1" x="0px" y="0px" viewBox="0 0 400 400" enable-background="new 0 0 400 400">
         <g>
          <title>Layer 1</title>
          <rect id="svg_15" height="6" width="0" y="-52" x="407.5" stroke-linecap="null" stroke-linejoin="null" fill="#bfbfbf"/>
          <rect id="svg_16" height="200" width="2" y="0" x="214.5" stroke-linecap="null" stroke-linejoin="null" fill="#bfbfbf"/>
          <rect fill="black" stroke-linejoin="null" stroke-linecap="null" x="242.5" y="86" width="1" height="57" id="svg_11"/>
          <rect fill="black" stroke-linejoin="null" stroke-linecap="null" x="143.5" y="106" width="2" height="36" id="svg_11"/>
          <rect fill="black" stroke-linejoin="null" stroke-linecap="null" x="49.5" y="85" width="1" height="57" id="svg_11"/>
          <rect id="svg_13" height="2" width="293" y="141" x="4.5" stroke-linecap="null" stroke-linejoin="null" fill="black"/>
          <rect id="svg_14" height="200" width="2" y="0" x="88.5" stroke-linecap="null" stroke-linejoin="null" fill="#bfbfbf"/>
          <rect fill="#ffffff" stroke-linejoin="null" stroke-linecap="null" x="100" y="68" width="101" height="46" id="svg_20"/>
          <rect fill="#ffffff" stroke-linejoin="null" stroke-linecap="null" x="194" y="35" width="101" height="46" id="svg_21"/>
          <rect fill="#ffffff" stroke-linejoin="null" stroke-linecap="null" x="9.5" y="40" width="101" height="46" id="svg_17"/>
          <text fill="#7f7f7f" y="62" x="11" id="svg_4">Investigation start</text>
          <text transform="matrix(1,0,0,1.1538461446762085,0,-10.15384554862976) " fill="black" y="77" x="18" id="svg_5">Dec 11, 2013</text>
          <text fill="#bfbfbf" y="86" x="111" id="svg_6">Incident date</text>
          <text transform="matrix(1,0,0,1.1538461446762085,0,-13.999999165534973) " fill="black" y="100.26667" x="110" id="svg_7">Dec 11, 2013</text>
          <text fill="black" y="48" x="198" id="svg_8">Investigation end</text>
          <text transform="matrix(1,0,0,1.1538461446762085,0,-7.999999523162842) " fill="black" y="62.13333" x="204" id="svg_9" font-weight="bold">Mar 11, 2015</text>
          <text fill="black" y="79" x="210" id="svg_10" font-style="italic">Exonerated</text>
          <ellipse fill="#bfbfbf" stroke-linejoin="null" stroke-linecap="null" cx="48.5" cy="141" id="svg_18" rx="6" ry="6"/>
          <ellipse fill="#bfbfbf" stroke-linejoin="null" stroke-linecap="null" cx="144.5" cy="141" id="svg_18" rx="6" ry="6"/>
          <ellipse fill="#bfbfbf" stroke-linejoin="null" stroke-linecap="null" cx="242.5" cy="141" id="svg_18" rx="6" ry="6"/>
         </g>
          </svg>
        </div>
      </div>
    )
  }
});

module.exports = SimpleTimeline;

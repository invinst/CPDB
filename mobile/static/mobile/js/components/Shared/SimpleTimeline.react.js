var React = require('react');


var SimpleTimeline = React.createClass({
  render: function () {
    var bold = {
      'fontWeight': '700'
    };

    var italic = {
      'fontStyle': 'italic'
    };

    return (
      <div className='simple-timeline'>
        <svg x='0px' y='0px' viewBox='0 0 400 200' enable-background='new 0 0 400 200'
             preserveAspectRatio='xMidYMid meet'>
          <g>
            <rect className='x-axis' height='1' width='392.99999' y='141' x='4.5' fill='black'/>
            <rect className='y-axis' height='200' width='2' y='0' x='123.5' fill='#bfbfbf'/>
            <rect className='y-axis' height='200' width='2' y='0' x='257.5' fill='#bfbfbf'/>

            <g className='line'>
              <rect x='322.5' y='86' height='57' fill='black' width='2'/>
              <rect x='187.5' y='106' height='36' fill='black' width='2'/>
              <rect x='52.5' y='101' height='41' fill='black' width='2'/>
            </g>

            <g className='rect-wrapper' fill='#ffffff'>
              <rect x='148' y='68' width='81' height='46'/>
              <rect x='267' y='24' width='114' height='55'/>
              <rect x='6.5' y='51' width='120' height='46'/>
            </g>

            <text fontSize='16' fill='#7f7f7f' y='67' x='2'>Investigation start</text>
            <text fontSize='15' fill='black' y='87' x='17'>Dec 11, 2013</text>
            <text fontSize='16' fill='#7f7f7f' y='86' x='152'>Incident date</text>
            <text fontSize='15' fill='black' y='103' x='152'>Dec 11, 2013</text>
            <text fontSize='16' fill='#7f7f7f' y='45' x='270'>Investigation end</text>
            <text fontSize='15' style={bold} y='64' x='287'>Mar 11, 2015</text>
            <text fontSize='16' fill='black' y='84' x='290' style={italic}>Exonerated</text>
            <g>
              <ellipse fill='#bfbfbf' cx='52.5' cy='141' rx='6' ry='6'/>
              <ellipse fill='#bfbfbf' cx='188' cy='141' rx='6' ry='6'/>
              <ellipse fill='#bfbfbf' cx='322.5' cy='141' rx='6' ry='6'/>
            </g>
          </g>
        </svg>
      </div>
    )
  }
});

module.exports = SimpleTimeline;

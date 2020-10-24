import React, { Component } from 'react';
import Chart from "react-apexcharts";

class Active extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            hem: 1,
          series: [this.props.active],
            options: {
              chart: {
                height: 350,
                type: 'radialBar',
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 225,
                   hollow: {
                    margin: 0,
                    size: '72%',
                    background: '#ececec',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: '#fff',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 3,
                      blur: 10,
                      opacity: 0.2
                    }
                  },
              
                  dataLabels: {
                    show: true,
                    name: {
                      offsetY: -10,
                      show: true,
                      color: '#888',
                      fontSize: '15px'
                    },
                    value: {
                      formatter: function(val) {
                        return parseInt(val);
                      },
                      color: '#111',
                      fontSize: '32px',
                      show: true,
                    }
                  }
                }
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  type: 'horizontal',
                  shadeIntensity: 0.5,
                  gradientToColors: ['#e056fd'],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
              stroke: {
                lineCap: 'round'
              },
              labels: ['Percent'],
            }
        }
    }

    render() {
        var test = [this.props.active];
        return (
            <div>
                <div className="col-md-4">
                    <div className="mixed-chart">
                        <Chart
                        options={this.state.options}
                        series={test}
                        type="radialBar"
                        width="200"
                        />
                    </div>
                </div>
            </div>     
        );
    }
}

export default Active;

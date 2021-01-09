import React, { Component } from 'react';
import Chart from "react-apexcharts";

class UpdateWaqf extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
          series: [44, 55, 13, 43, 22],
          options: {
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Education', 'Foster', 'Humanitarian', 'Welfare', 'Medical'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
        };
      }

    
    render() {
      
      var one = [this.props.ed, this.props.fo, this.props.wa, this.props.we, this.props.me];
        return (
            <div>
                <div className="col-md-12">
                    <div className="" id="chart">
                        <Chart
                        options={this.state.options}
                        series={one}
                        type="pie"
                        width="380"
                        />
                    </div>
                </div>
            </div>     
        );
    }
}

export default UpdateWaqf;

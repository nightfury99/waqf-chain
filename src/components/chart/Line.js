import React, { Component } from 'react';
import ReactApexChart from "react-apexcharts";

class Line extends Component {  
    constructor(props) {
        super(props);
        this.state = {
          
            series: [{
                name: "Desktops",
                data: [10, 41, 35, 51, 49, 62, 34, 91, 77]
            }],
            options: {
              chart: {
                height: 350,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'straight'
              },
              title: {
                text: 'Transaction Trends by Month',
                align: 'left'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              }
            },
        };
    }

    render() {
        var test = [this.props.active];
        return (
            <div>
                <div className="col-md-12">
                    <div className="" id="chart">
                        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={259} />
                    </div>
                </div>
            </div>     
        );
    }
}

export default Line;

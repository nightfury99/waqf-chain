import React, { Component } from 'react';
import ReactApexChart from "react-apexcharts";


class Line extends Component {  
    constructor(props) {
        super(props);
        this.state = {
          
            series: [{
                name: "waqf ",
                data: [3, 5, 15, 3, 24, 20, 33, 11, parseInt(this.props.totalTransaction)]
            }],
            options: {
              chart: {
                height: 250,
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
                categories: ['Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dis', 'Jan', 'Feb'],
              }
            },
        };
    }

    render() {
        // var test = [this.props.active];
        var two = [{
          name: "waqf transaction",
          data: [10, 41, 35, 51, 49, 62, 34, 91, parseInt(this.props.totalTransaction)]
        }];
        console.log(two);
        return (
            <div>
                <div className="col-md-12">
                    <div className="" id="chart">
                        <ReactApexChart options={this.state.options} series={two} type="line" height={259} />
                    </div>
                </div>
            </div>     
        );
    }
}

export default Line;

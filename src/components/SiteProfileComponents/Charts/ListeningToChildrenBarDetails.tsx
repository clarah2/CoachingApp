import * as React from "react";
import * as PropTypes from "prop-types";
import { HorizontalBar, Bar } from "react-chartjs-2";
import * as Constants from "../../constants/Constants";

import {withStyles} from '@material-ui/core'
import { round } from "./../../Shared/Math"

/**
 * Horizontal Bar Graph for Listening to Children Behaviors
 * @class ListeningToChildrenBarDetails
 * @return {void}
 */
class ListeningToChildrenBarDetails extends React.Component<Props, {}> {
  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);
    this.state = {
      teacherNames: [],
      chartTitle: "",
      barColors: [],
      averageLineWrapStyle: {
          display:'flex',
          alignItems:'center',
          justifyContent:'flex-start',
          marginBottom: 8,
          height: '20px',
          width: '96%',
          position: 'absolute',
          left: '95px',
          top: '36px',
      },
      dataSets: []
    }
  }

  // What to do when the data is recieved
  componentDidUpdate(nextProps) {
    const { data, type } = this.props

    if (nextProps.data !== data || nextProps.type !== type) {
      this.setData();
    }
  }

  componentDidMount = () => {
    this.setData();
  }

  setData = () => {
    const { data, type } = this.props


    var teacherNames = [];
    var graphData = {};

    let for_sorting = [];
    var noBehaviorsAverage = [];
    var listeningAverage = [];
    let noBehaviorsTotal = 0;
    let listeningTotal = 0;
    let numberOfTeachersWithData = 0;
    for(var teacherIndex in data)
    {

      // Create Names to display as labels
      var teacher = data[teacherIndex];
      // teacherNames.push(teacher.name);

      // We only need the name for the site Average Bar. We'll take care of the data after this loop.
      if(teacher.name === "Site Average" || teacher.name === undefined)
      {
        continue;
      }

      let result = round([teacher['noBehaviorsAverage'], teacher['encouragingAverage']])

      // let tempNoBehavior = Math.round((teacher['noBehaviorsAverage']));
      // let tempListening = Math.round(( ( 100 - teacher['noBehaviorsAverage'] ) + Number.EPSILON) * 100) / 100;
      let tempNoBehavior = result[0];
      let tempListening = result[1];

      // We need to make sure this teacher has actually done an observation. If not we want to just push a zero so it doesn't show as 100% Listening.
      if(teacher['totalObserved'] > 0)
      {
        for_sorting.push([teacher.name, tempNoBehavior, tempListening])

        // noBehaviorsAverage.push(tempNoBehavior);
        // listeningAverage.push(tempListening);

        // To calculate the site bar
        noBehaviorsTotal += tempNoBehavior;
        listeningTotal += tempListening;

        numberOfTeachersWithData++;
      }
      else
      {
      for_sorting.push([teacher.name, 0, 0])

        // noBehaviorsAverage.push(0);
        // listeningAverage.push(0);
      }

    }

    for_sorting.sort((a,b) => (b[0].split(' ')[1].charAt(0) < a[0].split(' ')[1].charAt(0)) ? 1 : ((a[0].split(' ')[1].charAt(0) < b[0].split(' ')[1].charAt(0)) ? -1 : 0))
    for (let index = 0; index < for_sorting.length; index++) {
      teacherNames.push(for_sorting[index][0])
      noBehaviorsAverage.push(for_sorting[index][1])
      listeningAverage.push(for_sorting[index][2])
    }

    teacherNames.push("Site Average")


    // We need to set the site average data
    // NOTE: I couldn't find a way to  modify style of just the 'Site Averages' bar so I'm setting the data to an array of all 0's except the last item in the array will hold the site average data
    var dataSize = Object.keys(data).length;

    let siteResult = round([data.siteBar.noBehaviorsAverage, data.siteBar.encouragingAverage])

    var siteAverageNoBehaviors = new Array(dataSize).fill(0);
    siteAverageNoBehaviors[dataSize - 1] = siteResult[0];

    var siteAverageListening = new Array(dataSize).fill(0);
    siteAverageListening[dataSize - 1] = siteResult[1];

    // Add site average to the list of names
    // teacherNames.push("Site Average");

    // Use that data to create our dataset
    var dataSets = [
      {
        label: 'Listening/Encouraging',
        data: listeningAverage,
        backgroundColor: "#07DFBB",
      },
      {
        label: 'No target Behaviors Observed',
        data: noBehaviorsAverage,
        backgroundColor: "#E20000",
      },

      // The total Site Averages
      {
        label: 'Listening/Encouraging Site Average',
        data: siteAverageListening,
        backgroundColor: "#FFF",
        borderColor: "#07DFBB",
        borderWidth: 4,
      },
      {
        label: 'No target Behaviors Observed Site Average',
        data: siteAverageNoBehaviors,
        backgroundColor: "#FFF",
        borderColor: "#E20000",
        borderWidth: 4,
      },

    ]

    this.setState({teacherNames: teacherNames, dataSets: dataSets, barColors: this.props.barColors});

  }


  randomRgbColor() {
    return "rgba(" + this.randomInteger(255) + ", " + this.randomInteger(255) + ", " + this.randomInteger(255) + ")";
  }

  randomInteger(max) {
      return Math.floor(Math.random()*(max + 1));
  }


  /**
   * render function
   * @return {ReactNode}
   */
  render(): React.ReactNode {
    const isCompleted = this.props.completed;
    const childBehaviorsData = {
      labels: this.state.teacherNames,
      datasets: this.state.dataSets
    };

    // Adds some space between the legend
    const plugin = {
      beforeInit(chart) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;

        // Override the fit function
        chart.legend.fit = function fit() {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Change the height as suggested in another answers
          this.height += 30;
        };
      }
    };

    let width = 300 + this.state.teacherNames.length * 160
    let loadLegend = this.props.loadLegend;
    return (
<div style={{padding: '30px 30px 0px 30px', marginTop: '30px', overflowX: 'scroll', maxHeight: '440px', overflowY: 'hidden', maxWidth: '70vw',}}>
        <h2 style={{width: '100%', textAlign: 'center', position: 'absolute', top: '0'}}>Listening to Children</h2>
        <div className={"realChart line-chart"} style={{height: 500, width: width}}>
          <Bar
            data={childBehaviorsData}
            options={{
              animation: {
                onComplete: function(chart): void {
                  //isCompleted ? isCompleted() : null

                  // Set the chart legend to appear below graph
                  loadLegend(chart);
                }
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      display:true,
                      min: 0,
                      max: 100,
                      stepSize: 10,
                      fixedStepSize: 1,
                      fontSize: 16,
                      fontColor: 'black',
                      padding: 20,
                      // Include a percent sign in the ticks
                      callback: function(value, index, values) {
                          return value + '%';
                      },
                    },
                    scaleLabel: {
                      display: false,
                      labelString: '',
                      fontSize: 16,
                      fontColor: 'black'
                    },
                    stacked: true,
                    gridLines: {
                      drawBorder: false,
                      drawTicks: false,
                    }
                  }
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 16,
                      fontColor: 'black',
                      callback: (value, index, values) => {
                        return value
                      }
                    },
                    stacked: true,
                    gridLines: {
                      display: false,
                      color: "rgba(0,0,0,0)",
                    }
                  }
                ]
              },
              legend: {
                display: true,
                labels: {
                  filter: function(legendItem, data) {
                        return !legendItem.text.includes('Site Average')
                  },
                  padding: 20,
                  boxWidth: 12,
                },
                position: 'bottom',
              },
              title: {
                display: this.props.title,
                text: this.state.chartTitle,
                fontSize: 14,
                fontColor: 'black',
                fontFamily: 'Arimo',
                fontStyle: "bold"
              },
              plugins: {
                datalabels: {
                  display: 'auto',
                  color: 'black',
                  font: {
                    size: 14,
                    weight: '400'
                  },
                  formatter: function(value: number): number | null {
                    if (value > 0) {
                      return value + "%";
                    } else {
                      return null;
                    }
                  }
                },

              },
              maintainAspectRatio: false
            }}
            plugins={[plugin]}
          />
        </div>
      </div>
    );
  }
}


export default ListeningToChildrenBarDetails;

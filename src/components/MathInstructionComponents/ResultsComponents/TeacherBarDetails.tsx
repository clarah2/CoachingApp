import * as React from "react";
import * as PropTypes from "prop-types";
import { HorizontalBar } from "react-chartjs-2";
import * as Constants from "../../../constants/Constants";

interface Props {
  teacher1: number,
  teacher2: number,
  teacher3: number,
  teacher4: number,
  totalVisits: number,
  completed?(): void,
  title?: boolean
}

/**
 * Horizontal Bar Chart for Math Teacher Behaviors
 * @class TeacherBarDetails
 * @return {void}
 */
class TeacherBarDetails extends React.Component<Props, {}> {
  /**
   * @param {Props} props 
   */
  constructor(props: Props) {
    super(props);
  }

  static propTypes = {
    teacher1: PropTypes.number.isRequired,
    teacher2: PropTypes.number.isRequired,
    teacher3: PropTypes.number.isRequired,
    teacher4: PropTypes.number.isRequired,
    totalVisits: PropTypes.number.isRequired,
    completed: PropTypes.func,
    title: PropTypes.bool
  };

  /**
   * render function
   * @return {ReactNode}
   */
  render(): React.ReactNode {
    const isCompleted = this.props.completed;
    const teacherBehaviorsData = {
      labels: [
        "Using math vocabulary",
        ["Asking questions about", "math concepts"],
        "Demonstrating math concepts",
        ["Helping children use math", "to problem solve"],
      ],
      datasets: [
        {
          data: [this.props.teacher1, this.props.teacher2, this.props.teacher3, this.props.teacher4],
          backgroundColor: [Constants.Colors.AppBar, Constants.Colors.AppBar, Constants.Colors.AppBar, Constants.Colors.AppBar],
          hoverBackgroundColor: [Constants.Colors.AppBar, Constants.Colors.AppBar, Constants.Colors.AppBar, Constants.Colors.AppBar]
        }
      ]
    };

    return (
      <HorizontalBar
        data={teacherBehaviorsData}
        options={{
          animation: {
            onComplete: function(): void {
              isCompleted ? isCompleted() : null
            }
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0,
                  max: this.props.totalVisits,
                  stepSize: 1,
                  fixedStepSize: 1,
                  fontSize: 16,
                  fontColor: 'black'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Number of Times Observed',
                  fontSize: 16,
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontSize: 16,
                  fontColor: 'black',
                }
              }
            ]
          },
          legend: {
            display: false
          },
          title: {
            display: this.props.title,
            text: "Teacher Details",
            fontSize: 20,
            fontColor: 'black',
            fontFamily: 'Arimo',
            fontStyle: "bold"
          },
          plugins: {
            datalabels: {
              display: 'auto',
              color: 'white',
              font: {
                size: 16,
                weight: 'bold'
              },
              formatter: function(value: number): number | null {
                if (value > 0) {
                  return value;
                } else {
                  return null;
                }
              }
            }
          },
          maintainAspectRatio: false
        }}
      />
    );
  }
}

export default TeacherBarDetails;
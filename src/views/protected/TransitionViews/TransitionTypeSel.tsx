import * as React from "react";
import * as PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ChildWaitingImage from "../../../assets/images/ChildWaitingImage.svg";
import WaitingInLineImage from "../../../assets/images/WaitingInLineImage.svg";
import WalkingImage from "../../../assets/images/WalkingImage.svg";
import ClassroomRoutinesImage from "../../../assets/images/ClassroomRoutinesImage.svg";
import BMDImage from "../../../assets/images/BMDImage.svg";
import OtherImage from "../../../assets/images/OtherImage.svg";
import * as Constants from '../../../constants/Constants';

const styles: object = {
  button: {
    margin: '0.5em',
    width: 130,
    height: 130,
    textAlign: "center"
  },
  label: {
    flexDirection: "column ",
    textAlign: "center"
  }
};

const LineTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.lineColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.lineColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

const TravelingTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.travelingColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.travelingColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

const WaitingTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.waitingColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.waitingColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

const RoutinesTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.routinesColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.routinesColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

const BehaviorManagementTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.behaviorManagementColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.behaviorManagementColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

const OtherTheme = createMuiTheme({
  palette: {
    primary: {
      main: Constants.TransitionTypeColors.otherColor
    },
    action: {
      disabledBackground: Constants.UnselectedTransitionTypeColors.otherColor
    }
  },
  typography: {
    useNextVariants: true
  }
});

interface Props {
  classes: {
    button: string,
    label: string
  },
  handleNotes(open: boolean): void,
  handleTransitionType(type: string | null): void,
  transitionType: string | null,
}

/**
 * transition type buttons
 * @param {Props} props
 * @return {ReactElement}
 */
function TransitionTypeSel(props: Props): React.ReactElement {
  const { classes, handleNotes, handleTransitionType, transitionType } = props;

  /**
   * @param {string} type
   */
  const handleButtonChange = (type: string): void => {
    if (transitionType === type) {
      handleTransitionType(null);
    } else {
      handleTransitionType(type);
      if (type === "other") {
        handleNotes(true);
      }
    }
  };

  return (
    <div>
      <Grid container alignItems="flex-start" direction={"row"} style={{fontFamily: 'Arimo'}}>
        <Grid
          item
          xs={6}
          alignItems="center"
          justify="center"
          direction="column"
        >
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={LineTheme}>
                <Button
                  onClick={(): void => handleButtonChange("waiting")}
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType!==null) && (transitionType!=="waiting")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "waiting" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img
                    alt="Waiting in line"
                    src={WaitingInLineImage}
                    height="100"
                    width="100"
                  />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign:"center"}}>
                Waiting in line/
              </div>
              <div style={{textAlign:"center"}}>
                lining up
              </div>
            </Grid>
          </Grid>
          <br></br>
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={TravelingTheme}>
                <Button
                  onClick={(): void => handleButtonChange("traveling")}
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType!==null) && (transitionType!=="traveling")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "traveling" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img
                    alt="Walking"
                    src={WalkingImage}
                    height="100"
                    width="100"
                  />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign: "center"}}>
                Traveling outside
              </div>
              <div style={{textAlign: "center"}}>
                the classroom
              </div>
            </Grid>
          </Grid>
          <br></br>
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={WaitingTheme}>
                <Button
                  onClick={(): void => handleButtonChange("child waiting")}
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType!==null) && (transitionType!=="child waiting")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "child waiting" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img
                    alt="Child waiting"
                    src={ChildWaitingImage}
                    height="100"
                    width="100"
                  />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign: "center"}}>
                Children waiting on teacher/materials
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={6}
          alignItems="center"
          justify="center"
          direction="column"
        >
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={RoutinesTheme}>
                <Button
                  onClick={(): void => handleButtonChange("classroom routines")}
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType!==null) && (transitionType!=="classroom routines")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "classroom routines" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img
                    alt="classroom routines"
                    src={ClassroomRoutinesImage}
                    height="100"
                    width="100"
                  />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign: "center"}}>
                Classroom routines
              </div>
            </Grid>
          </Grid>
          <br></br>
          <br></br>
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={BehaviorManagementTheme}>
                <Button
                  onClick={(): void =>
                    handleButtonChange("behavior management disruption")
                  }
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType !== null) && (transitionType!=="behavior management disruption")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "behavior management disruption" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img
                    alt="Behavior Management Disruption"
                    src={BMDImage}
                    height="100"
                    width="100"
                  />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign: "center"}}>
                Behavior management
              </div>
              <div style={{textAlign: "center"}}>
                disruption
              </div>
            </Grid>
          </Grid>
          <br></br>
          <Grid item>
            <Grid container direction="row" alignItems="flex-start" justify="center">
              <MuiThemeProvider theme={OtherTheme}>
                <Button
                  onClick={(): void => handleButtonChange("other")}
                  classes={{ root: classes.button, label: classes.label }}
                  variant="raised"
                  disabled={(transitionType !== null) && (transitionType!=="other")}
                  color="primary"
                  style={{
                    color: 'white',
                    boxShadow: transitionType === "other" ? "8px 8px #a9a9a9" : null
                  }}
                >
                  <img alt="other" src={OtherImage} height="100" width="100" />
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="flex-start">
              <div style={{textAlign: "center"}}>
                Other
              </div>
            </Grid>
          </Grid>
          <br></br>
        </Grid>
      </Grid>
    </div>
  );
}

TransitionTypeSel.propTypes = {
  classes: PropTypes.object.isRequired,
  transitionType: PropTypes.string.isRequired,
  handleTransitionType: PropTypes.func.isRequired,
  handleNotes: PropTypes.func.isRequired
};

export default withStyles(styles)(TransitionTypeSel);
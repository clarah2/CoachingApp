import * as React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as Constants from '../../../constants/Constants';

interface ReduxState {
  associativeCenterState: {
    associativeCenters: Array<{
      name: string,
      count: number
    }>
  },
  associativeCountState: {
    acCount: number,
    noACCount: number,
    noOppCount: number
  },
  climateRatingsState: {
    climateRatings: Array<{
      timestamp: number,
      rating: number
    }>
  },
  climateStackState: {
    climateStack: Array<{
      observation: string,
      timestamp: number
    }>
  },
  coachState: {
    coachName: string
  },
  engagementCountState: {
    engagedCount: number,
    notEngagedCount: number
  },
  instructionStackState: {
    instructionStack: Array<{
      timestamp: number,
      observation: string
    }>
  },
  listeningCountState: {
    listeningCount: number,
    noListeningCount: number
  },
  mathCountState: {
    mathCount: number,
    noMathCount: number
  },
  mathCentersState: {
    mathCenters: Array<{
      name: string,
      count: number
    }>
  },
  sequentialCenterState: {
    sequentialCenters: Array<{
      name: string,
      count: number
    }>
  },
  sequentialCountState: {
    noSequentialCount: number,
    sequentialCount: number
  },
  sessionTimeState: {
    endTime: number,
    startTime: number
  },
  teacherListState: {
    teachers: Array<Teacher>
  },
  teacherSelectedState: {
    teacher: Teacher
  },
  transitionLogState: {
    transitionStack: Array<{
      duration: string,
      end: string,
      start: string,
      transitionType: string
    }>
  },
  transitionTimeState: {
    transitionTime: number
  },
  transitionTypeState: {
    transitionType: string
  }
}

interface Teacher {
  email: string,
  firstName: string,
  lastName: string,
  notes: string,
  id: string,
  phone: string,
  role: string,
  school: string
}

interface TransitionEntry {
  duration: string,
  end: string,
  start: string,
  transitionType: string
}

interface Props {
  classes: { root: string },
  entries: Array<TransitionEntry>
}

const styles: object = {
  root: {
    margin: '1em',
    paddingRight: '1em',
    paddingLeft: '1em',
    paddingBottom: '1em'
  }
};

const getHexFromType = (type: string): string => {
  switch (type) {
    case "waiting":
      return Constants.TransitionTypeColors.lineColor;
    case "traveling":
      return Constants.TransitionTypeColors.travelingColor;
    case "child waiting":
      return Constants.TransitionTypeColors.waitingColor;
    case "classroom routines":
      return Constants.TransitionTypeColors.routinesColor;
    case "behavior management disruption":
      return Constants.TransitionTypeColors.behaviorManagementColor;
    case "other":
      return Constants.TransitionTypeColors.otherColor;
  }
}

/**
 * @param {Props} props 
 * @return {ReactElement}
 */
function TransitionLog(props: Props): React.ReactElement {
  const {classes, entries} = props;
  return (
    <div>
      <Paper className={classes.root} elevation={0}>
        <Typography variant="h6" component="h3" align="center" style={{fontFamily: 'Arimo'}}>
          Recent Transitions
        </Typography>
        <Divider />
        <div
          style={{
            height: "22vh",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "auto"
          }}
        >
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: 'Arimo'
            }}
          >
            {entries.map((entry, index) => (
              <React.Fragment key={index}>
                <Divider />
                <ListItem
                  style={{
                    backgroundColor: getHexFromType(entry.transitionType),
                    color: 'white'
                  }}
                >
                  {new Date(entry.end).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric"
                  })}
                  <br />
                  {entry.duration}
                  <br />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </div>
      </Paper>
    </div>
  );
};

TransitionLog.propTypes = {
  classes: PropTypes.exact({
    root: PropTypes.string
  }).isRequired,
  entries: PropTypes.array.isRequired
};

const mapStateToProps = (state: ReduxState): {entries: Array<{
  duration: string,
  end: string,
  start: string,
  transitionType: string
}>} => {
  return {
    entries: state.transitionLogState.transitionStack
  };
};

export default withStyles(styles)(connect(mapStateToProps)(TransitionLog));
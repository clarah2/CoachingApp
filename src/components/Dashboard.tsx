import * as React from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Grid, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import TransitionTimeIconImage from "../assets/images/TransitionTimeIconImage.svg";
import ClassroomClimateIconImage from "../assets/images/ClassroomClimateIconImage.svg";
import MathIconImage from "../assets/images/MathIconImage.svg";
import EngagementIconImage from "../assets/images/EngagementIconImage.svg";
import InstructionIconImage from "../assets/images/InstructionIconImage.svg";
import ListeningIconImage from "../assets/images/ListeningIconImage.svg";
import SequentialIconImage from "../assets/images/SequentialIconImage.svg";
import AssocCoopIconImage from "../assets/images/AssocCoopIconImage.svg";
import TransitionTimeNotesImage from "../assets/images/TransitionTimeNotesImage.svg";
import ClassroomClimateNotesImage from "../assets/images/ClassroomClimateNotesImage.svg";
import MathInstructionNotesImage from "../assets/images/MathInstructionNotesImage.svg";
import EngagementNotesImage from "../assets/images/EngagementNotesImage.svg";
import InstructionNotesImage from "../assets/images/InstructionNotesImage.svg";
import ListeningNotesImage from "../assets/images/ListeningNotesImage.svg";
import SequentialNotesImage from "../assets/images/SequentialNotesImage.svg";
import AssocCoopNotesImage from "../assets/images/AssocCoopNotesImage.svg";
import TransitionTimeLookForsImage from "../assets/images/TransitionTimeLookForsImage.svg";
import ClassroomClimateLookForsImage from "../assets/images/ClassroomClimateLookForsImage.svg";
import MathInstructionLookForsImage from "../assets/images/MathInstructionLookForsImage.svg";
import EngagementLookForsImage from "../assets/images/EngagementLookForsImage.svg";
import InstructionLookForsImage from "../assets/images/InstructionLookForsImage.svg";
import ListeningLookForsImage from "../assets/images/ListeningLookForsImage.svg";
import SequentialLookForsImage from "../assets/images/SequentialLookForsImage.svg";
import AssocCoopLookForsImage from "../assets/images/AssocCoopLookForsImage.svg";
import Notes from "./Notes";
import FirebaseContext from "./Firebase/FirebaseContext";
import { ClickAwayListener } from "@material-ui/core/es";
import TransitionTimeHelp from "../views/protected/TransitionViews/TransitionTimeHelp";
import ClassroomClimateHelp from "./ClassroomClimateComponent/ClassroomClimateHelp";
import MathInstructionHelp from './MathInstructionComponents/MathInstructionHelp';
import AssocCoopHelp from "../views/protected/AssociativeCooperativeViews/AssocCoopHelp";
import SequentialActivitiesHelp from './SequentialActivitiesComponents/SequentialActivitiesHelp';
import LevelOfInstructionHelp from "../views/protected/LevelOfInstructionViews/LevelOfInstructionHelp";
import ListeningToChildrenHelp from './ListeningComponents/ListeningToChildrenHelp';
import YesNoDialog from "./Shared/YesNoDialog";
import { updateSessionTime } from "../state/actions/transition-time";
import { connect } from "react-redux";
import IncompleteObservation from "./IncompleteObservation";
import StudentEngagementHelp from './StudentEngagementComponents/StudentEngagementHelp'
import * as Constants from '../constants/Constants';
import TransitionResultsDialog from './TransitionComponents/TransitionResultsDialog';
import ClimateResultsDialog from './ClassroomClimateComponent/ClimateResultsDialog';
import MathResultsDialog from './MathInstructionComponents/MathResultsDialog';
import EngagementResultsDialog from './StudentEngagementComponents/EngagementResultsDialog';
import InstructionResultsDialog from './LevelOfInstructionComponents/InstructionResultsDialog';
import ListeningResultsDialog from './ListeningComponents/ListeningResultsDialog';
import SequentialResultsDialog from './SequentialActivitiesComponents/SequentialResultsDialog';
import ACResultsDialog from './AssociativeCooperativeComponents/ACResultsDialog';

const styles = {
  card: {
    border: "3px solid #d9d9d9",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: "100%",
    boxShadow: "5px",
    width: "90%",
    marginRight: "5%",
    marginLeft: "5%",
    alignItems: "center",
    justify: "space-evenly",
    display: "flex",
  },
  iconGrid: {
    marginTop: "10px",
    marginBottom: "5px"
  },
  icon: {
    width: "100px",
    height: "100px"
  },
  infoDisplayGrid: {
    height: "34vh",
    width: "90%",
    marginLeft: "5px",
    marginRight: "5px",
    display: "flex",
    justifyItems: "center"
  },
  helpIcon: {
    width: "60px"
  },
  completeGrid: {
    marginTop: "5px",
    marginBottom: "10px",
    marginLeft: "10px",
    marginRight: "10px",
    alignContent: "flex-end",
    display: "flex"
  },
  completeButton: {
    color: "#d9d9d9",
    borderColor: "#d9d9d9",
    borderWidth: "2px",
    fontSize: "15px",
    alignSelf: "flex-end",
    fontFamily: "Arimo",
    margin: 10
  },
  gridTopMargin: {
    marginTop: "5px",
    fontFamily: "Arimo"
  }
};

interface Style {
  card: string,
  iconGrid: string,
  icon: string,
  infoDisplayGrid: string,
  helpIcon: string,
  completeGrid: string,
  completeButton: string,
  gridTopMargin: string
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
};

interface Props {
  classes: Style,
  type: keyof typeof Constants.Colors,
  history: {
    push(pathname: string): void
  },
  teacherSelected: Teacher,
  infoPlacement: string,
  infoDisplay: React.ReactElement,
  completeObservation: boolean,
  updateSessionTime(time: number): void
}

interface State {
  notes: boolean,
  help: boolean,
  auth: boolean,
  time: string,
  alignFormat: string,
  incomplete: boolean,
  icon: string,
  lookForsIcon: string,
  notesIcon: string,
  title: string,
  resultsDialog: string
}

/**
 * Dashboard for Observation Tools
 * @class Dashboard
 */
class Dashboard extends React.Component<Props, State> {
  typeString: string = this.props.type;
  /**
   * @param {Props} props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      notes: false,
      help: false,
      auth: true,
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      }),
      alignFormat: "center",
      incomplete: false,
      icon: null,
      lookForsIcon: null,
      notesIcon: null,
      title: '',
      resultsDialog: null
    };
  }

  /** lifecycle method invoked after component mounts */
  componentDidMount(): void {
    this.typeString === "TT"
      ? this.setState({
          icon: TransitionTimeIconImage,
          lookForsIcon: TransitionTimeLookForsImage,
          notesIcon: TransitionTimeNotesImage,
          title: 'Transition Time'
        })
      : this.typeString === "CC"
      ? this.setState({
          icon: ClassroomClimateIconImage,
          lookForsIcon: ClassroomClimateLookForsImage,
          notesIcon: ClassroomClimateNotesImage,
          title: 'Classroom Climate'
        })
      : this.typeString === "MI"
      ? this.setState({
          icon: MathIconImage,
          lookForsIcon: MathInstructionLookForsImage,
          notesIcon: MathInstructionNotesImage,
          title: 'Math Instruction'
        })
      : this.typeString === "SE"
      ? this.setState({
          icon: EngagementIconImage,
          lookForsIcon: EngagementLookForsImage,
          notesIcon: EngagementNotesImage,
          title: 'Student Engagement'
        })
      : this.typeString === "LI"
      ? this.setState({
          icon: InstructionIconImage,
          lookForsIcon: InstructionLookForsImage,
          notesIcon: InstructionNotesImage,
          title: 'Level of Instruction'
        })
      : this.typeString === "LC"
      ? this.setState({
          icon: ListeningIconImage,
          lookForsIcon: ListeningLookForsImage,
          notesIcon: ListeningNotesImage,
          title: 'Listening to Children'
        })
      : this.typeString === "SA"
      ? this.setState({
          icon: SequentialIconImage,
          lookForsIcon: SequentialLookForsImage,
          notesIcon: SequentialNotesImage,
          title: 'Sequential Activities'
        })
      : this.setState({
          icon: AssocCoopIconImage,
          lookForsIcon: AssocCoopLookForsImage,
          notesIcon: AssocCoopNotesImage,
          title: 'Associative and Cooperative'
        });
  };

  handleHelpModal = (): void => {
    this.setState({ help: true });
  };

  handleClickAwayHelp = (): void => {
    this.setState({ help: false });
  };

  /**
   * @param {boolean} open
   */
  handleNotes = (open?: boolean): void => {
    if (open) {
      this.setState({ notes: true });
    } else {
      this.setState({ notes: false });
    }
  };

  handleIncomplete = (): void => {
    this.setState({ incomplete: true });
  };

  handleClickAwayIncomplete = (): void => {
    this.setState({ incomplete: false });
  };

  static propTypes = {
    infoDisplay: PropTypes.object.isRequired,
    classes: PropTypes.exact({
      card: PropTypes.string,
      iconGrid: PropTypes.string,
      icon: PropTypes.string,
      infoDisplayGrid: PropTypes.string,
      helpIcon: PropTypes.string,
      completeGrid: PropTypes.string,
      completeButton: PropTypes.string,
      gridTopMargin: PropTypes.string
    }).isRequired,
    history: PropTypes.exact({
      push: PropTypes.func
    }).isRequired,
    infoPlacement: PropTypes.string.isRequired,
    completeObservation: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    updateSessionTime: PropTypes.func.isRequired,
    teacherSelected: PropTypes.exact({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      notes: PropTypes.string,
      id: PropTypes.string,
      phone: PropTypes.string,
      role: PropTypes.string,
      school: PropTypes.string
    }).isRequired,
  }

  /**
   * render function
   * @return {ReactNode}
   */
  render(): React.ReactNode {
    const { classes } = this.props;
    return (
      <div>
        <TransitionResultsDialog
          open={this.state.resultsDialog==="TT"}
          history={this.props.history}
        />
        <ClimateResultsDialog
          open={this.state.resultsDialog==='CC'}
          history={this.props.history}
        />
        <MathResultsDialog
          open={this.state.resultsDialog==="MI"}
          history={this.props.history}
        />
        <EngagementResultsDialog 
          open={this.state.resultsDialog==="SE"} 
          history={this.props.history}
        />
        <InstructionResultsDialog
          open={this.state.resultsDialog==="LI"}
          history={this.props.history}
        />
        <ListeningResultsDialog
          open={this.state.resultsDialog==="LC"}
          history={this.props.history}
        />
        <SequentialResultsDialog
          open={this.state.resultsDialog==="SA"}
          history={this.props.history}
        />
        <ACResultsDialog
          open={this.state.resultsDialog==="AC"}
          history={this.props.history}
        />
        {this.state.help ? (
          this.typeString === "TT" ?
            <TransitionTimeHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "CC" ?
            <ClassroomClimateHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "MI" ?
            <MathInstructionHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "SE" ?
            <StudentEngagementHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "AC" ?
            <AssocCoopHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "SA" ?
            <SequentialActivitiesHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "LI" ?
            <LevelOfInstructionHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : this.typeString === "LC" ?
            <ListeningToChildrenHelp open={this.state.help} close={this.handleClickAwayHelp} />
          : <div />
        ) : this.state.notes ? (
          <FirebaseContext.Consumer>
            {(firebase: object): React.ReactNode => (
              <Notes
                open={true}
                onClose={this.handleNotes}
                color={Constants.Colors[this.props.type]}
                text={this.state.title + " Notes"}
                firebase={firebase}
              />
            )}
          </FirebaseContext.Consumer>
        ) : this.state.incomplete ? (
          <ClickAwayListener onClickAway={this.handleClickAwayIncomplete}>
            <IncompleteObservation />
          </ClickAwayListener>
        ) : (
          <div />
        )}
        <Card className={classes.card}>
          <Grid
            container
            style={{display: 'flex', flex: 1, flexDirection: 'column'}}
            spacing={0}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item className={classes.iconGrid}>
              <img
                src={this.state.icon}
                alt="Magic 8 Icon"
                className={classes.icon}
              />
            </Grid>
            <Grid item>
              <Typography style={{fontFamily: 'Arimo'}}>
                {this.props.teacherSelected.firstName} {this.props.teacherSelected.lastName}
              </Typography>
            </Grid>
            <Grid
              item
              className={classes.infoDisplayGrid}
              style={{ alignItems: this.props.infoPlacement }}
            >
              {this.props.infoDisplay}
            </Grid>
            <Grid
              container
              className={classes.gridTopMargin}
              direction="row"
              spacing={16}
              alignItems="center"
              alignContent="center"
              justify="center"
            >
              <Button className="lookFor" onClick={this.handleHelpModal}>
                <img
                  src={this.state.lookForsIcon}
                  alt="Look-Fors"
                  className={classes.helpIcon}
                />
              </Button>
              <Button className="notes" onClick={(): void => this.handleNotes(true)}>
                <img
                  src={this.state.notesIcon}
                  alt="Notes"
                  className={classes.helpIcon}
                />
              </Button>
            </Grid>
            <Grid item className={classes.gridTopMargin}>
              Start Time: {this.state.time}
            </Grid>
            {this.props.completeObservation ? (
              <Grid item className={classes.completeGrid}>
                <FirebaseContext.Consumer>
                  {(firebase: {
                    endSession(time?: Date): void
                  }): React.ReactNode => (
                    <YesNoDialog
                      buttonText={<b>COMPLETE OBSERVATION</b>}
                      buttonVariant={"outlined"}
                      buttonColor={Constants.Colors[this.props.type]}
                      buttonMargin={10}
                      dialogTitle={
                        "Are you sure you want to complete this observation?"
                      }
                      shouldOpen={true}
                      onAccept={(): void => {
                        this.setState({resultsDialog: this.props.type});
                        if (this.props.type === "TT") {
                          const sessionEnd = Date.now();
                          this.props.updateSessionTime(sessionEnd);
                          firebase.endSession(new Date(sessionEnd));
                        } else {
                          firebase.endSession();
                        }
                      }}
                    />
                  )}
                </FirebaseContext.Consumer>
              </Grid>
            ) : (
              <Grid item className={classes.completeGrid}>
                <Button
                  variant="outlined"
                  onClick={this.handleIncomplete}
                  className={classes.completeButton}
                >
                  <b>COMPLETE OBSERVATION</b>
                </Button>
              </Grid>
            )}
          </Grid>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    teacherSelected: state.teacherSelectedState.teacher
  }
}

export default withRouter(connect(
    mapStateToProps,
    { updateSessionTime }
)(withStyles(styles)(Dashboard)));
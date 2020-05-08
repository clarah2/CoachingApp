import React from "react";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import AppBar from "../../../components/AppBar";
import FirebaseContext from "../../../components/Firebase/FirebaseContext";
import CenterMenuStudentEngagement from "../../../components/StudentEngagementComponents/CenterMenuStudentEngagement";
import { connect } from "react-redux";
import {
    appendClimateRating,
    emptyClimateStack
} from "../../../state/actions/classroom-climate";
import Dashboard from "../../../components/Dashboard";
import Countdown from "../../../components/Countdown.tsx";

/*
    N.B. Time measured in milliseconds.

    Rationale for the 2:10 interval -
    Give coaches ~10 seconds to make and confirm their rating,
    catch up on behavior approval/disapproval count if they need to,
    and then allow for 2 full minutes in between ratings.
 */

const RATING_INTERVAL = 5000;

const styles: object = {
    root: {
        flexGrow: 1,
        backgroundColor: "#ffffff",
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column"
    },
    grow: {
        flexGrow: 0
    }
};

/**
 * classroom climate observation tool
 * @class ClassroomClimatePage
 */
class StudentEngagementPage extends React.Component {
    state = {
        auth: true,
        time: RATING_INTERVAL,
        recs: true,
        completeEnabled: false,
    };

    tick = () => {
        if (this.state.time <= 0) {
            this.setState({ time: 0 });
        } else {
            if (this.state.time - 1000 < 0) {
                this.setState({ time: 0 });
            } else {
                this.setState({ time: this.state.time - 1000 });
            }
        }
    };

    handleClickAway = () => {
        this.setState({ help: false });
    };

    handleTimerReset = ()=>{
        this.setState({ time: RATING_INTERVAL });
        clearInterval(this.timer);
    }

    /**
     * @param {boolean} enable
     */
    handleCompleteButton = (enable: boolean) => {
        this.setState({ completeEnabled: enable });
    };

    handleTimerStart = () =>{
        this.timer = setInterval(this.tick, 1000);
    }

    /**
     * render function
     * @return {ReactElement}
     */
    render() {
        return (
            <div className={this.props.classes.root}>
                <FirebaseContext.Consumer>
                    {firebase => <AppBar firebase={firebase} />}
                </FirebaseContext.Consumer>
                    <Grid
                        container
                        alignItems={"center"}
                        justify={"center"}
                        direction={"row"}
                    >
                        <Grid
                            container
                            alignItems={"flex-start"}
                            justify={"flex-start"}
                            direction={"row"}
                        >
                            <Grid item xs={3}>
                                <Grid
                                    container
                                    alignItems={"center"}
                                    justify={"center"}
                                    direction={"column"}
                                >
                                    <Dashboard
                                        magic8="Student Engagement"
                                        color="#e99b2e"
                                        infoDisplay={
                                            this.state.completeEnabled && <Countdown color="#e99b2e" timerTime={RATING_INTERVAL} time={this.state.time} />
                                        }
                                        infoPlacement="center"
                                        uploadStudentEngagement = {this.handleUploadingStudentEngagement}
                                        completeObservation={this.state.completeEnabled}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                    <FirebaseContext.Consumer>
                                        {firebase => (
                                            <CenterMenuStudentEngagement
                                                teacherId={this.props.location.state.teacher.id}
                                                firebase={firebase}
                                                onStatusChange={this.handleCompleteButton}
                                                time={this.state.time}
                                                handleTimerReset = {this.handleTimerReset}
                                                handleTimerStart = {this.handleTimerStart}
                                            />
                                        )}
                                    </FirebaseContext.Consumer>
                            </Grid>
                        </Grid>
                    </Grid>
            </div>
        );
    }
}

StudentEngagementPage.propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    appendClimateRating: PropTypes.func.isRequired
};

StudentEngagementPage.contextType = FirebaseContext;

export default connect(null, { appendClimateRating, emptyClimateStack })(
    withStyles(styles)(StudentEngagementPage)
);
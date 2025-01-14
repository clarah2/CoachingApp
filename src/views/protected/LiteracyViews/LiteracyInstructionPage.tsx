import * as React from 'react';
import * as PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from "../../../components/AppBar";
import FirebaseContext from "../../../components/Firebase/FirebaseContext";
import Checklist from '../../../components/LiteracyComponents/Checklist';
import TeacherModal from '../HomeViews/TeacherModal';
import { connect } from "react-redux";
import * as Types from '../../../constants/Types';
import Firebase from '../../../components/Firebase'
import withObservationWrapper from "../../../components/HOComponents/withObservationWrapper";
import {clearLiteracyCount} from "../../../state/actions/literacy-instruction";

interface Props {
  teacherSelected: Types.Teacher
  preBack(): Promise<boolean>
  clearLiteracyCount(): void
  forceComplete: boolean
  showLiteracyActivity: boolean
}

/**
 * @function ListeningToChildrenPage
 * @param {Props} props
 * @return {ReactElement}
 */
function LiteracyInstructionPage(props: Props): React.ReactElement {
  const { teacherSelected } = props;
  const location = useLocation();
  const [teacherModal, setTeacherModal] = useState(false);
  useEffect(() => {
    if (!teacherSelected) {
      setTeacherModal(true)
    }
  });
  useEffect(() => {
    return () => {
    props.clearLiteracyCount()
    }
  }, [])
  return (
    teacherSelected ? (
      <div>
        <FirebaseContext.Consumer>
          {(firebase: Firebase): React.ReactNode => (<AppBar confirmAction={props.preBack} firebase={firebase} />)}
        </FirebaseContext.Consumer>
        <main>
          <FirebaseContext.Consumer>
            {(firebase: Firebase): React.ReactNode => (
              <Checklist
                showLiteracyActivity={props.showLiteracyActivity}
                forceComplete={props.forceComplete}
                firebase={firebase}
                type='LI'
                checklist={location.state.checklist}
                // checklist='FoundationalTeacher'
              />
            )}
          </FirebaseContext.Consumer>
        </main>
      </div>
    ) : (
      <FirebaseContext.Consumer>
        {(firebase: Firebase): React.ReactElement => (
          <TeacherModal
            handleClose={(): void => setTeacherModal(false)}
            firebase={firebase}
            type={"Observe"}
          />
        )}
      </FirebaseContext.Consumer>
    )
  );
}

LiteracyInstructionPage.propTypes = {
  teacherSelected: PropTypes.exact({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    notes: PropTypes.string,
    id: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.string,
    school: PropTypes.string
  }).isRequired
}

const wrapperOptions = {

}

const mapStateToProps = (state: Types.ReduxState): {
  teacherSelected: Types.Teacher
} => {
  return {
    teacherSelected: state.teacherSelectedState.teacher
  };
};

export default connect(mapStateToProps, {clearLiteracyCount})(withObservationWrapper(wrapperOptions)(LiteracyInstructionPage));
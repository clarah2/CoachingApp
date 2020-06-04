import * as React from 'react';
import FirebaseContext from '../../../components/Firebase/FirebaseContext';
import AppBar from '../../../components/AppBar.js';
import Grid from '@material-ui/core/Grid';
import ConferencePlanForm from '../../../components/ConferencePlanForm';

interface Props {
  actionPlanId: string,
  location: {state: {conferencePlanId: string, teacherId: string, sessionId: string}},
  classes: {
    backButton: string
  },
  history: {
    replace(
      param: {
        pathname: string
      }
    ): void
  }
}

interface State {
  teacher: Teacher,
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

/**
 * @class ConferencePlanView
 */
class ConferencePlanView extends React.Component<Props, State>{
  /**
   * @param {Props} props
   */
  constructor(props: Props) {
    super(props);
    
    this.state={
      teacher: null
    }
  }

  /**
   * 
   */
  componentDidMount(): void {
    const firebase = this.context;
    firebase.getTeacherInfo(this.props.location.state.teacherId)
      .then((teacherInfo: {
        email: string,
        firstName: string,
        lastName: string,
        notes: string,
        id: string,
        phone: string,
        role: string,
        school: string
      }) => this.setState({teacher: teacherInfo}))
  }

  /**
   * @return {ReactNode}
   */
  render(): React.ReactNode {
    return (
      <div>
        <FirebaseContext.Consumer>
          {(firebase: object): React.ReactNode => <AppBar firebase={firebase} />}
        </FirebaseContext.Consumer>
        <main>
          <Grid direction="column" justify="center" alignItems="center" style={{paddingLeft: '3em', paddingRight: '3em', paddingTop: '1em'}}>
            <Grid item>
              <Grid container justify="center" alignItems="center" style={{width: '100%'}}>
                {this.state.teacher ? (
                  <FirebaseContext.Consumer>
                    {(firebase: object): React.ReactNode => <ConferencePlanForm 
                      firebase={firebase}
                      conferencePlanId={this.props.location.state.conferencePlanId}
                      teacher={this.state.teacher}
                      readOnly={true}
                      conferencePlanExists={true}
                      history={this.props.history}
                      sessionId={this.props.location.state.sessionId}
                    />}
                  </FirebaseContext.Consumer>
                ) : (null)}
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

ConferencePlanView.contextType = FirebaseContext;
export default ConferencePlanView;
import * as firebase from "firebase";

// Need to find a new place for this...
// ask Jules about where to put it
const config = {
  apiKey: "AIzaSyB7IUNOBelyA5-rMBSM4PtADvlvUOqe6NU",
  authDomain: "cqrefpwa.firebaseapp.com",
  databaseURL: "https://cqrefpwa.firebaseio.com",
  projectId: "cqrefpwa",
  storageBucket: "cqrefpwa.appspot.com",
  messagingSenderId: "353838544707",
  measurementId: "G-S797QZ8L3N"
};

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

interface TeacherInfo {
  firstName: string,
  lastName: string,
  school: string,
  email: string,
  phone: string,
  notes: string
}

interface UserData {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  notes: string,
  school: string,
  phone: string
}

interface Note {
  id: string,
  content: string,
  timestamp: {
    seconds: number,
    nanoseconds: number
  }
}

interface UserCredential {
  credential: {
    providerId: string,
    signInMethod: string
  },
  user: {
    uid: string
  }
}

/**
 * defines functions to get and set data in cloud firestore
 */
class Firebase {
  auth: any;
  db: any;
  functions: any;
  sessionRef: any;
  /**
   * initializes firebase
   */
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.db
        .enablePersistence({ experimentalTabSynchronization: true })
        .then(() => console.log("Woohoo! Multi-Tab Persistence!"))
        .catch((error: Error) => console.error("Offline Not Working: ", error));
      this.functions = firebase.functions();
      this.sessionRef = null;
    }
  }

  /**
   * submits pilot form to database
   * @param {object} userData 
   */
  firebasePilotSignUp = async function(userData: {
    email: string,
    firstName: string,
    lastName: string,
    program: string
  }): Promise<void> {
    const data = Object.assign(
      {},
      {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        program: userData.program
      }
    );
    const docRef = firebase.firestore().collection('pilotForm').doc();
    docRef.set(data)
      .then( () => {
        console.log("Visitor submitted pilot form");
      })
      .catch(function(error) {
        console.error("Error signing up: ", error);
      });
  };

  /**
   * submits email to database
   * @param {string} email 
   */
  emailListSignUp = async (email: string): Promise<void> => {
    this.sessionRef = this.db.collection("emailList").doc();
    this.sessionRef.set({
      email: email
    });
  };

  /**
   * creates account for user, makes entry in users collection, adds practice teacher if role===coach
   * @param {object} userData 
   * @param {string} role 
   */
  firebaseEmailSignUp = async function(
    userData: {
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      user: {
        uid: string
      }
    },
    role: string
  ): Promise<void> {
    return this.auth
      .createUserWithEmailAndPassword(userData.email, userData.password)
      .then((userInfo: UserCredential) => {
        console.log("Create user and sign in Success", userInfo);
        const data = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: role,
          id: userInfo.user.uid
        };
        const docRef = firebase
          .firestore()
          .collection("users")
          .doc(userInfo.user.uid);
        docRef
          .set(data)
          .then(() => {
            if (role === "coach") {
              docRef
                .collection("partners")
                .doc("rJxNhJmzjRZP7xg29Ko6") // Practice Teacher UID
                .set({})
                .then(() => console.log("Practice Teacher added to coach!"))
                .catch((error: Error) =>
                  console.error(
                    "Error occurred while assigning practice teacher to coach: ",
                    error
                  )
                );
            } else console.log("User properly added to Firebase!");
          })
          .catch((error: Error) => console.error("Error adding coach: ", error));
      })
      .catch((error: Error) => console.error("Error creating user signup: ", error));
  };

  /**
   * signs user in
   * @param {object} userData 
   */
  firebaseEmailSignIn = async function(userData: {
    email: string,
    password: string
  }): Promise<UserCredential> {
    return this.auth
      .signInWithEmailAndPassword(userData.email, userData.password)
      .catch((error: Error) => console.error("Error signing in: ", error));
  };

  /**
   * signs user out
   */
  firebaseSignOut = async function(): Promise<void> {
    return this.auth
      .signOut()
      .then(() => console.log("Successfully Signed Out!"))
      .catch((error: Error) => console.error("Sign Out Unsuccessful: ", error));
  };

  /**
   * sends password reset email to user-entered email
   * @param {string} email
   */
  resetPassword = async function(email: string): Promise<void> {
    return this.auth
      .sendPasswordResetEmail(email)
      .catch((error: Error) =>
        console.error("Error occurred sending password reset email: ", error)
      );
  };

  /**
   * gets list of all teachers linked to current user's account
   */
  getTeacherList = async function(): Promise<Array<Teacher>> {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .collection("partners")
      .get()
      .then((partners: Array<{id: string}>) => {
        const teacherList: Array<Teacher> = [];
        partners.forEach(partner =>
          teacherList.push(this.getTeacherInfo(partner.id))
        );
        return teacherList;
      })
      .catch((error: Error) => console.error("Error getting partner list: ", error));
  };

  /**
   * retrieves a teacher's user data
   * @param {string} partnerID
   */
  getTeacherInfo = async function(partnerID: string): Promise<UserData> {
    return this.db
      .collection("users")
      .doc(partnerID)
      .get()
      .then((doc: {exists: boolean, id: string, data(): UserData}) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("Partner's ID is 'undefined' in dB.");
        }
      })
      .catch((error: Error) =>
        console.error("Error occurred when getting document:", error)
      );
  };

  /**
   * saves edits to a teacher's user data
   * @param {string} partnerID
   * @param {object} edits
   */
  setTeacherInfo = async function(
    partnerID: string,
    edits: TeacherInfo
  ): Promise<void> {
    if (partnerID === "rJxNhJmzjRZP7xg29Ko6") {
      console.log("You can't edit the Practice Teacher!");
    } else {
      const { firstName, lastName, school, email, phone, notes } = edits;
      return this.db
        .collection("users")
        .doc(partnerID)
        .set(
          {
            firstName: firstName,
            lastName: lastName,
            school: school,
            email: email,
            phone: phone,
            notes: notes
          },
          { merge: true }
        )
        .catch((error: Error) =>
          console.error("Error occurred when writing document:", error)
        );
    }
  };

  /**
   * adds teacher to the database and to the coach's partners list
   * @param {TeacherInfo} teacherInfo
   */
  addTeacher = async function(teacherInfo: TeacherInfo): Promise<void> {
    const { firstName, lastName, school, email, notes, phone } = teacherInfo;
    const newTeacherRef = this.db.collection("users").doc(); // auto-generated iD
    return newTeacherRef
      .set({
        firstName: firstName,
        lastName: lastName,
        school: school,
        email: email,
        notes: notes,
        role: "teacher",
        id: newTeacherRef.id,
        phone: phone
      })
      .then(() => {
        const id = newTeacherRef.id; // get new iD
        return this.db
          .collection("users")
          .doc(this.auth.currentUser.uid)
          .collection("partners")
          .doc(id)
          .set({})
          .then(() => id)
          .catch((error: Error) => {
            console.error(
              "Error occurred when adding teacher to coach's partner list: ",
              error
            );
            // return "";
          });
      })
      .catch((error: Error) => {
        console.error("Error occurred when adding teacher to dB: ", error);
        // return "";
      });
  };

  /**
   * removes partner from the user's partners subcollection
   * @param {string} partnerID
   */
  removePartner = async function(partnerID: string): Promise<void> {
    if (partnerID === "rJxNhJmzjRZP7xg29Ko6") {
      console.log("You can't delete the Practice Teacher!");
    } else {
      return this.db
        .collection("users")
        .doc(this.auth.currentUser.uid)
        .collection("partners")
        .doc(partnerID)
        .delete()
        .then(() =>
          console.log("Partner successfully removed from Partners list!")
        )
        .catch((error: Error) =>
          console.error(
            "An error occurred trying to remove the teacher from" +
              " the Partners list: ",
            error
          )
        );
    }
  };

  // Gets most recent observation of each type for a teacher
  // @param:string partnerID -> iD of teacher
  // @return:Promise -> onFulfilled: returns Array of dates of most recent observations
  //                '-> onRejected: prints error to console
  // NOTE: Index specified in Firebase console in order to execute Query
  /**
   * gets most recent observation of each type for a teacher
   * @param {string} partnerID
   */
  getRecentObservations = async function(partnerID: string): Promise<Array<string> | void> {
    const obsRef = this.db
      .collection("observations")
      .where("teacher", "==", `/user/${partnerID}`)
      .where("observedBy", "==", `/user/${this.auth.currentUser.uid}`);
    // ONLY 'transition','climate', & 'AC' types specified in dB! The rest are subject to change!
    return Promise.all([
      obsRef
        .where("type", "==", "transition")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "climate")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "listening")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "level")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "math")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "engagement")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "sequential")
        .orderBy("end", "desc")
        .limit(1)
        .get(),
      obsRef
        .where("type", "==", "AC")
        .orderBy("end", "desc")
        .limit(1)
        .get()
    ])
      .then(snapshots => {
        const recentObs = new Array(8).fill(null);
        snapshots.forEach((snapshot, index) =>
          snapshot.forEach(
            (doc: {data(): {end: {toDate(): Date}}}) =>
              (recentObs[index] = doc
                .data()
                .end.toDate()
                .toLocaleDateString())
          )
        );
        console.log('recent obs are ', recentObs);
        return recentObs;
      })
      .catch((error: Error) =>
        console.error("Error occurred during Promise.all() resolution: ", error)
      );
  };

  /* getCoachList = async function() {
    return this.db
      .collection("users")
      .where("role", "==", "coach")
      .get()
      .then(snapshot => {
        const coachList = [];
        snapshot.forEach(doc => coachList.push(doc.data()));
        return coachList;
      })
      .catch(error => console.error("Error getting documents: ", error));
  }; */

  /**
   * gets first name of current user
   */
  getCoachFirstName = async function(): Promise<string> {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get()
      .then((doc: {data(): {firstName: string}}) => doc.data().firstName)
      .catch((error: Error) => console.error("Error getting cached document:", error));
  };

  /**
   * gets last name of current user
   */
  getCoachLastName = async function(): Promise<string> {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get()
      .then((doc: {data(): {lastName: string}}) => doc.data().lastName)
      .catch((error: Error) => console.error("Error getting cached document:", error));
  };

  /* getAdminList = async function() {
    return this.db
      .collection("users")
      .where("role", "==", "admin")
      .get()
      .then(snapshot => {
        const teacherList = [];
        snapshot.forEach(doc => teacherList.push(doc.data()));
        return teacherList;
      })
      .catch(error => console.error("Error getting documents: ", error));
  }; */

  /**
   * adds knowledge check entry to database
   * @param {object} entry
   */
  pushKnowledgeCheck = async function(entry: {
    type: string,
    questionIndex: number,
    answerIndex: number,
    isCorrect: boolean
  }): Promise<string | void> {
    const {
      type,
      questionIndex,
      answerIndex,
      isCorrect
    } = entry;
    return this.db
      .collection("knowledgeChecks")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        answeredBy: this.auth.currentUser.uid,
        type: type,
        questionIndex: questionIndex,
        answerIndex: answerIndex,
        isCorrect: isCorrect
      })
    .catch((error: Error) => console.error("Error occurred recording knowlegde check answer: ", error))
  };

  /**
   * sets fields in document for current observation
   * @param {object} mEntry
   */
  handleSession = async function(mEntry: {
    observedBy: string,
    teacher: string,
    type: string,
    start?: Date
  }): Promise<void> {
    this.sessionRef = this.db.collection("observations").doc();
    this.sessionRef
      .set({
        observedBy: "/user/" + mEntry.observedBy,
        start: mEntry.start ? mEntry.start : firebase.firestore.FieldValue.serverTimestamp(),
        teacher: "/user/" + mEntry.teacher,
        end: firebase.firestore.FieldValue.serverTimestamp(),
        type: mEntry.type
      })
      .catch((error: Error) => console.error("Error setting session ref: ", error));
  };

  /**
   * updates the end time of the observation session when completed
   * @param {Date | null} time 
   */
  endSession = async function(time: Date|null = null): Promise<void> {
    this.sessionRef
      .update({
        end: time ? time : firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred updating session ref: ", error)
      );
  };

  /**
   * submits a single center observation to database
   * @param {object} mEntry
   */
  handlePushCentersData = async function(mEntry: {
    checked: Array<number>,
    people: number
  }): Promise<string | void> {
    return this.sessionRef
      .collection("entries")
      .add({
        Checked: mEntry.checked,
        PeopleType: mEntry.people,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * 
   * @param {object} mEntry
   */
  handlePushSEEachEntry = async function(mEntry: {
    entryType: string,
    point: number,
    id: number
  }): Promise<string|void> {
    return this.sessionRef
      .collection("entries")
      .add({
          studentId: mEntry.id,
          point: mEntry.point,
          entryType: mEntry.entryType,
          Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
          console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * adds level of instruction selection to database
   * @param {string} insType
   */
  handlePushInstruction = async function(insType: string): Promise<string | void> {
    return this.sessionRef
      .collection("entries")
      .add({
        instructionType: insType,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * adds listening to children 1-minute observation to database
   * @param {object} mEntry
   */
  handlePushListening = async function(mEntry: {checked: Array<number>}): Promise<string|void> {
    return this.sessionRef
      .collection("entries")
      .add({
        Checked: mEntry.checked,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * adds number for tool to user's unlocked list when they complete training
   * @param {number} section
   */
  handleUnlockSection = async function(section: number): Promise<void> {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .update({
        unlocked: firebase.firestore.FieldValue.arrayUnion(section)
      })
      .catch((error: Error) =>
        console.error("Error occurred unlocking section: ", error)
      );
  };

  /**
   * gets array of unlocked tools for current user
   */
  getUnlockedSections = async function(): Promise<Array<number>> {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get()
      .then((doc: {data(): {unlocked: Array<number>}}) => {
        if (doc.data().unlocked === undefined) {
          return [];
        } else {
          return doc.data().unlocked;
        }
      })
      .catch((error: Error) => console.error("Error getting cached document:", error));
  };

  /**
   * saves a logged transition in the database
   * @param {object} mEntry
   */
  handlePushTransition = async function(mEntry: {
    start: string,
    end: string,
    duration: string,
    transitionType: string
  }): Promise<string|void> {
    return this.sessionRef
      .collection("entries")
      .add({
        TrnStart: mEntry.start,
        TrnEnd: mEntry.end,
        TrnDur: mEntry.duration,
        TrnType: mEntry.transitionType,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * adds climate selection to database
   * @param {object} mEntry
   */
  handlePushClimate = async function(mEntry: {
    BehaviorResponse: string,
    Type: string
  }): Promise<string | void> {
    return this.sessionRef
      .collection("entries")
      .add({
        BehaviorResponse: mEntry.BehaviorResponse,
        Type: mEntry.Type,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((error: Error) =>
        console.error("Error occurred adding observation: ", error)
      );
  };

  /**
   * add note to database
   * @param {string} mNote
   */
  handlePushNotes = async function(mNote: string): Promise<string | void> {
    return this.sessionRef
      .collection("notes")
      .add({
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        Note: mNote
      })
      .catch((error: Error) => console.error("Error occurred adding notes: ", error));
  };

  /**
   * 
   */
  handleFetchNotes = async function(): Promise<Array<Note>> {
    return this.sessionRef
      .collection("notes")
      .get()
      .then((snapshot: Array<{
        id: string,
        data(): {
          Note: string,
          Timestamp: {seconds: number, nanoseconds: number}
        }
      }>) => {
        const notesArr: Array<Note> = [];
        snapshot.forEach(doc =>
          notesArr.push({
            id: doc.id,
            content: doc.data().Note,
            timestamp: doc.data().Timestamp
          })
        );
        return notesArr;
      })
      .catch((error: Error) =>
        console.error("Error occurred fetching coach notes: ", error)
      );
  };

  /* handleFetchTrainingStatus = async function() {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get()
      .then(doc => doc.data().training)
      .catch(error => console.error("Error getting training status: ", error));
  }; */

  /* handleFetchQuestions = async function(section) {
    return this.db
      .collection("questionbank")
      .doc(section)
      .collection("questions")
      .get()
      .then(questions => {
        const questionList = [];
        questions.forEach(question => questionList.push(question.data()));
        return questionList;
      })
      .catch(error => console.error("Error getting documents: ", error));
  }; */


  handleFetchNotesResults = async function(sessionId: string): Promise<Note | void> {
    this.sessionRef = this.db.collection("observations").doc(sessionId);
    return this.sessionRef
      .collection("notes")
      .get()
      .then((querySnapshot: Array<{
        id: string,
        data(): {
          Note: string,
          Timestamp: {seconds: number, nanoseconds: number}
        }
      }>) => {
        const notesArr: Array<Note> = [];
        querySnapshot.forEach(doc =>
          notesArr.push({
            id: doc.id,
            content: doc.data().Note,
            timestamp: doc.data().Timestamp
          })
        );
        return notesArr;
      })
      .catch((error: Error) =>
        console.error("Error occurred getting result notes: ", error)
      );
  };

  // fetchClimateSessionDates = async teacherId => {
  //     var getClimateSessionDatesFirebaseFunction = this.functions.httpsCallable('funcSessionDates');
  //
  //     return getClimateSessionDatesFirebaseFunction({teacherId: teacherId}).then(function (result) {
  //         // Read result of the Cloud Function.
  //         var sanitizedMessage = result.data[0];
  //         console.log(sanitizedMessage);
  //         return sanitizedMessage;
  //
  //     });
  //
  // };

  /**
   * Classroom Climate cloud function
   * get average tone rating for observation session
   * @param {string} sessionId
   */
  fetchAvgToneRating = async function(sessionId: string): Promise<{average: number} | void> {
    const getAvgToneRatingFirebaseFunction = this.functions.httpsCallable(
      "funcAvgToneRating"
    );
    return getAvgToneRatingFirebaseFunction({ sessionId: sessionId })
      .then((result: {data: Array<Array<{average: number|null}>>}) => {
          result.data[0]
        }
      )
      .catch((error: Error) =>
        console.error("Error occurred getting average tone rating: ", error)
      );
  };

  /**
   * Student Engagement cloud function
   * get average engagement rating for observations session
   * @param {string} sessionId
   */
  fetchEngagementAvgSummary = async function(sessionId: string):
    Promise<{average: number} | void>
  {
    const getEngagementAvgSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcEngagementAvgSummary"
    );
    return getEngagementAvgSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        (result: {data: Array<Array<{average: number}>>}) =>
          result.data[0][0]
      )
      .catch((error: Error) =>
          console.error("Error occurred getting average tone rating: ", error)
      );
  };

  /**
   * Classroom Climate cloud function
   * gets counts of each behavior type for climate observation
   * @param {string} sessionId
   */
  fetchBehaviourTypeCount = async function(sessionId: string):
    Promise<Array<{behaviorResponse: string, count: number}> | void>
  {
    const getBehaviourTypeCountFirebaseFunction = this.functions.httpsCallable(
      "funcBehaviourTypeCount"
    );
    return getBehaviourTypeCountFirebaseFunction({ sessionId: sessionId })
      .then(
        (result: {data: Array<Array<{behaviorResponse: string, count: number}>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting behavior type count: ", error)
      );
  };

  /**
   * Classroom Climate cloud function
   * gets positive and negative behavior count for each observation
   * @param {string} teacherId
   */
  fetchBehaviourTrend = async function(teacherId: string):
    Promise<Array<{dayOfEvent: {value: string}, positive: number, negative: number}>>
  {
    const getBehaviourTrendFirebaseFunction = this.functions.httpsCallable(
      "funcBehaviourTrend"
    );
    return getBehaviourTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        (result: {data: Array<Array<{dayOfEvent: {value: string}, positive: number, negative: number}>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting behavior trend: ", error)
      );
  };

  /**
   * Student Engagement cloud function
   * gets average engagement rating for each observation
   * @param {string} teacherId
   */
  fetchEngagementTrend = async function(teacherId: string):
    Promise<Array<{startDate: {value: string}, average: number}>>
  {
    const getEngagementTrendFirebaseFunction = this.functions.httpsCallable(
      "funcEngagementTrend"
    );
    return getEngagementTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        (result: {data: Array<Array<{startDate: {value: string}, average: number}>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting engagement trend: ", error)
      );
  };

  /**
   * Level of Instruction cloud function
   * gets count of each instruction type
   * @param {string} sessionId
   */
  fetchInstructionTypeCount = async function(sessionId: string):
    Promise<Array<{instructionType: string, count: number}>>
  {
    const getInstructionTypeCountFirebaseFunction = this.functions.httpsCallable(
      "funcInstructionTypeCount"
    );
    return getInstructionTypeCountFirebaseFunction({ sessionId: sessionId })
      .then(
        (result: {data: Array<Array<{instructionType: string, count: number}>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting instruction type count: ", error)
      );
  };

  /**
   * Level of Instruction cloud function
   * gets counts of inferential and basic skills instruction for each observation
   * @param {string} teacherId
   */
  fetchInstructionTrend = async function(teacherId: string):
    Promise<Array<{dayOfEvent: {value: string}, inferential: number, basicSkills: number}>>
  {
    const getInstructionTrendFirebaseFunction = this.functions.httpsCallable(
      "funcInstructionTrend"
    );
    return getInstructionTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        (result: {data: Array<Array<{
          dayOfEvent: {value: string},
          inferential: number,
          basicSkills: number
        }>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting instruction trend: ", error)
      );
  };

  /**
   * cloud function
   * gets ids and start dates of each observation for a particular teacher and tool
   * @param {string} teacherId
   * @param {string} sessionType
   */
  fetchSessionDates = async function(teacherId: string, sessionType: string):
    Promise<Array<{id: string, sessionStart: {value: string}}>>
  {
    const getTransitionSessionDatesFirebaseFunction = this.functions.httpsCallable(
      "funcSessionDates"
    );
    return getTransitionSessionDatesFirebaseFunction({
      teacherId: teacherId,
      type: sessionType
    })
      .then(
        (result: {data: Array<Array<{id: string, sessionStart: {value: string}}>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error occurred getting session dates: ", error)
      );
  };

  /**
   * Transition Time cloud function
   * gets transition time and total session time
   * @param {string} sessionId
   */
  fetchTransitionSummary = async function(sessionId: string): Promise<Array<{
    total: number,
    sessionTotal: number,
    startDate: {value: string}
  }>> {
    const getTransitionTypeCountFirebaseFunction = this.functions.httpsCallable(
      "funcTransitionSessionSummary"
    );
    return getTransitionTypeCountFirebaseFunction({ sessionId: sessionId })
      .then(
        (result: {data: Array<Array<{
          total: number,
          sessionTotal: number,
          startDate: {value: string}
        }>>}) =>
          result.data[0]
      )
      .catch((error: Error) =>
        console.error("Error getting transition summary: ", error)
      );
  };

  /**
   * Transition Time cloud function
   * @param {string} sessionId
   */
  fetchTransitionTypeSummary = async function(sessionId: string):
    Promise<Array<{
      line: number,
      traveling: number,
      waiting: number,
      routines: number,
      behaviorManagement: number,
      other: number,
      total: number
    }>>
  {
    const getTransitionTypeCountFirebaseFunction = this.functions.httpsCallable(
      'funcTransitionTypeSummary'
    );
    return getTransitionTypeCountFirebaseFunction({ sessionId: sessionId })
    .then(
      (result: {data: Array<Array<{
        line: number,
        traveling: number,
        waiting: number,
        routines: number,
        behaviorManagement: number,
        other: number,
        total: number
      }>>}) =>
        result.data[0]
    )
    .catch((error: Error) =>
      console.error("Error occurred getting transition type summary: ", error)
    );
  };

  fetchTransitionLog = async function(sessionId) {
      const getTransitionsFirebaseFunction = this.functions.httpsCallable(
        'funcTransitionLogNew'
      );
      return getTransitionsFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting transition log: ", error)
      );
  };

  fetchTransitionTrend = async function(teacherId) {
      const getTransitionTrendFirebaseFunction = this.functions.httpsCallable(
        'funcTransitionTrendNew'
      );
      return getTransitionTrendFirebaseFunction({ teacherId: teacherId })
        .then(
          result =>

          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting transition trend: ", error)
      );
  };

  fetchACDetails = async function(sessionId) {
    const getACDetailsFirebaseFunction = this.functions.httpsCallable(
      "funcACDetails"
    );
    return getACDetailsFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting AC details: ", error)
      );
  };

  fetchSeqDetails = async function(sessionId) {
    const getSeqDetailsFirebaseFunction = this.functions.httpsCallable(
      "funcSeqDetails"
    );
    return getSeqDetailsFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting sequential details: ", error)
      );
  };

    fetchEngagementDetails = async function(sessionId) {
        const getEngagementDetailsFirebaseFunction = this.functions.httpsCallable(
            "funcEngagementDetails"
        );
        return getEngagementDetailsFirebaseFunction({ sessionId: sessionId })
            .then(
                result =>
                    // Read result of the Cloud Function.
                    // var sanitizedMessage = result.data[0];
                    // console.log(sanitizedMessage);
                    // return sanitizedMessage;
                    result.data[0][0]
            )
            .catch(error =>
                console.error("Error occurred getting sequential details: ", error)
            );
    };


    fetchMathDetails = async function(sessionId) {
    const getMathDetailsFirebaseFunction = this.functions.httpsCallable(
      "funcMathDetails"
    );
    return getMathDetailsFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting math details: ", error)
      );
  };

  fetchListeningDetails = async function(sessionId) {
    const getListeningDetailsFirebaseFunction = this.functions.httpsCallable(
      "funcListeningDetails"
    );
    return getListeningDetailsFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting listening details: ", error)
      );
  };

  fetchChildACSummary = async function(sessionId) {
    const getChildACSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcChildACSummary"
    );
    return getChildACSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
          // console.log(result);
      )
      .catch(error =>
        console.error("Error occurred getting child AC summary: ", error)
      );
  };

  fetchChildSeqSummary = async function(sessionId) {
    const getChildSeqSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcChildSeqSummary"
    );
    return getChildSeqSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
      )
      .catch(error =>
        console.error(
          "Error occurred getting child Sequential summary: ",
          error
        )
      );
  };

    fetchEngagementPieSummary = async function(sessionId) {
        const getEngagementPieSummaryFirebaseFunction = this.functions.httpsCallable(
            "funcEngagementPieSummary"
        );
        return getEngagementPieSummaryFirebaseFunction({ sessionId: sessionId })
            .then(
                result =>
                    // Read result of the Cloud Function.
                    // var sanitizedMessage = result.data[0];
                    // console.log(sanitizedMessage);
                    // return sanitizedMessage;
                    result.data[0][0]
            )
            .catch(error =>
                console.error(
                    "Error occurred getting child Sequential summary: ",
                    error
                )
            );
    };

  fetchChildMathSummary = async function(sessionId) {
    const getChildMathSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcChildMathSummary"
    );
    return getChildMathSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting child math summary: ", error)
      );
  };

  fetchTeacherACSummary = async function(sessionId) {
    const getTeacherACSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherACSummary"
    );
    return getTeacherACSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting teacher AC summary: ", error)
      );
  };

  fetchTeacherSeqSummary = async function(sessionId) {
    const getTeacherSeqSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherSeqSummary"
    );
    return getTeacherSeqSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0][0]
      )
      .catch(error =>
        console.error(
          "Error occurred getting teacher sequential summary: ",
          error
        )
      );
  };

  fetchTeacherMathSummary = async function(sessionId) {
    const getTeacherMathSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherMathSummary"
    );
    return getTeacherMathSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting teacher math summary: ", error)
      );
  };

  fetchListeningSummary = async function(sessionId) {
    const getListeningSummaryFirebaseFunction = this.functions.httpsCallable(
      "funcListeningSummary"
    );
    return getListeningSummaryFirebaseFunction({ sessionId: sessionId })
      .then(
        result =>
          result.data[0][0]
      )
      .catch(error =>
        console.error("Error occurred getting listening summary: ", error)
      );
  };


  fetchChildACTrend = async function(teacherId) {
    const getChildACTrendFirebaseFunction = this.functions.httpsCallable(
      "funcChildACTrend"
    );
    return getChildACTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting child AC trend: ", error)
      );
  };

  fetchChildSeqTrend = async function(teacherId) {
    const getChildSeqTrendFirebaseFunction = this.functions.httpsCallable(
      "funcChildSeqTrend"
    );
    return getChildSeqTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting child sequential trend: ", error)
      );
  };

  fetchChildMathTrend = async function(teacherId) {
    const getChildMathTrendFirebaseFunction = this.functions.httpsCallable(
      "funcChildMathTrend"
    );
    console.log('fetchChildMathTrend from firebase executed');
    return getChildMathTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting child math trend: ", error)
      );
  };

  fetchTeacherACTrend = async function(teacherId) {
    const getTeacherACTrendFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherACTrend"
    );
    return getTeacherACTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting teacher AC trend: ", error)
      );
  };

  fetchTeacherSeqTrend = async function(teacherId) {
    const getTeacherSeqTrendFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherSeqTrend"
    );
    return getTeacherSeqTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          // Read result of the Cloud Function.
          // var sanitizedMessage = result.data[0];
          // console.log(sanitizedMessage);
          // return sanitizedMessage;
          result.data[0]
      )
      .catch(error => console.error("Error occurred getting teacher sequential trend: ", error))
  };

  fetchTeacherMathTrend = async function(teacherId) {
    const getTeacherMathTrendFirebaseFunction = this.functions.httpsCallable(
      "funcTeacherMathTrend"
    );
    return getTeacherMathTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting teacher math trend: ", error)
      );
  };

  fetchListeningTrend = async function(teacherId) {
    const getListeningTrendFirebaseFunction = this.functions.httpsCallable(
      "funcListeningTrend"
    );
    return getListeningTrendFirebaseFunction({ teacherId: teacherId })
      .then(
        result =>
          result.data[0]
      )
      .catch(error =>
        console.error("Error occurred getting listening trend: ", error)
      );
  };

  createActionPlan = async function(teacherId, magic8) {
    const data = Object.assign(
      {},
      {
        coach: this.auth.currentUser.uid,
        teacher: teacherId,
        tool: magic8,
        dateModified: firebase.firestore.Timestamp.now(),
        dateCreated: firebase.firestore.Timestamp.now(),
        goal: '',
        goalTimeline: '',
        benefit: ''
      }
    );
    const actionPlansRef = firebase.firestore().collection('actionPlans').doc();
    actionPlansRef.set(data).then(() => {
      const actionStepsRef = actionPlansRef.collection("actionSteps").doc('0');
      actionStepsRef.set({
        materials: '',
        person: '',
        step: '',
        timeline: ''
      }).then(() => {
        console.log('action steps created');
      }).catch(() => {
        console.log('error creating action steps');
      })
    }).catch(() => {
      console.log('error creating action plan');
    })
  }
  
  createActionStep = async function(actionPlanId, index) {
    const actionStepsRef = this.db.collection('actionPlans').doc(actionPlanId).collection("actionSteps").doc(index);
    actionStepsRef.set({
      step: '',
      materials: '',
      person: '',
      timeline: ''
    }).then(() => {
      console.log('action steps created');
    }).catch(() => {
      console.log('error creating action steps');
    })
  }

  /**
   * finds all action plans for coach and all their teachers
   */
  getCoachActionPlans = async function() {
    this.sessionRef = this.db.collection("actionPlans")
      .where("coach", "==", this.auth.currentUser.uid)
    return this.sessionRef.get()
      .then(querySnapshot => {
        const idArr = [];
        querySnapshot.forEach(doc =>
          idArr.push({
            id: doc.id,
            teacherId: doc.data().teacher,
            teacherFirstName: '',
            teacherLastName: '',
            practice: doc.data().tool,
            date: doc.data().dateModified
          })
        )
        return idArr;
      })
      .catch(() => {
        console.log( 'unable to retrieve action plan id')
      })
  }

  /**
   * finds all action plans for coach and their selected teacher
   * @param {string} practice
   * @param {string} teacherId
   */
  getTeacherActionPlans = async function(practice, teacherId) {
    this.sessionRef = this.db.collection("actionPlans")
      .where("coach", "==", this.auth.currentUser.uid)
      .where("teacher", "==", teacherId)
      .where("tool", "==", practice)
    return this.sessionRef.get()
      .then(querySnapshot => {
        const idArr = [];
        querySnapshot.forEach(doc =>
          idArr.push({
            id: doc.id,
            date: doc.data().dateModified
          })
        )
        return idArr;
      })
      .catch(() => {
        console.log( 'unable to retrieve action plans')
      })
  }

  getTeacherFirstName = async function(teacherId) {
    return this.db
      .collection("users")
      .doc(teacherId)
      .get()
      .then(doc => doc.data().firstName)
      .catch(error => console.error("Error getting cached document:", error));
  }

  getTeacherLastName = async function(teacherId) {
    return this.db
      .collection("users")
      .doc(teacherId)
      .get()
      .then(doc => doc.data().lastName)
      .catch(error => console.error("Error getting cached document:", error));
  }

  getAPInfo = async function(actionPlanId) {
    return this.db
      .collection("actionPlans")
      .doc(actionPlanId)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("Doc does not exist");
          return {};
        }
      })
      .catch(error =>
        console.error("Error occurred when getting document:", error)
      );
  };

  getActionSteps = async function(actionPlanId) {
    this.sessionRef = this.db.collection("actionPlans").doc(actionPlanId).collection("actionSteps");
    return this.sessionRef.get()
      .then(querySnapshot => {
        const actionStepsArr = [];
        querySnapshot.forEach(doc => 
          actionStepsArr.push({
            step: doc.data().step,
            materials: doc.data().materials,
            person: doc.data().person,
            timeline: doc.data().timeline
          })
        );
        return actionStepsArr;
      })
      .catch(() => {
        console.log('error retrieving action steps');
      })
  }

  saveActionPlan = async function(actionPlanId, goal, goalTimeline, benefit) {
    var actionPlanRef = this.db.collection("actionPlans").doc(actionPlanId);
    return actionPlanRef.update({
      goal: goal,
      goalTimeline: goalTimeline,
      benefit: benefit,
      dateModified: firebase.firestore.Timestamp.now()
    })
    .then(() => {
      console.log("Action plan updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating action plan: ", error);
    })
  }

  saveActionStep = async function(actionPlanId, index, step, materials, person, timeline) {
    var actionStepsRef = this.db.collection("actionPlans").doc(actionPlanId).collection("actionSteps").doc(index);
    return actionStepsRef.update({
      step: step, 
      materials: materials,
      person: person,
      timeline: timeline
    })
    .then(() => {
      console.log("Action step updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating action plan: ", error);
    })
  }

  /**
   * creates conference plan in cloud firestore
   * @param {string} teacherId
   * @param {string} sessionId
   * @param {string} magic8
   * @param {Array<string>} feedback
   * @param {Array<string>} questions
   * @param {Array<string>} addedQuestions
   * @param {Array<string>} notes
   */
  createConferencePlan = async function(teacherId, sessionId, magic8, feedback, questions, addedQuestions, notes) {
    const data = Object.assign(
      {},
      {
        sessionId: sessionId,
        coach: this.auth.currentUser.uid,
        teacher: teacherId,
        tool: magic8,
        dateCreated: firebase.firestore.Timestamp.now(),
        dateModified: firebase.firestore.Timestamp.now(),
        feedback: feedback ? feedback : [''],
        questions: questions ? questions : [''],
        addedQuestions: addedQuestions ? addedQuestions : [],
        notes: notes ? notes : ['']
      }
    );
    const conferencePlansRef = firebase.firestore().collection('conferencePlans').doc();
    conferencePlansRef.set(data).then(() => {
      console.log('conference plan created');
    }).catch(() => {
      console.log('error creating conference plan');
    })
  }

  /**
   * gets data in conference plan
   * @param {string} sessionId
   */
  getConferencePlan = async function(sessionId) {
    this.sessionRef = this.db.collection("conferencePlans")
      .where("sessionId", "==", sessionId)
    return this.sessionRef.get()
      .then(querySnapshot => {
        const idArr = [];
        querySnapshot.forEach(doc =>
          idArr.push({
            id: doc.id,
            feedback: doc.data().feedback,
            questions: doc.data().questions,
            addedQuestions: doc.data().addedQuestions,
            notes: doc.data().notes,
            date: doc.data().dateCreated
          })
        );
        return idArr;
      })
      .catch(() => {
        console.log( 'unable to retrieve conference plan')
      })
  }

  /**
   * finds all conference plans for coach and all their teachers
   */
  getCoachConferencePlans = async function() {
    this.sessionRef = this.db.collection("conferencePlans")
      .where("coach", "==", this.auth.currentUser.uid)
    return this.sessionRef.get()
      .then(querySnapshot => {
        const idArr = [];
        querySnapshot.forEach(doc =>
          idArr.push({
            id: doc.id,
            teacherId: doc.data().teacher,
            teacherFirstName: '',
            teacherLastName: '',
            sessionId: doc.data().sessionId,
            practice: doc.data().tool,
            date: doc.data().dateModified
          })
        )
        return idArr;
      })
      .catch(() => {
        console.log( 'unable to retrieve conference plan info')
      })
  }

  getObservationDate = async function(sessionId) {
    return this.db
      .collection("observations")
      .doc(sessionId)
      .get()
      .then(doc => doc.data().start)
      .catch(error => console.error("Error getting cached document:", error));
  }

  /**
   * @param {string} conferencePlanId
   * @param {Array<string>} feedback
   * @param {Array<string>} questions
   * @param {Array<string>} addedQuestions
   * @param {Array<string>} notes
   */
  saveConferencePlan = async function(conferencePlanId, feedback, questions, addedQuestions, notes) {
    const conferencePlanRef = this.db.collection("conferencePlans").doc(conferencePlanId);
    return conferencePlanRef.update({
      feedback: feedback,
      questions: questions,
      addedQuestions: addedQuestions,
      notes: notes,
      dateModified: firebase.firestore.Timestamp.now()
    })
    .then(() => {
      console.log("Action plan updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating action plan: ", error);
    })
  }

  /**
   * @param {string} conferencePlanId
   * @param {string} note
   */
  addNoteToConferencePlan = async function(conferencePlanId, note) {
    return this.db
      .collection("conferencePlans")
      .doc(conferencePlanId)
      .update({
        // does not add if it has already been added
        notes: firebase.firestore.FieldValue.arrayUnion(note)
      })
      .catch(error =>
        console.error("Error adding note to conference plan: ", error)
      );
  };

  /**
   * @param {string} sessionId
   * @param {string} questionText
   */
  saveConferencePlanQuestion = async function(sessionId, questionText) {
    const conferencePlanRef = this.db.collection("conferencePlans").where("sessionId", "==", sessionId);
    conferencePlanRef.get().then(querySnapshot => {
      const conferencePlanId = [];
      querySnapshot.forEach(doc =>
        conferencePlanId.push(doc.id)
      );
      return this.db.collection("conferencePlans").doc(conferencePlanId[0]).update({
        addedQuestions: firebase.firestore.FieldValue.arrayUnion(questionText),
        dateModified: firebase.firestore.Timestamp.now()
      })
    })
  }

}

export default Firebase;
import * as xlsx from 'xlsx'

type ActionPlanXlsxResources = {
  coachId: string
  teacherId: string
  dateModified: Date | null
  goalTimeline: Date | null
  benefit: string
  tool: string
  steps: Array<{ step: string; person: string; timeline: Date | null }>
  goal: string
}

type ConferencePlanXlsxResources = {
  coachId: string
  teacherId: string
  tool: string
  dateCreated: Date | null
  dateModified: Date | null
  feedback: Array<string>
  questions: Array<string>
  notes: Array<string>
}

type NotesXlsxResources = {
  observationId: string
  coachId: string
  teacherId: string
  dateModified: Date | null
  tool: string
  noteId: string
  timestamp: Date | null
  content: string
}

type EmailXlsxResources = {
  email: string
  timestamp: Date | null
}

const convertDate = (date: Date | null) =>{
  if( date instanceof Date) {
    return date.toLocaleDateString()
  }
  return ''
}

const maxActionPlanSteps = (resources: ActionPlanXlsxResources[]) => {
  return resources
    .map(resource => resource.steps.length)
    .reduce((prev, cur) => Math.max(prev, cur), -Infinity)
}

const createActionPlanHeaders = (resources: ActionPlanXlsxResources[]) => {
  let headers = [
    'Coach ID',
    'Teacher ID',
    'Date Modified',
    'Tool',
    'Goal',
    'Goal Date',
    'Benefit for Students',
  ]
 // Adds the  required headers for the largest group of Action Plan steps
  let steps = maxActionPlanSteps(resources)
    let questions = []
    for(let i = 0; i < steps; i++) {
      questions.push(`Action Step ${i + 1}`)
      questions.push(`Person ${i + 1}`)
      questions.push(`Timeline ${i + 1}`)
    }
  return headers.concat(questions)
}

const createNotesHeaders = () => {
  let headers = [
    'Observation Id',
    'Coach ID',
    'Teacher ID',
    'Observation Date',
    'Tool',
    'Note Id',
    'TimeStamp',
    'Content'
  ]

  return headers;
}

const createEmailHeaders = () => {
  let headers = [
    'Email Address',
    'TimeStamp'
  ]
  return headers;
}

const createActionPlanRow = (actionPlan: ActionPlanXlsxResources): string[] => {
  let { coachId, teacherId, dateModified, goal, goalTimeline, benefit, steps, tool } = actionPlan
  let data = [
    coachId,
    teacherId,
    convertDate(dateModified),
    tool,
    goal,
    convertDate(goalTimeline),
    benefit,
  ]
  steps.forEach((step) => {
    data.push(step.step)
    data.push(step.person)
    data.push(convertDate(step.timeline))
  })
  return data
}

const createNotesRow = (notes: NotesXlsxResources) => {
  let {observationId, coachId, teacherId, dateModified, tool, noteId, timestamp, content } = notes;
  let data = [
    observationId,
    coachId,
    teacherId,
    convertDate(dateModified),
    tool,
    noteId,
    timestamp?.toString(),
    content
  ];
  return data;
}

const createEmailRow = (content: EmailXlsxResources) => {
  let {email, timestamp} = content;
  let data = [
    email,
    timestamp?.toString()
  ];
  return data;
}

export const generateActionPlanXlsx = (
  resources: ActionPlanXlsxResources[]
) => {
  let wb = xlsx.utils.book_new()
  const baseRows = [createActionPlanHeaders(resources)]
  const rows = baseRows.concat(resources.map(actionPlan =>createActionPlanRow(actionPlan)))

  let sheet = xlsx.utils.aoa_to_sheet(rows)
  // sets the column widths for each column -- each needs its own object.
  sheet[`!cols`] = Array.from({ length: rows[0].length }).map(_ => {
    return { wch: 12 }
  })
  xlsx.utils.book_append_sheet(wb, sheet, 'Action Plans')
  return wb
}

export const generateNotesXlsx = (
  resources: NotesXlsxResources[]
) => {
  let wb = xlsx.utils.book_new()
  const baseRows = [createNotesHeaders()]
  const rows = baseRows.concat(resources.map(notes => createNotesRow(notes)))

  let sheet = xlsx.utils.aoa_to_sheet(rows)
  // sets the column widths for each column -- each needs its own object.
  const wbcols = [ {wch:22}, {wch:34}, {wch:28}, {wch:10}, {wch:12}, {wch:20}, {wch:21}, {wch:50}];
  sheet[`!cols`] = wbcols;
  xlsx.utils.book_append_sheet(wb, sheet, 'Notes')
  return wb
}

export const generateEmailXlsx = (
  resources: EmailXlsxResources[]
) => {
  let wb = xlsx.utils.book_new();
  const baseRows = [createEmailHeaders()];
  const rows = baseRows.concat(resources.map(content => createEmailRow(content)));

  let sheet = xlsx.utils.aoa_to_sheet(rows)
  // sets the column widths for each column -- each needs its own object.
  const wbcols = [{wch:30}, {wch:50}];
  sheet[`!cols`] = wbcols;
  xlsx.utils.book_append_sheet(wb, sheet, 'Notes')
  return wb
}

const maxConferencePlanSteps = (resources: ConferencePlanXlsxResources[]) => {
  return resources
    .flatMap(resource => [resource.questions.length, resource.notes.length, resource.questions.length])
    .reduce((prev,cur) => Math.max(prev, cur), -Infinity)
}

const createConferecePlanHeaders = (resources: ConferencePlanXlsxResources[]) => {
  let headers = [
    'Coach ID',
    'Teacher ID',
    'Date Modified',
    'Tool',
  ]
  // Adds the  required headers for the largest group of Action Plan steps
  let steps = maxConferencePlanSteps(resources)
  let questions = []
  for(let i = 0; i < steps; i++) {
    questions.push(`Question ${i + 1}`)
    questions.push(`Feedback ${i + 1}`)
    questions.push(`Notes ${i + 1}`)
  }
  return headers.concat(questions)
}

const createConferencePlanRow = (conferencePlan: ConferencePlanXlsxResources): string[] => {
  let { coachId, teacherId, dateModified, notes, feedback, questions, tool } = conferencePlan
  let data = [
    coachId,
    teacherId,
    convertDate(dateModified),
    tool,
  ]
  for(let i = 0; i < Math.max(notes.length, feedback.length, questions.length); i++) {
    data.push(questions[i] ?? '')
    data.push(feedback[i] ?? '')
    data.push(notes[i] ?? '')
  }

  return data
}

export const generateConferencePlanXlsx = (
  resources: ConferencePlanXlsxResources[]
) => {
  const wb = xlsx.utils.book_new()
  const baseRows =[createConferecePlanHeaders(resources)]
  const rows = baseRows.concat(resources.map(conferencePlan =>createConferencePlanRow(conferencePlan)))

  let sheet = xlsx.utils.aoa_to_sheet(rows)
  // sets the column widths for each column -- each needs its own object.
  sheet[`!cols`] = Array.from({ length: rows[0].length }).map(_ => {
    return { wch: 12 }
  })
  xlsx.utils.book_append_sheet(wb, sheet, 'Conference Plans')
  return wb
}

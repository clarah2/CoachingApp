import React, { FunctionComponent } from 'react'
import Grid from '@material-ui/core/Grid/Grid'
import TeacherBehaviorsDetailsHorizontalBar from './TeacherBehaviorsDetailsHorizontalBar'
import GraphHeader from '../../LayoutComponents/GraphLayouts/GraphHeader'
import BarChartLegend from '../../LayoutComponents/GraphLayouts/BarChartLegend'
import { BarWrapperDetails } from "../../ResultsComponents/ChartWrappers"

interface OwnProps {
  questionTextClass: string
  teacher1: number
  teacher2: number
  teacher3: number
  teacher4: number
  totalVisits: number
}

type Props = OwnProps

const TeacherDetailsChart: FunctionComponent<Props> = props => {
  return (
    <div>
      <Grid justify={'center'} direction={'column'}>
        <GraphHeader graphTitle={'Teacher Behaviors'} />
        <BarChartLegend
          questionTextClass={props.questionTextClass}
          questions={[
            "Was there a strategy the teacher used more often to support children's interactions?",
            'Was there a strategy the teacher used less often?',
          ]}
        />
        <BarWrapperDetails>
          <TeacherBehaviorsDetailsHorizontalBar
            teacher1={props.teacher1}
            teacher2={props.teacher2}
            teacher3={props.teacher3}
            teacher4={props.teacher4}
            totalVisits={props.totalVisits}
          />
        </BarWrapperDetails>
      </Grid>
    </div>
  )
}

export default TeacherDetailsChart

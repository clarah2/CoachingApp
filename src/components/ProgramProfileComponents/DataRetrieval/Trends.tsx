const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

class TrendData {

  constructor() {

  }

  /*
   * Will return an object that holds data for all of the trends data for Book Reading
   */
   calculateTransitionTrends = (data, sites, startDate, endDate) => {

     // Initialize the array that will hold all the data
     var results = {};

     var totalIntervals = 0;

     // Get start month and year
     const startMonth = startDate.getMonth();

     const endMonth = endDate.getMonth();

     // Add each teacher to the object
     var tempName = "";
     for(var siteIndex in sites)
     {

       results[siteIndex] = {
         name: tempName,
         line: new Array(12).fill(0),
         traveling: new Array(12).fill(0),
         waiting: new Array(12).fill(0),
         routines: new Array(12).fill(0),
         behaviorManagement: new Array(12).fill(0),
         other: new Array(12).fill(0),
         total: new Array(12).fill(0),

         lineAverage: new Array(12).fill(0),
         travelingAverage: new Array(12).fill(0),
         waitingAverage: new Array(12).fill(0),
         routinesAverage: new Array(12).fill(0),
         behaviorManagementAverage: new Array(12).fill(0),
         otherAverage: new Array(12).fill(0),
       };

     }




     for(var siteIndex in sites)
     {

       // Sort by date just in case
       sites[siteIndex].sort(function(a,b){
         return new Date(b.startDate.value) - new Date(a.startDate.value);
       });

       // Get number of instances for each type of data
       var prevMonth = 0, rowMonth = startMonth;

       for(var rowIndex in sites[siteIndex])
       {
         var row = sites[siteIndex][rowIndex];

         rowMonth = new Date(row.startDate.value).getMonth();

         // Add to behavior types
         results[siteIndex].line[rowMonth] +=  row.line;

         results[siteIndex].traveling[rowMonth] += row.traveling;
         results[siteIndex].waiting[rowMonth] += row.waiting;
         results[siteIndex].routines[rowMonth] += row.routines;
         results[siteIndex].behaviorManagement[rowMonth] += row.behaviorManagement;
         results[siteIndex].other[rowMonth] += row.other;

         // Calculate the total Number of instructions
         results[siteIndex].total[rowMonth] += row.total;
       }
     }

     // Calculate the averages in percentages
     // Go through each teacher
     for(var resultsIndex in results)
     {
       var result = results[resultsIndex];

       // Go through the months
       for(var i = 0; i < 12; i++)
       {
         var tempTotalInstructions = result.total[i];

         result.lineAverage[i] = result.line[i] > 0 ? (result.line[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.travelingAverage[i] = result.traveling[i] > 0 ? (result.traveling[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.waitingAverage[i] = result.waiting[i] > 0 ? (result.waiting[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.routinesAverage[i] = result.routines[i] > 0 ? (result.routines[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.behaviorManagementAverage[i] = result.behaviorManagement[i] > 0 ? (result.behaviorManagement[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.otherAverage[i] = result.other[i] > 0 ? (result.other[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

       }
     }

     return results;

   }

   /*
    * Classroom Climate
    */
   calculateClimateTrends = (data, sites, startDate, endDate) => {

     // Initialize the array that will hold all the data
     var results = {};

     var totalIntervals = 0;

     // Get start month and year
     const startMonth = startDate.getMonth();

     const endMonth = endDate.getMonth();

     // Add each teacher to the object
     var tempName = "";
     for(var siteIndex in sites)
     {

       results[siteIndex] = {
         name: tempName,
         total: new Array(12).fill(0),
         nonspecificapproval: new Array(12).fill(0),
         specificapproval: new Array(12).fill(0),
         disapproval: new Array(12).fill(0),
         redirection: new Array(12).fill(0),

         nonspecificapprovalAverage: new Array(12).fill(0),
         specificapprovalAverage: new Array(12).fill(0),
         disapprovalAverage: new Array(12).fill(0),
         redirectionAverage: new Array(12).fill(0),
       };

     }


     // Get number of instances for each type of data
     var prevMonth = 0, rowMonth = startMonth;


     for(var siteIndex in sites)
     {

       for(var rowIndex in sites[siteIndex])
       {

         var row = sites[siteIndex][rowIndex];

         rowMonth = new Date(row.startDate.value).getMonth();


         // Add to behavior types
         // There's a problem where an extra row is being saved where the behaviorResponse is being saved as a number. No idea why but we have to make sure we don't use that row
         if(row.behaviorResponse === "nonspecificapproval" || row.behaviorResponse === "specificapproval" || row.behaviorResponse === "disapproval" || row.behaviorResponse === "redirection")
         {
           results[siteIndex][row.behaviorResponse][rowMonth] +=  row.count;
           results[siteIndex].total[rowMonth] += row.count;
         }

       }
     }

     // Calculate the averages in percentages
     // Go through each teacher
     for(var resultsIndex in results)
     {
       var result = results[resultsIndex];

       // Go through the months
       for(var i = 0; i < 12; i++)
       {
         var tempTotalInstructions = result.total[i];

         result.nonspecificapprovalAverage[i] = result.nonspecificapproval[i] > 0 ? (result.nonspecificapproval[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.specificapprovalAverage[i] = result.specificapproval[i] > 0 ? (result.specificapproval[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.disapprovalAverage[i] = result.disapproval[i] > 0 ? (result.disapproval[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
         result.redirectionAverage[i] = result.redirection[i] > 0 ? (result.redirection[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

       }
     }

     return results;

   }

   /*
    * MATH INSTRUCTIONS
    */
  calculateMathTrends = (data, sites, startDate, endDate) => {

    // Initialize the array that will hold all the data
    var results = {};

    var totalIntervals = 0;

    // Get start month and year
    const startMonth = startDate.getMonth();

    const endMonth = endDate.getMonth();

    // Add each teacher to the object
    var tempName = "";
    for(var siteIndex in sites)
    {

      tempName = "";

      results[siteIndex] = {
        name: tempName,
        totalInstructions: new Array(12).fill(0),
        mathVocabulary: new Array(12).fill(0),
        askingQuestions: new Array(12).fill(0),
        mathConcepts: new Array(12).fill(0),
        helpingChildren: new Array(12).fill(0),

        notAtCenter: new Array(12).fill(0),
        noSupport: new Array(12).fill(0),
        support: new Array(12).fill(0),

        totalInstructionsAverage: new Array(12).fill(0),
        mathVocabularyAverage: new Array(12).fill(0),
        askingQuestionsAverage: new Array(12).fill(0),
        mathConceptsAverage: new Array(12).fill(0),
        helpingChildrenAverage: new Array(12).fill(0),

        notAtCenterAverage: new Array(12).fill(0),
        noSupportAverage: new Array(12).fill(0),
        supportAverage: new Array(12).fill(0),
      };

    }


    // Get number of instances for each type of data
    var tempIntervalData = 0;

    for(var siteIndex in sites)
    {
      for(var rowIndex in sites[siteIndex])
      {
        var row = sites[siteIndex][rowIndex];

        var rowMonth = new Date(row.timestamp).getMonth();

        // Add to total # of intervals
        results[siteIndex].totalInstructions[rowMonth] += row.noOpportunity + row.support + row.noSupport;

        // Add to behavior types
        results[siteIndex].mathVocabulary[rowMonth] += row.mathVocabulary;
        results[siteIndex].askingQuestions[rowMonth] += row.askingQuestions;
        results[siteIndex].mathConcepts[rowMonth] += row.mathConcepts;
        results[siteIndex].helpingChildren[rowMonth] += row.helpingChildren;

        results[siteIndex].notAtCenter[rowMonth] += row.noOpportunity;
        results[siteIndex].support[rowMonth] += row.support;
        results[siteIndex].noSupport[rowMonth] += row.noSupport;
      }
    }

    // Calculate the averages in percentages
    // Go through each teacher
    for(var resultsIndex in results)
    {
      var result = results[resultsIndex];

      // Go through the months
      for(var i = 0; i < 12; i++)
      {
        var tempTotalInstructions = result.totalInstructions[i];

        result.mathVocabularyAverage[i] = result.mathVocabulary[i] > 0 ? (result.mathVocabulary[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.askingQuestionsAverage[i] = result.askingQuestions[i] > 0 ? (result.askingQuestions[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.mathConceptsAverage[i] = result.mathConcepts[i] > 0 ? (result.mathConcepts[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.helpingChildrenAverage[i] = result.helpingChildren[i] > 0 ? (result.helpingChildren[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

        result.notAtCenterAverage[i] = result.notAtCenter[i] > 0 ? (result.notAtCenter[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.supportAverage[i] = result.support[i] > 0 ? (result.support[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.noSupportAverage[i] = result.noSupport[i] > 0 ? (result.noSupport[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

      }
    }

    return results;

  }

   /*
    * Level of Instructions
    */
  calculateLevelInstructionTrends = (data, sites, startDate, endDate) => {

    // Initialize the array that will hold all the data
    var results = {};

    var totalIntervals = 0;

    // Get start month and year
    const startMonth = startDate.getMonth();

    const endMonth = endDate.getMonth();

    // Add each teacher to the object
    var tempName = "";
    for(var siteIndex in sites)
    {

      results[siteIndex] = {
        name: tempName,
        totalInstructions: new Array(12).fill(0),
        hlq: new Array(12).fill(0),
        hlqResponse: new Array(12).fill(0),
        llq: new Array(12).fill(0),
        llqResponse: new Array(12).fill(0),

        hlqAverage: new Array(12).fill(0),
        hlqResponseAverage: new Array(12).fill(0),
        llqAverage: new Array(12).fill(0),
        llqResponseAverage: new Array(12).fill(0),

      };

    }


    // Get number of instances for each type of data
    var tempIntervalData = 0;

    for(var siteIndex in sites)
    {
      for(var rowIndex in sites[siteIndex])
      {
        var row = sites[siteIndex][rowIndex];



        var rowMonth = new Date(row.startDate.value).getMonth();

        // Add to total # of intervals
        results[siteIndex].totalInstructions[rowMonth] += row.count;

        // Add to behavior types
        results[siteIndex][row.instructionType][rowMonth] += row.count;
      }
    }

    // Calculate the averages in percentages
    // Go through each teacher
    for(var resultsIndex in results)
    {
      var result = results[resultsIndex];

      // Go through the months
      for(var i = 0; i < 12; i++)
      {
        var tempTotalInstructions = result.totalInstructions[i];

        result.hlqAverage[i] = result.hlq[i] > 0 ? (result.hlq[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.hlqResponseAverage[i] = result.hlqResponse[i] > 0 ? (result.hlqResponse[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.llqAverage[i] = result.llq[i] > 0 ? (result.llq[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
        result.llqResponseAverage[i] = result.llqResponse[i] > 0 ? (result.llqResponse[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

      }
    }

    return results;

  }

  /*
   * Student Engagement
   */
 calculateStudentEngagementTrends = (data, sites, startDate, endDate) => {

   // Initialize the array that will hold all the data
   var results = {};

   var totalIntervals = 0;

   // Get start month and year
   const startMonth = startDate.getMonth();

   const endMonth = endDate.getMonth();

   // Add each teacher to the object
   var tempName = "";
   for(var siteIndex in sites)
   {

     tempName = "";

     results[siteIndex] = {
       name: tempName,
       totalInstructions: new Array(12).fill(0),
       offTask: new Array(12).fill(0),
       mildlyEngaged: new Array(12).fill(0),
       engaged: new Array(12).fill(0),
       highlyEngaged: new Array(12).fill(0),


       offTaskAverage: new Array(12).fill(0),
       mildlyEngagedAverage: new Array(12).fill(0),
       engagedAverage: new Array(12).fill(0),
       highlyEngagedAverage: new Array(12).fill(0),
     };

   }


   // Get number of instances for each type of data
   var tempIntervalData = 0;

   for(var siteIndex in sites)
   {
     for(var rowIndex in sites[siteIndex])
     {
       var row = sites[siteIndex][rowIndex];



       var rowMonth = new Date(row.startDate).getMonth();

       // Add to total # of intervals
       results[siteIndex].totalInstructions[rowMonth] += row.count;

       // Add to behavior types
       switch (row.point) {
         case 0:
           results[siteIndex].offTask[rowMonth] += row.count;
           break;
         case 1:
           results[siteIndex].mildlyEngaged[rowMonth] += row.count;
           break;
         case 2:
           results[siteIndex].engaged[rowMonth] += row.count;
           break;
         case 3:
           results[siteIndex].highlyEngaged[rowMonth] += row.count;
           break;
         default:
           break;
       }

     }
   }

   // Calculate the averages in percentages
   // Go through each teacher
   for(var resultsIndex in results)
   {
     var result = results[resultsIndex];

     // Go through the months
     for(var i = 0; i < 12; i++)
     {
       var tempTotalInstructions = result.totalInstructions[i];

       result.offTaskAverage[i] = result.offTask[i] > 0 ? (result.offTask[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.mildlyEngagedAverage[i] = result.mildlyEngaged[i] > 0 ? (result.mildlyEngaged[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.engagedAverage[i] = result.engaged[i] > 0 ? (result.engaged[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.highlyEngagedAverage[i] = result.highlyEngaged[i] > 0 ? (result.highlyEngaged[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

     }
   }

   return results;

 }




  /*
   * Listening to Children
   */
 calculateListeningToChildrenTrends = (data, sites, startDate, endDate) => {

   // Initialize the array that will hold all the data
   var results = {};

   var totalIntervals = 0;

   // Get start month and year
   const startMonth = startDate.getMonth();

   const endMonth = endDate.getMonth();

   // Add each teacher to the object
   var tempName = "";
   for(var siteIndex in sites)
   {

     tempName = "";

     results[siteIndex] = {
       name: tempName,
       eyeLevel: new Array(12).fill(0),
       positiveExpression: new Array(12).fill(0),
       repeats: new Array(12).fill(0),
       openEndedQuestions: new Array(12).fill(0),
       extendsPlay: new Array(12).fill(0),
       encouragesPeerTalk: new Array(12).fill(0),

       encouraging: new Array(12).fill(0),
       noBehaviors: new Array(12).fill(0),

       totalInstructions: new Array(12).fill(0),
       totalObserved: new Array(12).fill(0),


       eyeLevelAverage: new Array(12).fill(0),
       positiveExpressionAverage: new Array(12).fill(0),
       repeatsAverage: new Array(12).fill(0),
       openEndedQuestionsAverage: new Array(12).fill(0),
       extendsPlayAverage: new Array(12).fill(0),
       encouragesPeerTalkAverage: new Array(12).fill(0),

       encouragingAverage: new Array(12).fill(0),
       noBehaviorsAverage: new Array(12).fill(0),

       totalInstructionsAverage: new Array(12).fill(0),
       totalObservedAverage: new Array(12).fill(0),

     };

   }


   // Get number of instances for each type of data
   var tempIntervalData = 0;

   for(var siteIndex in sites)
   {
     for(var rowIndex in sites[siteIndex])
     {
       var row = sites[siteIndex][rowIndex];



       var rowMonth = new Date(row.startDate).getMonth();

       // Add to behavior types
       results[siteIndex].eyeLevel[rowMonth] += row.listening1;
       results[siteIndex].positiveExpression[rowMonth] += row.listening2;
       results[siteIndex].repeats[rowMonth] += row.listening3;
       results[siteIndex].openEndedQuestions[rowMonth] += row.listening4;
       results[siteIndex].extendsPlay[rowMonth] += row.listening5;
       results[siteIndex].encouragesPeerTalk[rowMonth] += row.listening6;

       results[siteIndex].noBehaviors[rowMonth] += row.listening7;
       results[siteIndex].encouraging[rowMonth] += row.count - row.listening7;

       // Calculate the total Number of instructions
       results[siteIndex].totalInstructions[rowMonth] += row.listening1 + row.listening2 + row.listening3 + row.listening4 + row.listening5 + row.listening6 + row.listening7;

       // Calculate total number of observations
       results[siteIndex].totalObserved[rowMonth] += row.count;

     }
   }
   // Calculate the averages in percentages
   // Go through each teacher
   for(var resultsIndex in results)
   {
     var result = results[resultsIndex];

     // Go through the months
     for(var i = 0; i < 12; i++)
     {
       var tempTotalInstructions = result.totalInstructions[i];
       var tempTotalObserved = result.totalObserved[i];

       result.eyeLevelAverage[i] = result.eyeLevel[i] > 0 ? (result.eyeLevel[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.positiveExpressionAverage[i] = result.positiveExpression[i] > 0 ? (result.positiveExpression[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.repeatsAverage[i] = result.repeats[i] > 0 ? (result.repeats[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.openEndedQuestionsAverage[i] = result.openEndedQuestions[i] > 0 ? (result.openEndedQuestions[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.extendsPlayAverage[i] = result.extendsPlay[i] > 0 ? (result.extendsPlay[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
       result.encouragesPeerTalkAverage[i] = result.encouragesPeerTalk[i] > 0 ? (result.encouragesPeerTalk[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

       result.noBehaviorsAverage[i] = result.noBehaviors[i] > 0 ? (result.noBehaviors[i] / tempTotalObserved).toFixed(2) * 100 : 0;
       result.encouragingAverage[i] = result.encouraging[i] > 0 ? (result.encouraging[i] / tempTotalObserved).toFixed(2) * 100 : 0;

     }
   }

   return results;

 }



 /*
  * Sequential Activities
  */
calculateSequentialActivitiesTrends = (data, sites, startDate, endDate) => {

  // Initialize the array that will hold all the data
  var results = {};

  var totalIntervals = 0;

  // Get start month and year
  const startMonth = startDate.getMonth();

  const endMonth = endDate.getMonth();

  // Add each teacher to the object
  var tempName = "";
  for(var siteIndex in sites)
  {

    tempName = "";

    results[siteIndex] = {
      name: tempName,
      totalInstructions: new Array(12).fill(0),
      sequentialActivities: new Array(12).fill(0),
      drawImages: new Array(12).fill(0),
      demonstrateSteps: new Array(12).fill(0),
      actOut: new Array(12).fill(0),

      notAtCenter: new Array(12).fill(0),
      noSupport: new Array(12).fill(0),
      support: new Array(12).fill(0),

      totalInstructionsAverage: new Array(12).fill(0),
      sequentialActivitiesAverage: new Array(12).fill(0),
      drawImagesAverage: new Array(12).fill(0),
      demonstrateStepsAverage: new Array(12).fill(0),
      actOutAverage: new Array(12).fill(0),

      notAtCenterAverage: new Array(12).fill(0),
      noSupportAverage: new Array(12).fill(0),
      supportAverage: new Array(12).fill(0),
    };

  }


  // Get number of instances for each type of data
  var tempIntervalData = 0;

  for(var siteIndex in sites)
  {
    for(var rowIndex in sites[siteIndex])
    {
      var row = sites[siteIndex][rowIndex];



      var rowMonth = new Date(row.timestamp).getMonth();

      // Add to total # of intervals
      results[siteIndex].totalInstructions[rowMonth] += row.notAtCenter + row.support + row.noSupport;

      // Add to behavior types
      results[siteIndex].sequentialActivities[rowMonth] += row.sequentialActivities;
      results[siteIndex].drawImages[rowMonth] += row.drawImages;
      results[siteIndex].demonstrateSteps[rowMonth] += row.demonstrateSteps;
      results[siteIndex].actOut[rowMonth] += row.actOut;

      results[siteIndex].notAtCenter[rowMonth] += row.notAtCenter;
      results[siteIndex].support[rowMonth] += row.support;
      results[siteIndex].noSupport[rowMonth] += row.noSupport;
    }
  }

  // Calculate the averages in percentages
  // Go through each teacher
  for(var resultsIndex in results)
  {
    var result = results[resultsIndex];

    // Go through the months
    for(var i = 0; i < 12; i++)
    {
      var tempTotalInstructions = result.totalInstructions[i];

      result.sequentialActivitiesAverage[i] = result.sequentialActivities[i] > 0 ? (result.sequentialActivities[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
      result.drawImagesAverage[i] = result.drawImages[i] > 0 ? (result.drawImages[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
      result.demonstrateStepsAverage[i] = result.demonstrateSteps[i] > 0 ? (result.demonstrateSteps[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
      result.actOutAverage[i] = result.actOut[i] > 0 ? (result.actOut[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

      result.notAtCenterAverage[i] = result.notAtCenter[i] > 0 ? (result.notAtCenter[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
      result.supportAverage[i] = result.support[i] > 0 ? (result.support[i] / tempTotalInstructions).toFixed(2) * 100 : 0;
      result.noSupportAverage[i] = result.noSupport[i] > 0 ? (result.noSupport[i] / tempTotalInstructions).toFixed(2) * 100 : 0;

    }
  }

  return results;

}




/*
 * Foundational Skills
 */
calculateFoundationalSkillsTrends = (data, sites, startDate, endDate) => {

  // Initialize the array that will hold all the data
  var results = {};

  var totalIntervals = 0;

  // Get start month and year
  const startMonth = startDate.getMonth();

  const endMonth = endDate.getMonth();

  // Add each teacher to the object
  var tempName = "";
  for(var siteIndex in sites)
  {

    tempName = "";

    results[siteIndex] = {
      name: tempName,
      totalIntervals: new Array(12).fill(0),
      totalInstructions: new Array(12).fill(0),
      phonological: new Array(12).fill(0),
      alphabetic: new Array(12).fill(0),
      openEndedQuestions: new Array(12).fill(0),
      realisticReading: new Array(12).fill(0),
      multimodalInstruction: new Array(12).fill(0),
      foundationalSkills: new Array(12).fill(0),

      phonologicalAverage: new Array(12).fill(0),
      alphabeticAverage: new Array(12).fill(0),
      openEndedQuestionsAverage: new Array(12).fill(0),
      realisticReadingAverage: new Array(12).fill(0),
      multimodalInstructionAverage: new Array(12).fill(0),
      foundationalSkillsAverage: new Array(12).fill(0),
    };

  }





  for(var siteIndex in sites)
  {
    // Sort by date just in case
    sites[siteIndex].sort(function(a,b){
      return new Date(b.GroupDate.value) - new Date(a.GroupDate.value);
    });


    // Get number of instances for each type of data
    var tempIntervalData = 0;
    var prevMonth = 0, rowMonth = startMonth;

    for(var rowIndex in sites[siteIndex])
    {
      var row = sites[siteIndex][rowIndex];



      rowMonth = new Date(row.GroupDate.value).getMonth();

      // Add to total # of intervals
      results[siteIndex].totalIntervals[rowMonth]++;

      // Add to behavior types

      // If this observation has a phonal answer.
      if(row.foundational1 || row.foundational2)
      {
        results[siteIndex].phonological[rowMonth]++;
      }
      // If this observation has a alphabetic answer
      if(row.foundational3 || row.foundational4 || row.foundational5 || row.foundational6 || row.foundational7)
      {
        results[siteIndex].alphabetic[rowMonth]++;
      }
      // If this observation has a open ended question
      if(row.foundational8)
      {
        results[siteIndex].openEndedQuestions[rowMonth]++;
      }
      // If this observation has a realistic Reading
      if(row.foundational9)
      {
        results[siteIndex].realisticReading[rowMonth]++;
      }
      // If this observation has a Multi Modal
      if(row.foundational10)
      {
        results[siteIndex].multimodalInstruction[rowMonth]++;
      }
      // If this observation has anything
      if(!row.foundational11)
      {
        results[siteIndex].foundationalSkills[rowMonth]++;
      }


      // Calculate the total Number of instructions
      results[siteIndex].totalInstructions[rowMonth] += row.foundational1 + row.foundational2 + row.foundational3 + row.foundational4 + row.foundational5 + row.foundational6 + row.foundational7 + row.foundational8 + row.foundational9 + row.foundational10;
    }
  }

  // Calculate the averages in percentages
  // Go through each teacher
  for(var resultsIndex in results)
  {
    var result = results[resultsIndex];

    // Go through the months
    for(var i = 0; i < 12; i++)
    {
      var tempTotalInstructions = result.totalInstructions[i];
      var tempTotalIntervals = result.totalIntervals[i];

      result.phonologicalAverage[i] = result.phonological[i] > 0 ? (result.phonological[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.alphabeticAverage[i] = result.alphabetic[i] > 0 ? (result.alphabetic[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.openEndedQuestionsAverage[i] = result.openEndedQuestions[i] > 0 ? (result.openEndedQuestions[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.realisticReadingAverage[i] = result.realisticReading[i] > 0 ? (result.realisticReading[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.multimodalInstructionAverage[i] = result.multimodalInstruction[i] > 0 ? (result.multimodalInstruction[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

      // THIS ONE ISN'T RIGHT FOR NOW
      result.foundationalSkillsAverage[i] = result.foundationalSkills[i] > 0 ? (result.foundationalSkills[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

    }
  }

  return results;

}




/*
 * Writing Skills
 */
calculateWritingSkillsTrends = (data, sites, startDate, endDate) => {

  // Initialize the array that will hold all the data
  var results = {};

  var totalIntervals = 0;

  // Get start month and year
  const startMonth = startDate.getMonth();

  const endMonth = endDate.getMonth();

  // Add each teacher to the object
  var tempName = "";
  for(var siteIndex in sites)
  {

    tempName = "";

    results[siteIndex] = {
      name: tempName,
      totalIntervals: new Array(12).fill(0),
      totalInstructions: new Array(12).fill(0),
      writingSkills: new Array(12).fill(0),
      meaning: new Array(12).fill(0),
      printProcesses: new Array(12).fill(0),


      writingSkillsAverage: new Array(12).fill(0),
      meaningAverage: new Array(12).fill(0),
      printProcessesAverage: new Array(12).fill(0),

    };

  }





  for(var siteIndex in sites)
  {
    // Sort by date just in case
    sites[siteIndex].sort(function(a,b){
      return new Date(b.GroupDate.value) - new Date(a.GroupDate.value);
    });


    // Get number of instances for each type of data
    var tempIntervalData = 0;
    var prevMonth = 0, rowMonth = startMonth;

    for(var rowIndex in sites[siteIndex])
    {
      var row = sites[siteIndex][rowIndex];



      rowMonth = new Date(row.GroupDate.value).getMonth();

      // Add to total # of intervals
      results[siteIndex].totalIntervals[rowMonth]++;

      // Add to behavior types
      // Count each observation interval that has a meaning in it.
      if(row.writing1 || row.writing2)
      {
        results[siteIndex].meaning[rowMonth]++;
      }
      // Count each observation interval that has a Print Process in it
      if(row.writing3 || row.writing4 || row.writing5 || row.writing6 || row.writing7 || row.writing8)
      {
        results[siteIndex].printProcesses[rowMonth]++;
      }

      // Count each observation interval that has anything in it
      if(!row.writing9)
      {
        results[siteIndex].writingSkills[rowMonth]++;
      }

      // Calculate the total Number of instructions
      results[siteIndex].totalInstructions[rowMonth] += row.writing1 + row.writing2 + row.writing3 + row.writing4 + row.writing5 + row.writing6 + row.writing7 + row.writing8;
    }
  }

  // Calculate the averages in percentages
  // Go through each teacher
  for(var resultsIndex in results)
  {
    var result = results[resultsIndex];

    // Go through the months
    for(var i = 0; i < 12; i++)
    {
      var tempTotalInstructions = result.totalInstructions[i];
      var tempTotalIntervals = result.totalIntervals[i];

      result.meaningAverage[i] = result.meaning[i] > 0 ? (result.meaning[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.printProcessesAverage[i] = result.printProcesses[i] > 0 ? (result.printProcesses[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

      // THIS ONE ISN'T RIGHT FOR NOW
      result.writingSkillsAverage[i] = result.writingSkills[i] > 0 ? (result.writingSkills[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

    }
  }

  return results;

}



/*
 * Book Reading
 */
calculateBookReadingTrends = (data, sites, startDate, endDate) => {

  // Initialize the array that will hold all the data
  var results = {};

  var totalIntervals = 0;

  // Get start month and year
  const startMonth = startDate.getMonth();

  const endMonth = endDate.getMonth();

  // Add each teacher to the object
  var tempName = "";
  for(var siteIndex in sites)
  {

    tempName = "";

    results[siteIndex] = {
      name: tempName,
      totalIntervals: new Array(12).fill(0),
      totalInstructions: new Array(12).fill(0),
      bookReading: new Array(12).fill(0),
      vocabFocus: new Array(12).fill(0),
      languageConnections: new Array(12).fill(0),
      childrenSupport: new Array(12).fill(0),
      fairnessDiscussions: new Array(12).fill(0),
      multimodalInstruction: new Array(12).fill(0),

      vocabFocusAverage: new Array(12).fill(0),
      languageConnectionsAverage: new Array(12).fill(0),
      childrenSupportAverage: new Array(12).fill(0),
      fairnessDiscussionsAverage: new Array(12).fill(0),
      multimodalInstructionAverage: new Array(12).fill(0),
      bookReadingAverage: new Array(12).fill(0),
    };

  }




  for(var siteIndex in sites)
  {

    // Sort by date just in case
    sites[siteIndex].sort(function(a,b){
      return new Date(b.GroupDate.value) - new Date(a.GroupDate.value);
    });


    // Get number of instances for each type of data
    var tempIntervalData = 0;
    var prevMonth = 0, rowMonth = startMonth;


    for(var rowIndex in sites[siteIndex])
    {
      var row = sites[siteIndex][rowIndex];



      rowMonth = new Date(row.GroupDate.value).getMonth();

      // Add to total # of intervals
      results[siteIndex].totalIntervals[rowMonth]++;

      // Add to behavior types
      // Calculate the total Number of instructions
      results[siteIndex].totalInstructions[rowMonth] += row.literacy1 + row.literacy2 + row.literacy3 + row.literacy4 + row.literacy5 + row.literacy6 + row.literacy7 + row.literacy8 + row.literacy9 + row.literacy10;

      // If there were any vocabanswers in this observation
      if( row.literacy1 || row.literacy2 || row.literacy3 )
      {
        results[siteIndex].vocabFocus[rowMonth]++;
      }
      // If there were any Language Connection answers in this observation
      if( row.literacy4 || row.literacy5 )
      {
        results[siteIndex].languageConnections[rowMonth]++;
      }
      // If there were any Children Support answers in this observation
      if( row.literacy6 || row.literacy7 || row.literacy8 )
      {
        results[siteIndex].childrenSupport[rowMonth]++;
      }
      // If there were any Fairness Discussion answers in this observation
      if( row.literacy9 )
      {
        results[siteIndex].fairnessDiscussions[rowMonth]++;
      }
      // If there were any Fairness Discussion answers in this observation
      if( row.literacy10 )
      {
        results[siteIndex].multimodalInstruction[rowMonth]++;
      }
      // If there were any answers in this observation
      if( !row.literacy11 )
      {
        results[siteIndex].bookReading[rowMonth]++;
      }

    }
  }

  // Calculate the averages in percentages
  // Go through each teacher
  for(var resultsIndex in results)
  {
    var result = results[resultsIndex];

    // Go through the months
    for(var i = 0; i < 12; i++)
    {
      var tempTotalInstructions = result.totalInstructions[i];
      var tempTotalIntervals = result.totalIntervals[i];

      result.vocabFocusAverage[i] = result.vocabFocus[i] > 0 ? (result.vocabFocus[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.languageConnectionsAverage[i] = result.languageConnections[i] > 0 ? (result.languageConnections[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.childrenSupportAverage[i] = result.childrenSupport[i] > 0 ? (result.childrenSupport[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.fairnessDiscussionsAverage[i] = result.fairnessDiscussions[i] > 0 ? (result.fairnessDiscussions[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
      result.multimodalInstructionAverage[i] = result.multimodalInstruction[i] > 0 ? (result.multimodalInstruction[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

      result.bookReadingAverage[i] = result.bookReading[i] > 0 ? (result.bookReading[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

    }
  }

  return results;

}



  /*
   * Language Environment
   */
  calculateLanguageEnvironmentTrends = (data, sites, startDate, endDate) => {

    // Initialize the array that will hold all the data
    var results = {};

    var totalIntervals = 0;

    // Get start month and year
    const startMonth = startDate.getMonth();

    const endMonth = endDate.getMonth();

    // Add each teacher to the object
    var tempName = "";
    for(var siteIndex in sites)
    {

      tempName = "";

      results[siteIndex] = {
        name: tempName,
        totalIntervals: new Array(12).fill(0),
        totalInstructions: new Array(12).fill(0),
        languageEnvironment: new Array(12).fill(0),
        talk: new Array(12).fill(0),
        encourageChildren: new Array(12).fill(0),
        respondChildren: new Array(12).fill(0),


        languageEnvironmentAverage: new Array(12).fill(0),
        talkAverage: new Array(12).fill(0),
        encourageChildrenAverage: new Array(12).fill(0),
        respondChildrenAverage: new Array(12).fill(0),

      };

    }





    for(var siteIndex in sites)
    {

      // Sort by date just in case
      sites[siteIndex].sort(function(a,b){
        return new Date(b.GroupDate.value) - new Date(a.GroupDate.value);
      });


      // Get number of instances for each type of data
      var tempIntervalData = 0;
      var prevMonth = 0, rowMonth = startMonth;

      for(var rowIndex in sites[siteIndex])
      {
        var row = sites[siteIndex][rowIndex];



        rowMonth = new Date(row.GroupDate.value).getMonth();

        // Add to total # of intervals
        results[siteIndex].totalIntervals[rowMonth]++;

        // Add to behavior types

        // Calculate the total Number of instructions
        results[siteIndex].totalInstructions[rowMonth] += row.literacy1 + row.literacy2 + row.literacy3 + row.literacy4 + row.literacy5 + row.literacy6 + row.literacy7;


        // If there were any "Talk with children about vocabulary or social-emotional topics" in this observation
        if( row.literacy1 || row.literacy2)
        {
          results[siteIndex].talk[rowMonth]++;
        }
        // If there were any "Encourage Children to talk" answers in this observation
        if( row.literacy3 || row.literacy4 || row.literacy5 )
        {
          results[siteIndex].encourageChildren[rowMonth]++;
        }
        // If there were any "Respond to children" answers in this observation
        if( row.literacy6 || row.literacy7 || row.literacy8 )
        {
          results[siteIndex].respondChildren[rowMonth]++;
        }

        // If there were any answers in this observation
        if( !row.literacy9 )
        {
          results[siteIndex].languageEnvironment[rowMonth]++;
        }
      }
    }

    // Calculate the averages in percentages
    // Go through each teacher
    for(var resultsIndex in results)
    {
      var result = results[resultsIndex];

      // Go through the months
      for(var i = 0; i < 12; i++)
      {
        var tempTotalInstructions = result.totalInstructions[i];
        var tempTotalIntervals = result.totalIntervals[i];

        result.talkAverage[i] = result.talk[i] > 0 ? (result.talk[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.encourageChildrenAverage[i] = result.encourageChildren[i] > 0 ? (result.encourageChildren[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.respondChildrenAverage[i] = result.respondChildren[i] > 0 ? (result.respondChildren[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

        result.languageEnvironmentAverage[i] = result.languageEnvironment[i] > 0 ? (result.languageEnvironment[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

      }
    }

    return results;

  }


  /*
   * Language Environment
   */
  calculateACTrends = (data, sites, startDate, endDate) => {

    // Initialize the array that will hold all the data
    var results = {};

    // Get start month and year
    const startMonth = startDate.getMonth();

    const endMonth = endDate.getMonth();

    // Add each teacher to the object
    var tempName = "";
    for(var siteIndex in sites)
    {

      tempName = "";

      results[siteIndex] = {
        name: tempName,
        totalIntervals: new Array(12).fill(0),
        totalInstructions: new Array(12).fill(0),

        childrensPlay: new Array(12).fill(0),
        askingQuestions: new Array(12).fill(0),
        encouragingChildren: new Array(12).fill(0),
        helpingChildren: new Array(12).fill(0),

        support: new Array(12).fill(0),
        noSupport: new Array(12).fill(0),
        notAtCenter: new Array(12).fill(0),


        childrensPlayAverage: new Array(12).fill(0),
        askingQuestionsAverage: new Array(12).fill(0),
        encouragingChildrenAverage: new Array(12).fill(0),
        helpingChildrenAverage: new Array(12).fill(0),

        supportAverage: new Array(12).fill(0),
        noSupportAverage: new Array(12).fill(0),
        notAtCenterAverage: new Array(12).fill(0),

      };

    }


    for(var siteIndex in sites)
    {

      // Sort by date just in case
      sites[siteIndex].sort(function(a,b){
        return new Date(b.GroupDate.value) - new Date(a.GroupDate.value);
      });


      // Get number of instances for each type of data
      var tempIntervalData = 0;
      var prevMonth = 0, rowMonth = startMonth;

      for(var rowIndex in sites[siteIndex])
      {
        var row = sites[siteIndex][rowIndex];



        rowMonth = new Date(row.GroupDate.value).getMonth();

        // Add to total # of intervals
        results[siteIndex].totalIntervals[rowMonth]++;

        // Add to behavior types

        // Calculate the total Number of instructions
        results[siteIndex].totalInstructions[rowMonth] += row.literacy1 + row.literacy2 + row.literacy3 + row.literacy4 + row.literacy5 + row.literacy6 + row.literacy7;


        // If there were any "Participating in children's play" in this observation
        if( row.teacher1 )
        {
          results[siteIndex].childrensPlay[rowMonth]++;
        }
        // If there were any "Asking questions to extend children's thinking about their shared activity" answers in this observation
        if( row.teacher2 )
        {
          results[siteIndex].askingQuestions[rowMonth]++;
        }
        // If there were any "Encouraging children to share, work, or interact with each other" answers in this observation
        if( row.teacher3 )
        {
          results[siteIndex].encouragingChildren[rowMonth]++;
        }
        // If there were any "Encouraging children to share, work, or interact with each other" answers in this observation
        if( row.teacher4 )
        {
          results[siteIndex].helpingChildren[rowMonth]++;
        }

        // Check for act types
        // If teacher was there
        if(row.peopleType == 3)
        {
          // Check for support
          if(row.teacher1 || row.teacher2 || row.teacher3 || row.teacher4)
          {
            results[siteIndex].support[rowMonth]++;
          }
          // If there was no support
          else
          {
            results[siteIndex].noSupport[rowMonth]++;
          }
        }
        // Teacher not there
        else
        {
          results[siteIndex].notAtCenter[rowMonth]++;
        }
      }
    }

    // Calculate the averages in percentages
    // Go through each teacher
    for(var resultsIndex in results)
    {
      var result = results[resultsIndex];

      // Go through the months
      for(var i = 0; i < 12; i++)
      {
        var tempTotalInstructions = result.totalInstructions[i];
        var tempTotalIntervals = result.totalIntervals[i];

        result.childrensPlayAverage[i] = result.childrensPlay[i] > 0 ? (result.childrensPlay[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.askingQuestionsAverage[i] = result.askingQuestions[i] > 0 ? (result.askingQuestions[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.encouragingChildrenAverage[i] = result.encouragingChildren[i] > 0 ? (result.encouragingChildren[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.helpingChildrenAverage[i] = result.helpingChildren[i] > 0 ? (result.helpingChildren[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

        result.supportAverage[i] = result.support[i] > 0 ? (result.support[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.noSupportAverage[i] = result.noSupport[i] > 0 ? (result.noSupport[i] / tempTotalIntervals).toFixed(2) * 100 : 0;
        result.notAtCenterAverage[i] = result.notAtCenter[i] > 0 ? (result.notAtCenter[i] / tempTotalIntervals).toFixed(2) * 100 : 0;

      }
    }

    return results;

  }




}


export default TrendData;
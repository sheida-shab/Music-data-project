// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import {
  countUsers,
  userHistory,
  findTheMost,
  filterFridayNightSongs,
  findLongestStreak,
  findEverydayListenedSong,
  findTopGenres,
} from "./common.mjs";
import { getUserIDs, getQuestions, getListenEvents } from "./data.mjs";


window.onload = function () {
  //document.querySelector("body").innerText = `There are ${countUsers()} users`;
  const userSelect=document.createElement("select");
  const userLabel=document.createElement("label");
  const defaultOption=document.createElement("option");
  
  userSelect.id = "userSelect";
  userLabel.setAttribute("for",'userSelect');
  defaultOption.value='';
  defaultOption.textContent='Please select a user :'

  
  document.body.appendChild(userLabel);
  document.body.appendChild(userSelect);
  userSelect.appendChild(defaultOption);

  //Adding user select list options
  const userIDs=getUserIDs();//get array of userid
  
  userIDs.forEach((id) => {
     const userOption=document.createElement("option");
     userOption.value=id;
     userOption.textContent=`User ${id}`;
     userSelect.appendChild(userOption);

  });

  //Adding userHistory Section to present details(questions and answers)
  userSelect.addEventListener("change",(event)=>{
    // Get all listen events for the selected user
    const selectedUserEvents = getListenEvents(event.target.value);

    // Remove any existing <dl> or message <p> from previous selections
    const oldDL = document.querySelector("dl");
    if (oldDL) oldDL.remove();
    const oldMsg = document.querySelector("p");
    if (oldMsg) oldMsg.remove();

    // If user has no listening history, show a message and stop
    if (selectedUserEvents.length === 0) {
      const message = document.createElement("p");
      message.textContent = "This user has no listening history.";
      document.body.appendChild(message);
      return;
    }

    // Get user history and find 'most listened' information
    const selectedUserHistory = userHistory(selectedUserEvents);
    const selectedUserMost = findTheMost(selectedUserHistory);

    // Create a description list to display questions and answers
    const descriptionList = document.createElement("dl");

    // Map technical keys to actual question IDs using getQuestions()
    const questionMap = {
      mostListenedByCount: "Q1",
      mostListenedByTime: "Q2",
      mostListenedArtistByCount: "Q3",
      mostListenedArtistByTime: "Q4",
      mostListenedByCountOnFridayNight: "Q5",
      mostListenedByTimeOnFridayNight: "Q6",
    };

    // --- First,add all-week data ---
    Object.entries(selectedUserMost).forEach(([key, value]) => {
      const questionDT = document.createElement("dt");
      // If the key exists in questionMap, use getQuestions() to get the question text
      if (questionMap[key]) {
        questionDT.textContent = getQuestions(questionMap[key]);
      } else {
        // Otherwise, display the key name
        questionDT.textContent = key;
      }

      const answerDD = document.createElement("dd");
      answerDD.textContent = value;
      descriptionList.appendChild(questionDT);
      descriptionList.appendChild(answerDD);
    });
    // --- Then,add Friday night data ---
    const selectedUserFridayEvents = filterFridayNightSongs(selectedUserEvents);
    if (selectedUserFridayEvents.length > 0) {
      // Get user friday nights history and find 'most listened' information
      const selectedUserFridayHistory = userHistory(selectedUserFridayEvents);
      const selectedUserFridayMost = findTheMost(selectedUserFridayHistory);

      const fridayQuestionMap = {
        mostListenedByCount: "Q5",
        mostListenedByTime: "Q6",
      };

      Object.entries(selectedUserFridayMost).forEach(([key, value]) => {
        if (fridayQuestionMap[key]) {
          const fridayDT = document.createElement("dt");
          fridayDT.textContent = getQuestions(fridayQuestionMap[key]);
          const fridayDD = document.createElement("dd");
          fridayDD.textContent = value;
          descriptionList.appendChild(fridayDT);
          descriptionList.appendChild(fridayDD);
        }
      });
    }

    //get longest streak info
    const longestStreakInfo = findLongestStreak(selectedUserEvents);

    // Create question (dt)
    const longestDT = document.createElement("dt");
    longestDT.textContent = getQuestions("Q7");

    // Create answer (dd)
    const longestDD = document.createElement("dd");
    longestDD.textContent = `${longestStreakInfo.artist} - ${longestStreakInfo.title} (length: ${longestStreakInfo.count})`;

    // Add both to the description list
    descriptionList.appendChild(longestDT);
    descriptionList.appendChild(longestDD);

    //Get songs the user listened to every day
    const everydaySongs = findEverydayListenedSong(selectedUserEvents);

    if(everydaySongs.length>0){
      // Create question (dt)
      const everydayDT = document.createElement("dt");
      everydayDT.textContent = getQuestions("Q8");

      // Create answer (dd)
      const everydayDD = document.createElement("dt");
      everydayDD.textContent = everydaySongs.join(", ");

      // Add both to the description list
      descriptionList.appendChild(everydayDT);
      descriptionList.appendChild(everydayDD);
    }

    document.body.appendChild(descriptionList);
  });    
    

  console.log(getQuestions);
  console.log(getListenEvents("1"));
  console.log(userHistory((getListenEvents("1"))));
  console.log(findTopGenres(userHistory((getListenEvents("1")))));


};

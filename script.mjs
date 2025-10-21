// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { countUsers, userHistory, findTheMost } from "./common.mjs";
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
   const selectedUserEvents=getListenEvents(event.target.value);//return a key-value array of objects which represents selected user listened songs detail
  
   //clear previous user outputs in page
   const oldDL = document.querySelector("dl");
   if (oldDL) oldDL.remove();
   const oldMsg = document.querySelector("p");
   if (oldMsg) oldMsg.remove();
   
   //checking user history is  empty
   if(selectedUserEvents.length===0){
        const message=document.createElement("p");
        message.textContent = "This user has no listening history.";
        document.body.appendChild(message);
        return;
      }
  //if user history is not empty build the description list

    const selectedUserHistory=userHistory(selectedUserEvents);//return a value-key array of objects(map structure) grouped by songID
    const selectedUserMost=findTheMost(selectedUserHistory);//return an object contains the answer of first 4 questions
    const descriptionList=document.createElement("dl");//create description list to show key-value (question and answer)


    Object.entries(selectedUserMost).forEach(([key,value])=>{
      const questionDT = document.createElement("dt");
      questionDT.textContent = key;
      const answerDD = document.createElement("dd");
      answerDD.textContent = value;
      descriptionList.appendChild(questionDT);
      descriptionList.appendChild(answerDD);

    });

    document.body.appendChild(descriptionList);
    });    
    

   // console.log(getQuestions);
  // console.log(getListenEvents("1"));
  // console.log(userHistory(getListenEvents("1")));
   console.log(findTheMost(userHistory(getListenEvents("1"))));


};

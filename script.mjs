// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { countUsers, userHistory } from "./common.mjs";
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
  console.log(userIDs);
  userIDs.forEach((id) => {
     const userOption=document.createElement("option");
     userOption.value=id;
     userOption.textContent=`User ${id}`;
     userSelect.appendChild(userOption);

  });

  console.log(getQuestions);
  console.log(getListenEvents("1"));
  console.log(userHistory(getListenEvents("1")));


};

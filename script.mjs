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

  // --- Create the user selection dropdown ---
  const userSelect = document.createElement("select");
  const userLabel = document.createElement("label");
  const defaultOption = document.createElement("option");

  userSelect.id = "userSelect";
  userLabel.setAttribute("for", "userSelect");
  userLabel.textContent = "Please select a user :    ";
  defaultOption.value = "";
  defaultOption.textContent = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  document.body.appendChild(userLabel);
  document.body.appendChild(userSelect);
  userSelect.appendChild(defaultOption);

  // --- Populate the user dropdown with user IDs ---
  const userIDs = getUserIDs(); //get array of userid

  userIDs.forEach((id) => {
    const userOption = document.createElement("option");
    userOption.value = id;
    userOption.textContent = `User ${id}`;
    userSelect.appendChild(userOption);
  });

  //Adding userHistory Section to present details(questions and answers)
  // --- Add event listener for when a user is selected ---
  userSelect.addEventListener("change", (event) => {
    // Get all listen events for the selected user
    const selectedUserEvents = getListenEvents(event.target.value);

    // Remove any existing <dl> or message <p> from previous selections
    const oldDL = document.querySelector("dl");
    if (oldDL) oldDL.remove();
    const oldMsg = document.querySelector("p");
    if (oldMsg) oldMsg.remove();

    // --- Handle users with no listening history ---
    if (selectedUserEvents.length === 0) {
      const message = document.createElement("p");
      message.textContent = "This user has no listening history.";
      document.body.appendChild(message);
      return;
    }

    // --- Compute general listening statistics ---
    // Get user history and find 'most listened' information
    const selectedUserHistory = userHistory(selectedUserEvents);
    const selectedUserMost = findTheMost(selectedUserHistory);

    // Create a description list to display questions and answers
    const descriptionList = document.createElement("dl");

    // Map function result keys to question IDs from getQuestions()
    const questionMap = {
      mostListenedByCount: "Q1",
      mostListenedByTime: "Q2",
      mostListenedArtistByCount: "Q3",
      mostListenedArtistByTime: "Q4",
      mostListenedByCountOnFridayNight: "Q5",
      mostListenedByTimeOnFridayNight: "Q6",
    };

    // --- Add general listening data (all days) ---
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

    // --- add Friday night data ---
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

    // --- Find the longest streak (same song played consecutively) ---
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

    // --- Find songs the user listened to every day ---
    const everydaySongs = findEverydayListenedSong(selectedUserEvents);

    if (everydaySongs.length > 0) {
      // Create question (dt)
      const everydayDT = document.createElement("dt");
      everydayDT.textContent = getQuestions("Q8");

      // Create answer (dd)
      const everydayDD = document.createElement("dd");
      everydayDD.textContent = everydaySongs.join(", ");

      // Add both to the description list
      descriptionList.appendChild(everydayDT);
      descriptionList.appendChild(everydayDD);
    }

    // --- Find top genres by number of listens ---
    const topGenres = findTopGenres(selectedUserHistory);
    const topGenresNumber = topGenres.length;
    if (topGenresNumber > 0) {
      // Create question (dt)
      const genreDT = document.createElement("dt");
      genreDT.textContent = `>>What were the user’s top ${topGenresNumber} genre${
        topGenresNumber > 1 ? "s" : ""
      }  to listen to by number of listens?`;

      const genreDD = document.createElement("dd");
      genreDD.textContent = topGenres.join(", ");

      // Add both to the description list
      descriptionList.appendChild(genreDT);
      descriptionList.appendChild(genreDD);
    }
    
    // --- Finally, add the description list to the document ---
    document.body.appendChild(descriptionList);
  });

  // ========================== DEMO OUTPUTS  ======================================
  // Each console.log below shows sample outputs for key functions.
  // Helps demonstrate expected behavior and verify logic in the browser console.
  // ================================================================================

  console.log(
    "getListenEvents function  output for user1:",
    getListenEvents("1")
  ); // all songs listened by user 1

  // userHistory : show a summary for user 1: group by each song with detail:total count , total time , artist name , song title, genre
  console.log(
    "userHistory function  output for user1:",
    userHistory(getListenEvents("1"))
  );

  //findTheMost : show the most listened by a user both in terms of count and total time group by artist and song
  console.log(
    "findTheMost function  output for user1:",
    findTheMost(userHistory(getListenEvents("1")))
  );

  //filterFridayNightSongs : filter friday nights from all songs listened by user 1
  console.log(
    "filterFridayNightSongs function  output for user1:",
    filterFridayNightSongs(getListenEvents("1"))
  );

  //findLongestStreak : show the longest streak details (an object) :
  //i.e : {song_id: 'song-1', title: 'I Got Love', artist: 'The King Blues', count: 34}
  console.log(
    "findLongestStreak function  output for user1:",
    findLongestStreak(getListenEvents("1"))
  );

  // findEverydayListenedSong output is an array with "artist - title" format
  // i.e : ['Frank Turner-Photosynthesis', 'The Divine Comedy-Tonight We Fly']
  console.log(
    "findEverydayListenedSong function  output for user2:",
    findEverydayListenedSong(getListenEvents("2"))
  );

  //show top 3 genres in array format : ['Pop', 'Folk', 'Punk']
  console.log(
    "findTopGenres function  output for user1:",
    findTopGenres(userHistory(getListenEvents("1")))
  );
};

import { getUserIDs } from "./data.mjs";
import { getQuestions, getSong } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

// This function processes all listening events of a user.
// It builds a summary showing for each song:
// → how many times it was listened to (count)
// → total listening time
// → artist name, song title, and genre
export function userHistory(userEvent){
  //A Map is ideal here because each song_id should only appear once as a key
  //Map is used to group each song with its data per user
  const userHistoryMap = new Map();

  userEvent.forEach((event) => {
    //get the previous values (if exist) and update with new data
    const songCount = (userHistoryMap.get(event.song_id)?.count || 0) + 1; //counts how many times the user listened to each song
    const songTime =
      (userHistoryMap.get(event.song_id)?.time || 0) +
      getSong(event.song_id).duration_seconds; //sums up total time listened per song

    //retrieve song info from the data source  
    const artist = getSong(event.song_id).artist;
    const genre = getSong(event.song_id).genre;
    const songTitle = getSong(event.song_id).title;

    // store updated data in Map: song ID as key, and song info as value
    userHistoryMap.set(event.song_id, {
      count: songCount,
      time: songTime,
      artist: artist,
      genre: genre,
      title: songTitle,
    });
  });
  
  //return as an array to make it easier to use Array methods (like map, reduce, etc.)
  return Array.from(userHistoryMap); //convert Map to Array for easier manipulation later
};


 //This function finds which song and which artist
// the user listened to the most — both in terms of count and total time.
export function findTheMost(userHistoryArray){
  if (userHistoryArray.length === 0) {
    return null;
  }
  //Use reduce() to go through every song and compare stats
  const mostListenedSong = userHistoryArray.reduce((max, songData) => {
    const songName = songData[1].title;
    const artistName = songData[1].artist;
    const count = songData[1].count;
    const time = songData[1].time;

    //initialize the structure for comparison(nested object)
    if (!max) {
      return {
        maxCountSongDetail: {
          name: songName,
          count: count,
          artist: artistName,
        },
        maxTimeSongDetail: { name: songName, time: time, artist: artistName },
        artistDetails: {},
      };
    }

    //compare by count: update if this song has been listened more times
    if (count > max.maxCountSongDetail.count) {
      max.maxCountSongDetail = {
        name: songName,
        count: count,
        artist: artistName,
      };
    }

    //compare by total time: update if this song was listened longer
    if (time > max.maxTimeSongDetail.time) {
      max.maxTimeSongDetail = {
        name: songName,
        time: time,
        artist: artistName,
      };
    }

    //accumulate total listens and time for each artist(used later to find top artist)
    if (!max.artistDetails[artistName]) {
      //initializing artist details for artistName
      max.artistDetails[artistName] = { totalCount: 0, totalTime: 0 };
    }
    max.artistDetails[artistName].totalCount += count; //updating counts of played songs for artistName X
    max.artistDetails[artistName].totalTime += time; //updating time of played songs for artistName X

    return max; //a nested object
  }, null);

  //determine which artist has the highest total count and time
  let maxCountArtist = { artist: null, totalCount: 0 }; //declare and initialize variable to store max count for per artist
  let maxTimeArtist = { artist: null, totalTime: 0 }; //declare and initialize variable to store max time for per artist

  for (const artist in mostListenedSong.artistDetails) {
    //calculate total count and time for every artist
    if (
      mostListenedSong.artistDetails[artist].totalCount >
      maxCountArtist.totalCount
    ) {
      maxCountArtist.totalCount =
        mostListenedSong.artistDetails[artist].totalCount;
      maxCountArtist.artist = artist;
    }
    if (
      mostListenedSong.artistDetails[artist].totalTime > maxTimeArtist.totalTime
    ) {
      maxTimeArtist.totalTime =
        mostListenedSong.artistDetails[artist].totalTime;
      maxTimeArtist.artist = artist;
    }
  }

  //Return a clear result object summarizing everything
  return {
    mostListenedByCount:
      mostListenedSong.maxCountSongDetail.artist +
      "-" +
      mostListenedSong.maxCountSongDetail.name,
    mostListenedByTime:
      mostListenedSong.maxTimeSongDetail.artist +
      "-" +
      mostListenedSong.maxTimeSongDetail.name,
    mostListenedArtistByCount: maxCountArtist.artist,
    mostListenedArtistByTime: maxTimeArtist.artist,
  };
}

//This function filters events to only include songs played
// on Friday nights (between Friday 5PM and Saturday 4AM).
export function filterFridayNightSongs(userEvent) {
  const fridayNightSongs = userEvent.filter((songs) => {
    const eventDate = new Date(songs.timestamp);
    const day = eventDate.getDay(); //5 = Friday , 6 = Saturday
    const hour = eventDate.getHours();
    return (
      (day === 5 && hour >=17) ||
      (day===6 && hour<4)
      
    );
  });

  return fridayNightSongs;
}

// This function finds the song with the longest streak (i.e. most times listened in a row)
export function findLongestStreak(userEvent) {
  let currentSongId, currentStreak, maxStreak;

  // Initialize with the first song in the event list
  currentSongId = userEvent[0].song_id;
  currentStreak = 1;
  maxStreak = 1;

  // Store info about the current longest streak
  const maxStreakInfo = {
    song_id: currentSongId,
    title: getSong(currentSongId).title,
    artist: getSong(currentSongId).artist,
    count: 1,
  };

  // loop through each event starting from the second one  
  for (let i = 1; i < userEvent.length; i++) {
    const event = userEvent[i];
    if (event.song_id === currentSongId) {
      //if the same song continues, increase the streak count
      currentStreak++;
    } else {
      // if the song changes, check if previous streak was longest
      if (currentStreak > maxStreak) {
        // Update stored info about the longest streak
        maxStreakInfo.song_id = currentSongId;
        maxStreakInfo.artist = getSong(currentSongId).artist;
        maxStreakInfo.title = getSong(currentSongId).title;
        maxStreakInfo.count = currentStreak;

        // Update maximum streak count
        maxStreak = currentStreak;
      }

      //reset streak for the new song
      currentSongId = event.song_id;
      currentStreak = 1;
    }
  }

  // After the loop, check one last time in case the last streak is the longest
  if (currentStreak > maxStreak) {
    maxStreakInfo.song_id = currentSongId;
    maxStreakInfo.title = getSong(currentSongId).title;
    maxStreakInfo.artist = getSong(currentSongId).artist;
    maxStreakInfo.count = currentStreak;
  }

  // Return the information about the song with the longest consecutive streak
  return maxStreakInfo;
}

//This function finds songs that were listened to on every single day
export function findEverydayListenedSong(userEvent){
  //create a Map to group songs by date
  //each date will have a Set of songs listened that day
  const groupSongsByDate = new Map();

  userEvent.forEach((event) => {
    const eventDate = event.timestamp.split("T")[0]; //Extract date part from timestamp (YYYY-MM-DD)

    // create a new Set for the date if it doesn’t exist yet
    if (!groupSongsByDate.has(eventDate)) {
      groupSongsByDate.set(eventDate, new Set());
    }

    //add the song to that day's Set
    groupSongsByDate.get(eventDate).add(event.song_id);
  });

  // Convert the Map of Sets into an array of Sets
  const sets = Array.from(groupSongsByDate.values());

  // Find the intersection of all Sets (songs listened to every day)
  let commonSongs = new Set(sets[0]); //Start with the first day's songs as initial "common" set

  //find intersection: only keep songs that appear in every day's Set
  for (let i = 1; i < sets.length; i++) {
    const tempSongSet = new Set(); // temporary set to store intersection
    for (const song of commonSongs) {
      // if the song is also in the next day's set, keep it
      if (sets[i].has(song)) {
        tempSongSet.add(song);
      }
    }
    // update commonSongs with the intersection result
    commonSongs = tempSongSet;
  }

  //map remaining songs to "artist - title" format
  const result = [...commonSongs].map((song_id) => {
    const songDetail = getSong(song_id);
    return `${songDetail.artist}-${songDetail.title}`;
  });

  return result;
}

//This function finds the top 3 most listened genres by the user
//input parameter is output data of userHistory function
export function findTopGenres(userHistory){
  const genreTotals = {}; // Object to store total plays per genre

  //loop through all songs and accumulate counts per genre
  for (const record of userHistory) {
    const genre = record[1].genre; // Get genre of the current song
    const genreCount = record[1].count; // Get count of listens for the current song

    // Initialize genre in genreTotals if it doesn't exist
    if (!genreTotals[genre]) {
      genreTotals[genre] = 0;
    }

    // Add current song's count to the total for its genre
    genreTotals[genre] += genreCount;
  }
  
  // Convert the genreTotals object to an array of [genre, totalCount] pairs
  const genreTotalsArray = Object.entries(genreTotals);

  // Sort the array in descending order based on total listens
  const sortedArray = genreTotalsArray.sort((a, b) => b[1] - a[1]);

  // Extract only the genre names from the sorted array
  const topGenreNames = sortedArray.map((a) => a[0]);

  // Take the top 3 genres
  const top3Genres = topGenreNames.slice(0, 3);

  return top3Genres; // Return array of top 3 genre names
}
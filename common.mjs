import { getUserIDs } from "./data.mjs";
import { getQuestions, getSong } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

// This function gets user events from getListenEvents for user X
//  in result create an array with this details: song-id,total-count, total-time , artist-name ,song-name , song-genre
export function userHistory(userEvent){
   const userHistoryMap=new Map(); //declare a variable of data type Map to create a key-value object for each song per user
   userEvent.forEach(event => {
        const songCount=(userHistoryMap.get(event.song_id)?.count || 0) + 1;//calculate total count of songs that user x listened 
        const songTime = (userHistoryMap.get(event.song_id)?.time || 0)  + getSong(event.song_id).duration_seconds;//calculate total time of songs that user x listened 
        const artist=getSong(event.song_id).artist;        
        const genre=getSong(event.song_id).genre;
        const songTitle=getSong(event.song_id).title;
        userHistoryMap.set(event.song_id, { count: songCount , time : songTime , artist : artist , genre : genre , title:songTitle }); //create a key-value record for song-id n
   });
   
return Array.from(userHistoryMap);//change map structure to array for using array methods in next function

};

//This function calculate the most song user x listened in terms of count and time
export function findTheMost(userHistoryArray){
  if (userHistoryArray.length === 0) {
    return null;
  }

    const mostListenedSong = userHistoryArray.reduce((max, songData) => {
    const songName = songData[1].title;
    const artistName = songData[1].artist;
    const count = songData[1].count;
    const time = songData[1].time;

    //max initial value : a nested object
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
    //finding and updating max count played song
    if (count > max.maxCountSongDetail.count) {
      max.maxCountSongDetail = {
        name: songName,
        count: count,
        artist: artistName,
      };
    }

    //finding and updating max time played  song
    if (time > max.maxTimeSongDetail.time) {
      max.maxTimeSongDetail = {
        name: songName,
        time: time,
        artist: artistName,
      };
    }

    //creating an object for per artist with total count and time played
    if (!max.artistDetails[artistName]) {
      //initializing artist details for artistName
      max.artistDetails[artistName] = { totalCount: 0, totalTime: 0 };
    }
    max.artistDetails[artistName].totalCount += count; //updating counts of played songs for artistName X
    max.artistDetails[artistName].totalTime += time; //updating time of played songs for artistName X

    return max; //a nested object
  }, null);

  //finding the artist which have the most played song (count & time)
  let maxCountArtist = { artist: null, totalCount: 0 }; //declare and initialize variable to save max count for per artist
  let maxTimeArtist = { artist: null, totalTime: 0 }; //declare and initialize variable to save max time for per artist

  for (const artist in mostListenedSong.artistDetails) { //calculate total cout and time for every artist 
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

export function filterFridayNightSongs(userEvent) {
  const fridayNightSongs = userEvent.filter((songs) => {
    const eventDate = new Date(songs.timestamp);
    return (
      eventDate.getDay() === 5 &&
      eventDate.getHours() >= 4 &&
      eventDate.getHours() <= 17
    );
  });

  return fridayNightSongs;
}
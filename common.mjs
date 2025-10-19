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
    console.log(userHistoryArray[0][0]);
    console.log(userHistoryArray[0][1]);
    console.log(userHistoryArray[0][1].count);
   const mostListenedSong = userHistoryArray.reduce((max, songData) => {
      const songName = songData[1].title;
      const artistName=songData[1].artist;
      const count = songData[1].count;

      if (!max || count > max.count) {
       return {name:songName , count : count , artist:artistName}
      }
      return max;
    },null);
return mostListenedSong.artist+'-'+mostListenedSong.name;
  

}
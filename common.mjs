import { getUserIDs } from "./data.mjs";
import { getQuestions, getSong } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

//This function calculate the most listened songs count for user x
//input: userID, output array of songs name
export function userHistory(userEvent){
   const userHistoryMap=new Map();
   userEvent.forEach(event => {
        const songCount=(userHistoryMap.get(event.song_id)?.count || 0) + 1;
        const songTime = (userHistoryMap.get(event.song_id)?.time || 0)  + getSong(event.song_id).duration_seconds;
        const artist=getSong(event.song_id).artist;        
        const genre=getSong(event.song_id).genre;
        userHistoryMap.set(event.song_id, { count: songCount , time : songTime , artist : artist , genre : genre});
   });
   
return userHistoryMap;


};

//This function calculate the most listened songs time for user x
//input: userID, output array of songs name
export function mostlistenedTime(userID){};


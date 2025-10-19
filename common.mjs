import { getUserIDs } from "./data.mjs";
import { getQuestions } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

//This function calculate the most listened songs count for user x
//input: userID, output array of songs name
export function userHistory(userEvent){
   const userHistoryMap=new Map();
   userEvent.forEach(event => {
        const songCount=(userHistoryMap.get(event.song_id)?.count || 0) + 1;
                 
        userHistoryMap.set(event.song_id, { count: songCount });
   });
   
return userHistoryMap;


};

//This function calculate the most listened songs time for user x
//input: userID, output array of songs name
export function mostlistenedTime(userID){};


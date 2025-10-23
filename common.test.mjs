import assert from "node:assert";
import test from "node:test";
import { countUsers , userHistory} from "./common.mjs";
import { getSong } from "./data.mjs";


test("User count is correct", () => {
  assert.equal(countUsers(), 4);
});

const sampleUserEvents = [
  {
    timestamp: "2024-08-01T00:20:07",
    seconds_since_midnight: 1207,
    song_id: "song-1",
  },
  {
    timestamp: "2024-08-01T01:00:07",
    seconds_since_midnight: 3607,
    song_id: "song-1",
  },
  {
    timestamp: "2024-08-01T01:20:07",
    seconds_since_midnight: 4807,
    song_id: "song-2",
  },
];

test("userHistory correctly groups and aggregates user event by song_id",()=>
{
  const result = userHistory(sampleUserEvents);
  assert.strictEqual(result.length, 2, "Expect 2 songs in total");

  const song1 = result.find((item) => (item[0] = "song-1"))[1];
  assert.strictEqual(song1.count, 2, "Played twice");
  assert.strictEqual(song1.time, 190 * 2, "Total time = 2 * 190");
  assert.strictEqual(song1.artist, "The King Blues", "Artist is correct"); 
  assert.strictEqual(song1.genre, "Punk", " Genre is correct"); 
  assert.strictEqual(song1.title, "I Got Love", "Title is correct"); 
});


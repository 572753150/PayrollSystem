/**
 * Created by apple on 2017/3/1.
 */
function Game(colors, font, guesses, id, level, remaining, status, target, timestamp, timeToComplete, view, userId) {
    this.colors = colors;
    this.font = font;
    this.guesses = guesses;
    this.id = id;
    this.level = level;
    this.remaining = remaining;
    this.status = status;
    this.target = target;
    this.timeStamp = timestamp;
    this.timeToComplete = timeToComplete;
    this.view = view;
    this.userId=userId;
}
module.exports=Game;
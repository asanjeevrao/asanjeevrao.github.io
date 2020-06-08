# Tetris 🤖🤖
My implementation of the classic game, built using Vanilla JS - https://asanjeevrao.github.io/tetris/

Would love to hear any feedback about what I could've improved in the code/experience. 

There's a few known issues/improvements still pending on my list - 
* Rotating tetrominos near the left & right edges causes some blocks to bleed over the edge
* On mobile, vertical swipe beyond a certain length should push a block vertically to its farthest position 
* Currently *Game Over* only checks if a new tetromino can't spawn because of a collision, there are other conditions such as when a piece gets locked out of bounds that need to be added
* Creating a *Hold Box* where users can temporarily store one tetromino
* Add the concept of Levels that increase each time you clear 10 lines, causing a speed increase & scoring system change
* Store *High Scores* in Local Storage 
* Add a tracing box that shows you the final position of the falling tetromino when it collides and helps with easier movements


# imp_sample
Sample code for Interactive Media Player

This sample includes React components working with Redux and Routes. The components are communicating with the backend NodeJs and MongoDB.
Player.js and Page.js are examples of a React components connected to Redux and using Router. Player.js passes the playlistId (originated from the url) to an action which asynchronously requests the specified playlist from the server.
Then in server.js Express route handles the request by getting the data from MongoDB with the Playlist Mongoose model.
Once the request is completed the Redux state is updated and is now available to the Player component.

Other example files:
Page.js link
MultipleSelectPage.js link
MultipleSelectPageEdit.js link

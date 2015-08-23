# node-message-server
A quick and dirty message server using HTTP and Node.js in 28 lines of Javascript :D

I felt like writing something small and this is the result.
It's an HTTP server that has only one route '/messages', which responds to GET and POST requests with JSON.
Each request must use Basic Authentication. A user is created automatically if it does not exist.

Messages are retrieved by sending a GET request to /messages.
When the messages are retrieved, the user's messages are removed which means messages can only be retrieved once.

Messages are created by sending a POST request to /messages.
The POST data that needs to be sent to create a message is:
- __to__ - The user to send the message to.
- __msg__ - The message to send.

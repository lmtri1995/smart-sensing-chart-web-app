// server.js

const http = require("http");
http
  .createServer((request, response) => {
    console.log("Requested url: " + request.url);

    if (request.url.toLowerCase() === "/events") {
      response.writeHead(200, {
         Connection: "keep-alive",
		  "Content-Type": "text/event-stream",
		  "Cache-Control": "no-cache",
		  "Access-Control-Allow-Origin": "*"
      });

      setInterval(() => {
        response.write('data:'+Math.random(10));
        response.write("\n\n");
      }, 6000);
    } else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(5000, () => {
    console.log("Server running at http://127.0.0.1:5000/");
  });
  
  
  
  // server.js

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
http
  .createServer((request, response) => {
    console.log("Requested url: " + request.url);

	
	if (request.url.toLowerCase() === "/chart_events") {
      response.writeHead(200, {
         Connection: "keep-alive",
		  "Content-Type": "text/event-stream",
		  "Cache-Control": "no-cache",
		  "Access-Control-Allow-Origin": "*"
      });

      setInterval(() => {
		var chart_data= {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [getRandomInt(50, 200), getRandomInt(50, 200), getRandomInt(50, 200), getRandomInt(50, 200), getRandomInt(50, 200), getRandomInt(50, 200)],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
        response.write('data:'+JSON.stringify(chart_data));
        response.write("\n\n");
      }, 6000);
    } else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(5001, () => {
    console.log("Server running at http://127.0.0.1:5001/");
  });
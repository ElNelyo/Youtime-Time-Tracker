// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import {YouTrackC} from "./YouTrack";



window.addEventListener("DOMContentLoaded", async() => {

  var h1 = document.getElementsByTagName('h1')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    clear = document.getElementById('clear'),
    send = document.getElementById('send'),
    seconds = 0, minutes = 0, hours = 0,
    t:any;

    send.addEventListener("click", sendAction);

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();


/* Start button */
start.onclick = timer;

/* Stop button */
stop.onclick = function() {
    clearTimeout(t);
}

/* Clear button */
clear.onclick = function() {
    h1.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}


  var project: any;
  var issues: any;
  

  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, (process.versions as any)[type]);
  }

  
  
  var myParent = document.body;
async function sendAction(){
  var issue = (<HTMLInputElement>document.getElementById("issuesList")).value;
  console.log(issue);
  await youtrack.sendTime(issue);
}
async function onChange() {

    project = (<HTMLInputElement>document.getElementById("mySelect")).value;
    console.log(project)
    issues = await youtrack.getIssuesFromProject(project)
    
    var issuesList = document.createElement("select");
    issuesList.id = "issuesList";
    myParent.appendChild(issuesList);

    issues.forEach(function(item: any){  
      console.log(item);
      var newissue = document.createElement("option");
      newissue.value = item.id;
      newissue.text = item.summary
      issuesList.appendChild(newissue);
    })
  }

//Create and append select list
var selectList = document.createElement("select");
selectList.id = "mySelect";
selectList.addEventListener("change", onChange);
myParent.appendChild(selectList);

  let youtrack = new YouTrackC();
  youtrack.init();
  youtrack.getCurrentUser();
  youtrack.getExampleIssues();

  youtrack.getProjects().then(projects =>{
    console.log(projects)
    projects.forEach(function(item: any){  
      var newoption = document.createElement("option");
      newoption.text = item.shortName;
      selectList.appendChild(newoption);
    })

  } );



});


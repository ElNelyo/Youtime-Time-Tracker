// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import {YouTrackC} from "./YouTrack";
const Store = require('electron-store');

const store = new Store();



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

  var mainer = document.getElementById("main");
  var myParent = mainer;


async function sendAction(){

  if (document.getElementById('issuesList') ==null){
    let myNotification = new Notification('YouTime', {
      body: 'Vous devez choisir un ticket !',
      icon:"src/assets/logo.png"
  })

   return false;
  } else {
    var issue = (<HTMLInputElement>document.getElementById("issuesList")).value;

  }
 

  var time = hours+"h"+minutes+"m"
  var text = (<HTMLInputElement>document.getElementById("text-timer")).value;

  if (minutes ==0) {
    let myNotification = new Notification('YouTime', {
      body: 'Il est trop tôt pour envoyer votre temps !',
      icon:"src/assets/logo.png"
  })
  }else{
    await youtrack.sendTime(issue,time,text);
    let myNotification = new Notification('YouTime', {
      body: 'Votre temps a correctement été envoyé sur YouTrack',
      icon:"src/assets/logo.png"
  })
  }
  
}



async function onChange() {

    project = (<HTMLInputElement>document.getElementById("mySelect")).value;
    
    issues = await youtrack.getIssuesFromProject(project)
    if (document.getElementById('issuesList') ==null){

      var issuesList = document.createElement("select");
        issuesList.id = "issuesList";
       issuesList.className ="block max-w-2xl text-purple-600 appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
        myParent.appendChild(issuesList);
        issues.forEach(function(item: any){  
    
          var newissue = document.createElement("option");
          newissue.value = item.id;
          newissue.text = item.summary
          issuesList.appendChild(newissue);
        })
    }else{

      var issuesList_ = <HTMLInputElement>document.getElementById("issuesList")
      issuesList_.innerHTML = "";
      issues.forEach(function(item: any){  
    
        var newissue = document.createElement("option");
        newissue.value = item.id;
        newissue.text = item.summary
        issuesList_.appendChild(newissue);
      })
    }
    


  }

//Create and append select list
var selectList = document.createElement("select");
selectList.id = "mySelect";
selectList.className=  "block appearance-none w-full text-purple-600 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
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


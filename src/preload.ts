// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import {YouTrackC} from "./YouTrack";
require('hacktimer');
const Store = require('electron-store');

const store = new Store();
var config = true;


window.addEventListener("DOMContentLoaded", async() => {

  var youtrack: YouTrackC;
  var project: any;
  var issues: any;
  var mainer = document.getElementById("main");
  var myParent = mainer;
  var configuration_wrapper =document.getElementById("configuration-wrapper"); 

  if(store.get('url') !="undefined" && store.get('perm') != "undefined"){
    createYoutrack(store.get('url'),store.get('perm'));
    }else{
      createYoutrack("url","perm");
    }

  var cog = document.createElement("i");
  cog.className="fas fa-cog fa-2x text-purple-600";
  cog.addEventListener("click", openPerms);
  configuration_wrapper.appendChild(cog);


 
 
  function openPerms(){


    if(config){
      var config_url = document.createElement("input");
      config_url.value=store.get('url');
      config_url.id="configuration_url";
      config_url.className ="block max-w-2xl text-purple-600 appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      configuration_wrapper.appendChild(config_url);
  
  
      var config_perm = document.createElement("input");
      config_perm.value=store.get('perm');
      config_perm.id="configuration_perm";
      config_perm.className ="block max-w-2xl text-purple-600 appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      configuration_wrapper.appendChild(config_perm);
  
      var valide_perm = document.createElement("button");
      valide_perm.value="Valider";
      valide_perm.id="validate_perm";
      valide_perm.innerHTML="Valider permissions";
      valide_perm.addEventListener("click", savePerms);
      valide_perm.className = "bg-purple-400 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded";
      configuration_wrapper.appendChild(valide_perm);
      config = false
    }else{
      var valide_perm_ = document.getElementById("configuration_url");
      var config_perm_ = document.getElementById("configuration_perm");
      var config_url_ = document.getElementById("validate_perm");
      configuration_wrapper.removeChild(valide_perm_)
      configuration_wrapper.removeChild(config_perm_)
      configuration_wrapper.removeChild(config_url_)
      config = true;
    }
    
    
  
 
    
  }

  function savePerms(){
    var url = (<HTMLInputElement>document.getElementById("configuration_url")).value;
    var perm = (<HTMLInputElement>document.getElementById("configuration_perm")).value;
    store.set('url', url);
    store.set('perm', perm);

    createYoutrack(store.get('url'),store.get('perm'));
  }


function createYoutrack(url:string,perm:string){
  youtrack = new YouTrackC(url,perm);
  youtrack.init();
  youtrack.getCurrentUser();
  youtrack.getExampleIssues();

  youtrack.getProjects().then(projects =>{
    projects.forEach(function(item: any){  
      var newoption = document.createElement("option");
      newoption.text = item.shortName;
      selectList.appendChild(newoption);
    })

  } );

}


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



  

  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, (process.versions as any)[type]);
  }



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




});


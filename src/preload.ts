// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import {YouTrackC} from "./YouTrack";



window.addEventListener("DOMContentLoaded", async() => {

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

async function onChange() {

    project = (<HTMLInputElement>document.getElementById("mySelect")).value;
    console.log(project)
    issues = await youtrack.getIssuesFromProject(project)
    
    var issuesList = document.createElement("select");
    issuesList.id = "issuesList";
    myParent.appendChild(issuesList);

    issues.forEach(function(item: any){  
      var newissue = document.createElement("option");
      newissue.text = item.summary;
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


import {Youtrack} from "youtrack-rest-client";

export class YouTrackC {
    base_url: string;
    token: string;
    youtrack: Youtrack;

    constructor(url:string= "url",perm:string= "perm") {
        this.base_url =url;
        this.token=perm;
    }

    init() {

     
        const config = {
            baseUrl: this.base_url, 
            token: this.token
        };
    
        this.youtrack = new Youtrack(config); 
    }

    getCurrentUser(){
        this.youtrack.users.current().then((user) => {
            
            let myNotification = new Notification('YouTime', {
                body: 'Bienvenue '+user["fullName"],
                icon:"src/assets/logo.png"
            })
        })
        .catch((error:any) => {
            console.log(error);
            let myNotification = new Notification('YouTime', {
            body: 'Erreur de connexion, vérifier dans configuration',
            icon:"src/assets/logo.png"});
        
    })
}

    async getWorkItemFromProject(){

    }
    async getProjects(): Promise<any>{
        var projects = this.youtrack.projects.all({$top:500});
        
        return await projects;
    }

    async getIssuesFromProject(project: string){
        return await this.youtrack.issues.search('project: '+project).then();
    }

    getExampleIssues(){
       // this.youtrack.issues.search('project: GAMEPLAY').then((issues) => {
            //console.log(issues);
     //   });
    }

    async sendTime(issue: string,time:string,text:string){
        await this.youtrack.workItems.create(issue, {
            duration: {
                presentation: time,
            },
            text: text,
            /*type: {
                name: 'Test',
                id: '73-1'
            }*/
        }).then(workItem => {
            
            //console.log({workItem});
        });
    }
}



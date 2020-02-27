import {Youtrack} from "youtrack-rest-client";

export class YouTrackC {
    base_url: string;
    token: string;
    youtrack: Youtrack;

    constructor() {
        this.base_url = "https://family-v.myjetbrains.com/youtrack";
        this.token = "";

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
            console.log({user});
        });
    }

    async getWorkItemFromProject(){

    }
    async getProjects(): Promise<any>{
        return await this.youtrack.projects.all();
    }

    async getIssuesFromProject(project: string){
        return await this.youtrack.issues.search('project: '+project).then();
    }

    getExampleIssues(){
        this.youtrack.issues.search('project: GAMEPLAY').then((issues) => {
            console.log(issues);
        });
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
            
            console.log({workItem});
        });
    }
}


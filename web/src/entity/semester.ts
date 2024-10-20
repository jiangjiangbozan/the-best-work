export class Semester {
    id: number;
    name: string;
    start_time: number;
    end_time: number;
    school_name?: string
    
    constructor(data = {} as {
        id: number;
        name: string;
        start_time: number;
        end_time: number;
        school_name?: string
    }) {
        this.id = data.id;
        this.name = data.name;
        this.start_time = data.start_time;
        this.end_time = data.id;
        this.school_name = data.school_name;
    }
 }

export class Course {
    id: number;
    date: number;
    name: string;
    section: number;
    user_id: number;
    start_week: number;
    end_week: number;
    semester_id: number;

    constructor(data = {} as {
        id: number,
        date: number,
        name: string,
        section: number,
        user_id: number,
        start_week: number,
        end_week: number,
        semester_id: number
    }) {
        this.id = data.id as number;
        this.date = data.date as number;
        this.name = data.name as string;
        this.section = data.section as number;
        this.user_id = data.user_id as number;
        this.start_week = data.start_week as number;
        this.end_week = data.end_week as number;
        this.semester_id = data.semester_id as number;
    }

}

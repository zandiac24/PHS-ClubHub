//Type definitions for data

export type Club = {
    club_name: string;
    studentName: string;
    studentEmail: string;
    description: string;
    category: string;
    contactName: string;
    contactEmail: string;
    meeting_days_time: string;
    meeting_location: string;
    additional_info: string;
};
export type Revenue = {
    club_name: string;
    studentName: string;
    studentEmail: string;
    description: string;
    // category: string;
    contactName: string;
    contactEmail: string;
    meeting_days_time: string;
    meeting_location: number;
    additional_info: string;
};

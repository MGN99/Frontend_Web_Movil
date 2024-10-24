// Define types for the answers
export type Answer = {
    _id:string;
    content: string;
  };

  
  // Define types for the questions
export type Question = {
    _id:string;
    content: string;
    observation: string;
    answers: Answer[];
  };
  
  // Define types for the sections
export type Section = {
    _id:string;
    title: string;
    questions: Question[];
  };
  
  // Define types for the entire questionnaire
export type Questionnaire = {
    _id:string;
    title: string;
    type:string;
    description:string;
    sections: Section[];
  };


  
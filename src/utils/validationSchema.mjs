export const createUserVAlidationSchema = {
    displayNAme : {
        notEmpty :{
            errorMessage :"display name not be empty"
        },
    
    isString :{
        errorMessage :"Must be string"
    },
    
    isLength : {
        Option : {
            min:3
        },
        errorMessage :"must have atleast 3 characters"
    },
    },
};
export default createUserVAlidationSchema;
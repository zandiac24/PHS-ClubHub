//student registration form (to join a club)
'use client';
import React from 'react';
import {useRef} from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as yup from "yup";
import dynamic from 'next/dynamic';

const ClubDropdown = dynamic(() => import('@/app/ui/dropdowns/club-dropdown'), { ssr: false });

//define form inputs
interface FormValues {
    firstName: string;
    lastName: string;
    studentID: number;
    club: string;
}

//form validation (with yup)
const validationChecks = yup.object({
    firstName: yup.string().required("Please enter your first name."),
    lastName: yup.string().required("Please enter your last name."),
    studentID: yup.number().typeError("Please enter a valid MCPS ID.").min(100000, "Please enter a valid MCPS ID.").required("Please enter your MCPS student ID number."),
    club: yup.string().required("Please select the club you wish to join."),
});

const RegForm: React.FC = () => {
    const dropdownRef = useRef<{ getSelectedClub: () => string, reset: () => null}>(null);
    
    //starting values
    const initialValues: FormValues = {
        firstName: "",
        lastName: "",
        studentID: 0,
        club:  "", 
    };
   
    //when submitted, reset the form, dropdown, and post the values via api
    const handleSubmit = async (
        values: FormValues,
        {setSubmitting, resetForm}: FormikHelpers<FormValues>
    ) => {
            const club = dropdownRef.current?.getSelectedClub() || '';
            const payload = {
            ...values,
            club,
         };

    try {
      const res = await fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Form submitted successfully!');
        resetForm();
        dropdownRef.current?.reset();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Submission failed.'}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

    return (
        <div className='ml-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>Student Registration Form</div>
            <div className='text-[16px] mt-[10px] mb-[25px]'>
                <div>Students must fill out the form below each year to be a registered member of a club.</div>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationChecks}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, setFieldValue}) => (
                    <Form>
                        <h1>Student First Name*</h1>
                        <Field name="firstName" placeholder="Enter your first name" />
                        <ErrorMessage name="firstName" component="div" className="text-red-500"/>
                        
                        <h1>Student Last Name*</h1>
                        <Field name="lastName" placeholder="Enter your last name"/>
                        <ErrorMessage name="lastName" component="div" className="text-red-500"/>
                        
                        <h1>MCPS Student ID*</h1>
                        <Field name="studentID" placeholder="Enter your MCPS Student ID"/>
                        <ErrorMessage name="studentID" component="div" className="text-red-500"/>
                        
                        <h1>Club*</h1>
                        <ClubDropdown ref={dropdownRef} onChange={(club) => setFieldValue("club", club)}/>
                        <ErrorMessage name="club" component="div" className="text-red-500"/>
                                     
                        <div className="md:w-[60vw] sm:w-[80vw] mt-6 flex justify-center">
                            <button type="submit" disabled={isSubmitting} className="flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 px-6 py-4 text-sm font-medium hover:bg-yellow-200">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegForm;
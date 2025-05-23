'use client';
import React from 'react';
import {useRef} from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as yup from "yup";
import ClubDropdown from '@/app/ui/dropdowns/club-dropdown'


interface FormValues {
    firstName: string;
    lastName: string;
    studentId: number;
    club: string;
}

const validationChecks = yup.object({
    firstName: yup.string().required("Please enter your first name."),
    lastName: yup.string().required("Please enter your last name."),
    studentId: yup.number().min(100000, "Please enter a valid MCPS ID.").required("Please enter your MCPS student ID number."),
    club: yup.string().required("Please select the club you wish to join."),
});

const RegForm: React.FC = () => {
    const dropdownRef = useRef<{ getSelectedClub: () => string }>(null);
    
    const initialValues: FormValues = {
        firstName: "",
        lastName: "",
        studentId: 0,
        club:  "", 
    };
   
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
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Form submitted successfully!');
        resetForm();
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
                        
                        <h1>Student Requesting Approval (Point of Contact)*</h1>
                        <Field name="lastName" placeholder="Enter your last name"/>
                        <ErrorMessage name="lastName" component="div" className="text-red-500"/>
                        
                        <h1>MCPS Student ID*</h1>
                        <Field name="studentId" placeholder="Enter your MCPS Student ID"/>
                        <ErrorMessage name="studentId" component="div" className="text-red-500"/>
                        
                        <h1>Club*</h1>
                        <ClubDropdown ref={dropdownRef} onChange={(club) => setFieldValue("club", club)}/>
                        <ErrorMessage name="club" component="div" className="text-red-500"/>
                                     
                        <div className="w-[60vw] mt-6 flex justify-center">
                            <button type="submit" disabled={true /*isSubmitting*/} className="flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 px-6 py-4 text-sm font-medium hover:bg-yellow-200">
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



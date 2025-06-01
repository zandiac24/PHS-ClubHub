//update club information form
'use client';
import React from 'react';
import {useRef} from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as yup from "yup";
import dynamic from 'next/dynamic';

const ClubDropdown = dynamic(() => import('@/app/ui/dropdowns/club-dropdown'), { ssr: false });

//define form inputs
interface FormValues {
    studentName: string;
    studentEmail: string;
    contactName: string;
    contactEmail: string;
    club: string;
}

//form validation (with yup)
const validationChecks = yup.object({
    studentName: yup.string().required("Please enter the student leader's name."),
    studentEmail: yup.string().email("Please enter a valid email").required("Please enter the student leader's email."),
    contactName: yup.string().required("Please enter the club sponsor's name.")
        .test(
            'contains-title',
            "Please enter Mr./Ms./Mrs. followed by the sponsor's last name.",
            (value) => typeof value === 'string' && (value.includes('Mr. ') || value.includes('Ms. ') || value.includes('Mrs. ') || value.includes('Mx. '))),
    contactEmail: yup.string().email("Please enter a valid MCPS email.").required("Please enter the club sponsor's MCPS email.")
        .test(
            'contains-mcpsmd',
            'Please enter a valid MCPS email.',
            (value) => typeof value === 'string' && (value.includes('@mcpsmd.net') || value.includes('@mcpsmd.org'))),
    club: yup.string().required("Please select the club you wish to update."),
});

const UpdateForm: React.FC = () => {
    const dropdownRef = useRef<{ getSelectedClub: () => string, reset: () => null}>(null);
    
    //starting values
    const initialValues: FormValues = {
        studentName: "",
        studentEmail: "",
        contactName: "",
        contactEmail: "",
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
      const res = await fetch('/api/update', {
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
            <div className='text-[25px] font-semibold mt-[25px]'>Club Information Update Form</div>
            <div className='text-[16px] mt-[10px] mb-[25px]'>
                <div>Sponsors must fill out the form below if they want to update club information.</div>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationChecks}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, setFieldValue}) => (
                    <Form>
                        <h1>Student Leader Full Name*</h1>
                        <Field name="studentName" placeholder="Enter the student leader's full name" />
                        <ErrorMessage name="studentName" component="div" className="text-red-500"/>
                        
                        <h1>Student Leader Email*</h1>
                        <Field name="studentEmail" placeholder="Enter the student leader's email"/>
                        <ErrorMessage name="studentEmail" component="div" className="text-red-500"/>
                        
                        <h1>Sponsor Name*</h1>
                        <Field name="contactName" placeholder="Enter the club sponsor's name (ex. Mr. King)"/>
                        <ErrorMessage name="contactName" component="div" className="text-red-500"/>

                        <h1>Sponsor Email*</h1>
                        <Field name="contactEmail" placeholder="Enter the club sponsor's MCPS email"/>
                        <ErrorMessage name="contactEmail" component="div" className="text-red-500"/>
                        
                        <h1>Club*</h1>
                        <ClubDropdown ref={dropdownRef} onChange={(club) => setFieldValue("club", club)}/>
                        <ErrorMessage name="club" component="div" className="text-red-500"/>
                                     
                        <div className="w-[60vw] mt-6 flex justify-center">
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

export default UpdateForm;
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
    description: string;
    meeting_days_time: string;
    meeting_location: string;
    additional_info: string;
    club: string;
}

//form validation (with yup)
const validationChecks = yup.object({
    studentName: yup.string(),
    studentEmail: yup.string().email("Please enter a valid email"),
    contactName: yup.string()
        .test(
            'contains-title',
            "Please enter Mr./Ms./Mrs. followed by the sponsor's last name.",
            (value) => !value || typeof value === 'string' && (value.includes('Mr. ') || value.includes('Ms. ') || value.includes('Mrs. ') || value.includes('Mx. '))),
    contactEmail: yup.string().email("Please enter a valid MCPS email.")
        .test(
            'contains-mcpsmd',
            'Please enter a valid MCPS email.',
            (value) => !value || typeof value === 'string' && (value.includes('@mcpsmd.net') || value.includes('@mcpsmd.org'))),
    description: yup.string()
        .test('len', 'Please enter a description that is 300 characters or less.', val => !val || val.length <= 300),
    meeting_days_time: yup.string(),
    meeting_location: yup.string(),
    additional_info: yup.string(),
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
        description: "",
        meeting_days_time: "",
        meeting_location: "",
        additional_info: "",
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
        const result = await res.json();
        if(result.inserted) {
            alert('Form submitted successfully!');
        }
        else{
            alert('No changes were made.');
        }
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
        <div className='ml-[35px] mr-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>Club Information Update Form</div>
            <div className='text-[16px] mt-[10px] mb-[25px]'>
                <div>Sponsors must fill out the form below if they want to update club information. <b>Only fill out fields you wish to update.</b></div>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationChecks}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, setFieldValue}) => (
                    <Form>
                        <h1>Club Name*</h1>
                        <ClubDropdown ref={dropdownRef} onChange={(club) => setFieldValue("club", club)}/>
                        <ErrorMessage name="club" component="div" className="text-red-500"/>

                        <h1>Student Leader Full Name</h1>
                        <Field name="studentName" placeholder="Enter the student leader's full name" />
                        <ErrorMessage name="studentName" component="div" className="text-red-500"/>
                        
                        <h1>Student Leader Email</h1>
                        <p className="mt-[5px]">If there are multiple, please seperate them using commas.</p>
                        <Field name="studentEmail" placeholder="Enter the student leader's email"/>
                        <ErrorMessage name="studentEmail" component="div" className="text-red-500"/>

                        <h1>Club Description</h1>
                        <Field name="description" placeholder="Enter a short description of the club (300 words or less)" />
                        <ErrorMessage name="description" component="div" className="text-red-500"/>
                        
                        <h1>Sponsor Name</h1>
                        <Field name="contactName" placeholder="Enter the club sponsor's name (ex. Mr. King)"/>
                        <ErrorMessage name="contactName" component="div" className="text-red-500"/>

                        <h1>Sponsor Email</h1>
                        <Field name="contactEmail" placeholder="Enter the club sponsor's MCPS email"/>
                        <ErrorMessage name="contactEmail" component="div" className="text-red-500"/>

                        <h1>Meeting Day(s) and Times</h1>
                        <Field name="meeting_days_time" placeholder="Enter the meeting dates/times (ex. Monday and Thursday at Lunch)"/>
                        <ErrorMessage name="meeting_days_time" component="div" className="text-red-500"/>
                        
                        <h1>Meeting Location</h1>
                        <Field name="meeting_location" placeholder="Enter the club's meeting location (ex. 'SMCS Hub' or 'Room 2720')"/>
                        <ErrorMessage name="meeting_location" component="div" className="text-red-500"/>
                        
                        <h1>Additional Information (Website, Social Media, etc.)</h1>
                        <Field className='mb-[30px]' name="additional_info" placeholder="Additional information (optional)"/>
                        <ErrorMessage name="additional_info" component="div" className="text-red-500"/>
                                     
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

export default UpdateForm;
//Form for applying to create a new club
'use client';
import React from 'react';
import {useRef} from 'react';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as yup from "yup";
import CategoryDropdown from '@/app/ui/dropdowns/category-dropdown';
import Link from 'next/link';

//Define types of form inputs
interface FormValues {
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
}

//Input validation
const validationChecks = yup.object({
    club_name: yup.string().required("Please enter the club name."),
    studentName: yup.string().required("Please enter the student point of contact's full name."),
    studentEmail: yup.string().email("Please enter a valid email.").required("Please enter the student point of contact's email."),
    description: yup.string().required("Please enter a short description of the club.")
    .test('len', 'Please enter a description that is 300 characters or less.', val => val.length <= 300),
    category: yup.string().required("Please select a category."),
    contactName: yup.string().required("Please enter the club sponsor's name.")
    .test(
        'contains-title',
        "Please enter Mr./Ms./Mrs. followed by the sponsor's last name.",
        (value) => typeof value === 'string' && (value.includes('Mr. ') || value.includes('Ms. ') || value.includes('Mrs. ') || value.includes('Mx. '))),
    contactEmail: yup.string().email("Please enter a valid MCPS email.").required("Please enter the clup sponsor's MCPS email.")
    .test(
        'contains-mcpsmd',
        'Please enter a valid MCPS email.',
        (value) => typeof value === 'string' && (value.includes('@mcpsmd.net') || value.includes('@mcpsmd.org'))),
    meeting_days_time: yup.string().required("Please enter the meeting days/times."),
    meeting_location: yup.string(),
    additional_info: yup.string(),
});


const AppForm: React.FC = () => {
    const dropdownRef = useRef<{ getSelectedCategory: () => string, reset: () => null}>(null);
    
    //Starting values
    const initialValues: FormValues = {
        club_name: "",
        studentName: "",
        studentEmail: "",
        description:  "",
        category: "",
        contactName:  "",
        contactEmail: "",
        meeting_days_time: "",
        meeting_location: "",
        additional_info:  "",  
    };
   
    //Submission function, posts results to database through api/clubs
    const handleSubmit = async (
  values: FormValues,
  { setSubmitting, resetForm }: FormikHelpers<FormValues>
) => {
  const category = dropdownRef.current?.getSelectedCategory().toLowerCase() || '';
  const payload = {
    ...values,
    category,
    status: 'pending',
  };

  try {
    const res = await fetch('/api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error: ${error.message || 'Submission to Clubs API failed.'}`);
      return; 
    }
    
    const result = await res.json();
    if(result.inserted){
        const emailResponse = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        });

        if (!emailResponse.ok) {
        const error = await emailResponse.json();
        console.error('Email error:', error);
        alert(`Warning: Club saved, but email failed to send. (${error.message || 'Unknown error'})`);
        } else {
        console.log("Email Sent!");
        }
    }
    alert('Form submitted successfully!');
    resetForm();
    dropdownRef.current?.reset();
    
  } catch (err) {
    console.error('Submission error:', err);
    alert('An unexpected error occurred.');
  } finally {
    setSubmitting(false);
  }
};


    return (
        <div className='ml-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>New Club Application Form</div>
            <div className='text-[16px] mt-[10px] mb-[25px]'>
                <div>Students must fill out the form below to apply to create a new club.</div>
                <div className='mt-[10px] mb-[10px]'>1. Be sure to read the <Link href="https://docs.google.com/document/d/1ZgmyGJdKUgVYE8QkCOFhnLU5QtlkIPzudVqo5cFD0qw/edit?tab=t.0" className="underline text-blue-700">New Club Approval Requirements.</Link></div>
                <div className='mt-[10px] mb-[10px]'>2. After you submit the club request online, an administrator will review your request.</div>
                <div className='mt-[10px]'>3. Upon approval from administration, the student and club sponsor will receive an email from the ECA Director, Mr. Young,</div>
                <div className='ml-[18px] mb-[10px]'>to let them know the club has been approved.</div>
                <div className='mt-[10px] mb-[10px]'>4. The club sponsor will email the Financial Specialist, Mr. Nathaniel Gordon, to establish an account if applicable.</div>  
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationChecks}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, setFieldValue}) => (
                    <Form>
                        <h1>Club Name*</h1>
                        <Field name="club_name" placeholder="Enter the name of the club (no acronyms/abbreviations)" />
                        <ErrorMessage name="club_name" component="div" className="text-red-500"/>
                        
                        <h1>Student Requesting Approval (Point of Contact)*</h1>
                        <Field name="studentName" placeholder="Enter your full name (ex. John Poole)"/>
                        <ErrorMessage name="studentName" component="div" className="text-red-500"/>
                        
                        <h1>Student Email*</h1>
                        <Field name="studentEmail" placeholder="Enter your MCPS email (@mcpsmd.net)"/>
                        <ErrorMessage name="studentEmail" component="div" className="text-red-500"/>
                        
                        <h1>Purpose/Description of the Club*</h1>
                        <Field className='py-12' component="textarea"  name="description" placeholder="Enter a short description of your club (300 characters or less)"/>
                        <ErrorMessage name="description" component="div" className="text-red-500"/>
                        
                        <h1>Category (Pick the One that Fits Best)*</h1>
                        <CategoryDropdown ref={dropdownRef} onChange={(category) => setFieldValue("category", category)}/>
                        <ErrorMessage name="category" component="div" className="text-red-500"/>
                        
                        <h1>Club Sponsor's Name (Mr./Ms./Mrs. Followed by Last Name)*</h1>
                        <Field name="contactName" placeholder="Enter the club sponsor's name (ex. Mr. Poole)"/>
                        <ErrorMessage name="contactName" component="div" className="text-red-500"/>
                        
                        <h1>Club Sponsor's Email*</h1>
                        <Field name="contactEmail" placeholder="Enter the club sponsor's MCPS email (@mcpsmd.net or @mcpsmd.org)"/>
                        <ErrorMessage name="contactEmail" component="div" className="text-red-500"/>
                        
                        <h1>Meeting Day(s) and Times*</h1>
                        <Field name="meeting_days_time" placeholder="Enter the meeting dates/times (ex. Monday and Thursday at Lunch)"/>
                        <ErrorMessage name="meeting_days_time" component="div" className="text-red-500"/>
                        
                        <h1>Meeting Location (Room Number)*</h1>
                        <Field name="meeting_location" placeholder="Enter club meeting location (ex. 'SMCS Hub' or 'Room 2720')"/>
                        <ErrorMessage name="meeting_location" component="div" className="text-red-500"/>
                        
                        <h1>Additional Information (Website, Social Media, etc.)</h1>
                        <Field className='mb-[30px]' name="additional_info" placeholder="Additional information (optional)"/>
                        <ErrorMessage name="additional_info" component="div" className="text-red-500"/>
                        
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

export default AppForm;



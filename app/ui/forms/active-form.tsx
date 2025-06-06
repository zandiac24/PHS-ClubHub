//select whether club is active or not
'use client';
import React from 'react';
import {useRef} from 'react';
import {Formik, Form, ErrorMessage} from 'formik';
import * as yup from "yup";
import dynamic from 'next/dynamic';

const ClubDropdown = dynamic(() => import('@/app/ui/dropdowns/club-dropdown'), { ssr: false });

//define form inputs
interface FormValues {
    club: string;
}

//form validation (with yup)
const validationChecks = yup.object({
    club: yup.string().required("Please select the club you are the sponsor for."),
});

const UpdateForm: React.FC = () => {
    const dropdownRef = useRef<{ getSelectedClub: () => string, reset: () => null}>(null);

    //starting values
    const initialValues: FormValues = {
        club:  "", 
    };
   
    //when deleted, reset the form, dropdown, and delete the club via api
    const createDeleteHandler = (setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void) => async () => {
        const club_name = dropdownRef.current?.getSelectedClub() || '';
        const payload = {club_name};

    const result = window.confirm(`Are you sure you want to delete ${club_name}?`);
    if (result) {
    try {
      const res = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Club deleted successfully!');
        resetForm();
        dropdownRef.current?.reset();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Deletion failed.'}`);
      }
    } catch (err) {
      console.error('Deletion error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
    }
    setSubmitting(false);
  };

  //when continued, reset the form and dropdown
   const createContinueHandler = (setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void) => async () => {
        const club_name = dropdownRef.current?.getSelectedClub() || '';
        const payload = {club_name};
        alert('Club continued successfully!');
        resetForm();
        dropdownRef.current?.reset();
        setSubmitting(false);
  };

    return (
        <div className='ml-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>Club Renewal Form</div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationChecks}
                onSubmit={() => {}}
            >
                {({isSubmitting, setFieldValue, values, setSubmitting, resetForm}) => (
                    <Form>
                        <h1 className="mt-[30px]">What club are you the sponsor for?</h1>
                        <ClubDropdown ref={dropdownRef} onChange={(club) => setFieldValue("club", club)}/>
                        <ErrorMessage name="club" component="div" className="text-red-500"/>

                        <h1 className="mt-[30px]">Would you like to continue or delete the club?</h1> 
                        <p className="mt-[10px]">If you would like to change club information, click continue and fill out the form below.</p>           
                        <div className="mt-6 justify-center">
                            <button 
                                type="button" 
                                disabled={isSubmitting || !values.club} 
                                onClick={() => {
                                    setSubmitting(true);
                                    createContinueHandler(setSubmitting, resetForm)();
                                }}
                                className="ml-[50px] items-center mb-[30px] justify-center rounded-md bg-yellow-100 lg:w-[10vw] sm:w-[35vw] h-[7vh] text-sm font-medium hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue Club
                            </button>
                            <button 
                                type="button" 
                                disabled={isSubmitting || !values.club} 
                                onClick={() => {
                                    setSubmitting(true);
                                    createDeleteHandler(setSubmitting, resetForm)();
                                }}
                                className="items-center ml-[50px] mb-[30px] justify-center rounded-md bg-yellow-100 text-sm lg:w-[10vw] sm:w-[35vw] h-[7vh] font-medium hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete Club
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateForm;
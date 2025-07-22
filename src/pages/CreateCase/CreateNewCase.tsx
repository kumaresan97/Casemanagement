// import * as React from 'react';
// import { useState } from 'react';
// import styles from './CreateNewCase.module.scss';
// import ClientDetails from './steps/ClientDetails';
// import CaseNotes from './steps/CaseNotes';
// import Appointment from './steps/Appointment';

// interface CreateNewCaseProps {
//     mode: 'add' | 'edit';
//     initialData?: any;
// }

// const steps = ['Client Details', 'Case Notes', 'Appointment'];

// const CreateNewCase: React.FC<CreateNewCaseProps> = ({ mode, initialData }) => {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [formData, setFormData] = useState<any>(
//         initialData || {
//             clientName: '',
//             clientEmail: '',
//             caseNote: '',
//             appointmentDate: '',
//             appointmentTime: '',
//         }
//     );

//     const handleChange = (newData: Partial<any>) => {
//         setFormData((prev: any) => ({ ...prev, ...newData }));
//     };

//     const handleNext = () => {
//         if (currentStep < steps.length - 1) {
//             setCurrentStep((s) => s + 1);
//         }
//     };

//     const handleBack = () => {
//         if (currentStep > 0) {
//             setCurrentStep((s) => s - 1);
//         }
//     };

//     const handleSubmit = () => {
//         if (mode === 'add') {
//             console.log('Creating Case:', formData);
//         } else {
//             console.log('Updating Case:', formData);
//         }
//         alert('Case submitted successfully!');
//     };

//     const renderStep = () => {
//         switch (currentStep) {
//             case 0:
//                 return <ClientDetails data={formData} onChange={handleChange} />;
//             case 1:
//                 return <CaseNotes data={formData} onChange={handleChange} />;
//             case 2:
//                 return <Appointment data={formData} onChange={handleChange} />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className={styles.wrapper}>
//             <h2 className={styles.title}>
//                 {mode === 'add' ? 'Create New Case' : 'Edit Case'}
//             </h2>

//             <div className={styles.layout}>
//                 {/* Stepper Left */}
//                 <div className={styles.stepper}>
//                     {steps.map((label, index) => {
//                         const isActive = index === currentStep;
//                         const isCompleted = index < currentStep;

//                         return (
//                             <div
//                                 key={index}
//                                 className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
//                             >
//                                 <div className={styles.circle}>
//                                     {isCompleted ? '✓' : index + 1}
//                                 </div>
//                                 <span className={styles.label}>{label}</span>
//                                 {index !== steps.length - 1 && <div className={styles.line}></div>}
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* Content Right */}
//                 <div className={styles.content}>
//                     {renderStep()}

//                     <div className={styles.footer}>
//                         <button disabled={currentStep === 0} onClick={handleBack}>Back</button>
//                         {currentStep < steps.length - 1 ? (
//                             <button onClick={handleNext}>Next</button>
//                         ) : (
//                             <button onClick={handleSubmit}>
//                                 {mode === 'add' ? 'Submit' : 'Update'}
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateNewCase;

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */


import * as React from 'react';
import { useState } from 'react';
import { Steps } from 'antd';
import 'antd/dist/antd.css';
import styles from "./steps/Case.module.scss";
import ClientDetails from './steps/ClientDetails';
import CaseNotes from './steps/CaseNotes';
import Appointment from './steps/Appointment';
import { constants, initialFormData } from '../../config/constants';
import { CompleteCaseForm, SelectOption } from '../../Types/Type';
import { handleSubmitData } from '../../Service/SPServices/CreatecaseService';
import { getServicetype } from '../../Service/getServicetype';
import { validateStep } from '../../utils/ValidateStep';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Spinner/Loader';
const activeStepIcon = require('../../assets/png/Rounddot.png');
const completedStepIcon = require('../../assets/png/Checkmark.png');
const upcomingIcon = require('../../assets/png/Upcoming.png');
const backIcon = require('../../assets/png/backicon.png');

interface CreateNewCaseProps {
    mode: 'add' | 'edit';
    initialData?: any;
}


const CreateNewCase: React.FC<CreateNewCaseProps> = ({ mode, initialData }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [serviceType, setServiceType] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState(false);

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CompleteCaseForm, string>>>({});


    const [formData, setFormData] = useState<any>(
        initialData || initialFormData
    );
    const navigate = useNavigate();

    const stepTitles = [
        { title: "Client Details", subtitle: "client name" },
        { title: "Case Notes", subtitle: "case note summary" },

        { title: "Appointment", subtitle: "appointment details" },
    ];

    const { title } = stepTitles[currentStep];


    const steps = [
        {
            title: 'Client Details',
            component: ClientDetails,
            requiredFields: formData?.ClientType?.value === "Existing" ? ["ExistingClient"] : ['FirstName', 'LastName', 'PreferredName', 'DefaultServiceType', 'MobilePhone', 'Email', 'EEmail', 'EMobilePhone'],
        },
        {
            title: 'Case Notes',
            component: CaseNotes,
            requiredFields: ['CaseName', 'ServiceType', 'CaseManager', 'Description'],
        },
        {
            title: 'Appointment',
            component: Appointment,
            requiredFields: ['FromDateTime', 'ToDateTime', 'BillableType', 'ServiceType', 'CaseManager'],
        },
    ];

    const handleChange = <K extends keyof CompleteCaseForm>(

        key: K,
        value: CompleteCaseForm[K]
    ) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }));

        setFormErrors((prevErrors) => {
            const updated = { ...prevErrors };
            delete updated[key];
            return updated;
        });
    };



    const handleNext = () => {
        debugger;
        const { valid, fieldErrors } = validateStep(currentStep, steps, formData);

        if (!valid) {
            setFormErrors(fieldErrors);
            return;
        }

        setFormErrors({});
        setCurrentStep((prev) => prev + 1);
    };


    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
        }
    };
    const handleSubmit = async () => {
        const { valid, fieldErrors } = validateStep(currentStep, steps, formData);

        if (!valid) {
            setFormErrors(fieldErrors);
            return;
        }

        setLoading(true);

        try {
            if (mode === 'add') {
                await handleSubmitData(formData);
                setFormData(initialFormData);
            } else {
                console.log('Updating Case:', formData);
            }

            setTimeout(() => {
                // alert('Case submitted successfully!');
                navigate('/AllCases');
            }, 1000);
        } catch (error) {
            console.error('Submit Error:', error);
            alert('Error while submitting case.');
        } finally {
            setLoading(false);
        }
    };
    // const handleSubmit = async () => {
    //     // if (!validateStep(currentStep)) return;

    //     if (mode === 'add') {
    //         await handleSubmitData(formData)
    //         setFormData(initialFormData)
    //     } else {
    //         console.log('Updating Case:', formData);
    //     }
    //     alert('Case submitted successfully!');
    // };

    const fetchChoices = async () => {
        const serviceType = await getServicetype(constants.Listnames.ServiceType)
        setServiceType(serviceType)
        console.log("serviceType: ", serviceType);


    }
    React.useEffect(() => {
        fetchChoices()
    }, [])

    if (loading) {
        // return <CustomLoader message="Submitting case..." />;
        return <Loader />;
    }

    const CurrentStepComponent = steps[currentStep].component;

    return (

        <div className={styles.wrapper}>
            <div style={{ display: "flex", alignItems: "self-end", gap: "10px", marginBottom: "10px" }}>
                <img src={backIcon} alt="back" onClick={() => {
                    navigate("/")
                }} style={{
                    width: "22px",
                    height: "22px"
                }} />
                <h3 className={styles.title}>
                    {mode === 'add' ? 'Create New Case' : 'Edit Case'}
                </h3>
            </div>

            <div className={styles.layout}>
                {/* Ant Design Stepper */}
                <div className={styles.stepper}>


                    <Steps
                        direction="vertical"
                        current={currentStep}
                        onChange={(clickedStep) => {
                            // if (clickedStep > currentStep) {
                            //     const isValid = validateStep(currentStep);
                            //     if (!isValid) return;
                            // }
                            setCurrentStep(clickedStep);
                        }}
                        items={steps.map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isActive = index === currentStep;

                            return {
                                title: step.title,
                                icon: (
                                    <img
                                        src={isCompleted ? completedStepIcon : isActive ? activeStepIcon : upcomingIcon}
                                        alt="step icon"
                                        style={{
                                            width: 20,
                                            height: 20,
                                            objectFit: 'contain',
                                        }}
                                    />
                                )
                            };
                        })}
                    />
                </div>

                {/* Step Content */}
                <div className={styles.content}>

                    <div className={styles.stepHeader}>
                        <h3>{title}</h3>
                    </div>
                    <div className={styles.stepBody}>
                        <CurrentStepComponent data={formData} onChange={handleChange} serviceType={serviceType} setFormdata={setFormData} error={formErrors} setFormErrors={setFormErrors} />
                    </div>
                    {/* <CurrentStepComponent data={formData} onChange={handleChange} /> */}

                    <div className={styles.footer}>
                        <button disabled={currentStep === 0} onClick={handleBack}>
                            Back
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button onClick={handleNext}>Next</button>
                        ) : (
                            <button onClick={handleSubmit}>
                                {mode === 'add' ? 'Submit' : 'Update'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};




export default CreateNewCase;


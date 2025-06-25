import React from 'react';
import { useGetDocDetailQuery } from '../features/api/docAuthApi';
import doctorImage from '../icons/woman-doctor-wearing-lab-coat-with-stethoscope-isolated 1.png';

const DoctorImage = ({ doctorId, doctorName, className = "doctor-image-1" }) => {
    const { data: docDetail, isLoading, error } = useGetDocDetailQuery(doctorId);

    if (isLoading) {
        return (
            <div className="doctor-image-placeholder">
                <span>Loading...</span>
            </div>
        );
    }

    if (error || !docDetail?.doctor?.profilePhoto) {
        return (
            <img 
                className={className}
                src={doctorImage}
                alt={`Dr. ${doctorName}`}
            />
        );
    }

    return (
        <img 
            className={className}
            src={docDetail.doctor.profilePhoto}
            alt={`Dr. ${doctorName}`}
            onError={(e) => {
                e.target.src = doctorImage; // fallback image
            }}
        />
    );
};

export default DoctorImage;